<template>
  <div class="q-pa-md">
    <h6 class="q-pa-none q-ma-none">Upload Home Page Images</h6>
    <div class="row q-gutter-md">
      <q-card class="my-card cursor-pointer" @click="$refs.image.click()">
        <q-card-section class="q-ma-none q-pa-none section">
          <q-icon name="perm_media" size="xl" />
        </q-card-section>
      </q-card>
      <input
        style="display: none"
        type="file"
        ref="image"
        multiple
        accept="image/*"
        @change="uploadImages"
      />
      <template v-for="(image,index) in images" :key="index">
        <q-card class="my-card" :style="
                'background-image: url(' +
                image +
                '); background-size: cover'
              ">
          <q-icon name="close" class="absolute close bg-red-5 border-radius-inherit cursor-pointer" @click="removeUrl(index)"></q-icon>
        </q-card>
      </template>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import Api from '../services/api';
import {useQuasar} from 'quasar';
import axios from 'axios';

export default {
  setup () {
    const $q = useQuasar()
    const images = ref([])
    onMounted(async () => {
      let res = await Api.getList('gallery')
      res.data.data.forEach(media=>{
        images.value.push(media.url)
      })
    })
    function uploadImages(event) {
      this.onFilesPicked(event);
    }
    async  function  onFilesPicked (event) {
      const files = event.target.files;
      if (!files.length) {
        return;
      }

      $q.loading.show();
      axios
        .post(process.env.BASE_URL+'/imageUpload', files, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then(async (response) => {
          let urls = response.data.urls;
          urls.forEach(url => {
            url = process.env.ROOT_URL+ '/' + url
            images.value.push(url.replace('public/', 'storage/'))
          })
          await Api.post('gallery',{images: images.value})
        });
      $q.loading.hide();
    }
    function removeUrl(index){
      images.value.splice(index, 1);
    }
    return {
      images,
      removeUrl,
      onFilesPicked,
      uploadImages
    }
  }
}
</script>
<style lang="sass" scoped>
.my-card
  width: 100px
  height: 100px
  border-radius: 10px
  border: 1px dashed black
  display: flex
  justify-content: center
.section
  display: flex
  justify-content: center
  align-items: center
.close
  right: 0
</style>
