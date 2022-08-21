<template>
  <div class="q-pa-md">
    <h6 class="q-pa-none q-ma-none">Upload Home Page Images</h6>
    <q-input
      dense
      outlined
      v-model="size"
      label="Image Upload Size *"
      hint="Image Upload Size"
      lazy-rules
      :rules="[ val => val && val > 0.20 && val <= 2 || 'Value must be between 0.2 and 2 MB']"
    />
    <div class="row q-gutter-md">
      <q-card class="my-card cursor-pointer" @click="$refs.image.click()" v-if="size > 0.20 && size <= 2">
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
import imageCompression from 'browser-image-compression';

export default {
  setup () {
    const $q = useQuasar()
    const size = ref(localStorage.getItem('size') ?? 0.25)
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
      let files = event.target.files;
      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        file = await compressFile(file, size.value);
        console.log(file);
        formData.append('files[]', file);
      }

      if (!files.length) {
        return;
      }

      $q.loading.show();
      axios
        .post(process.env.BASE_URL+'/imageUpload', formData, {
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
     const compressFile = (imageFile, maxSize = 1.5) => {
       let size = imageFile.size / 1024 / 1024; // in MiB
       if (size < 0.2) {
         return imageFile;
       }

       return new Promise((resolve, reject) => {
         let options = {
           maxSizeMB: maxSize,
           maxWidthOrHeight: 1920,
           useWebWorker: true
         };
         localStorage.setItem('size',maxSize)
         imageCompression(imageFile, options)
           .then(function(compressedFile) {
             resolve(compressedFile);
           })
           .catch(function(error) {
             reject(error.message);
           });
       });
     };
    function removeUrl(index){
      images.value.splice(index, 1);
    }
    return {
      images,
      size,
      removeUrl,
      onFilesPicked,
      uploadImages,
      compressFile
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
