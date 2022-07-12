<template>
  <div>
    <q-carousel
      swipeable
      animated
      v-model="slide"
      thumbnails
      infinite
      height="70vh"
    >
      <q-carousel-slide
        v-for="(image,key) in images"
        :key="key"
        :name="key+1"
        :img-src="image"
      />
    </q-carousel>
    <div>
      <h5 class="text-center text-bold">Our Products</h5>
      <q-tabs v-model="tab" @click="updateProducts" align="justify" narrow-indicator class="q-mb-lg">
        <template v-for="(category, index) in categoriess" :key="index">
          <q-tab
            class="text-black"
            :name="category"
            :label="category"
          />
        </template>
      </q-tabs>

      <div class="q-gutter-y-sm">
        <div class="row justify-center">
          <template
            v-for="(category, index) in categories"
            :key="index"
          >
            <q-card
              class="text-dark my-card q-ma-md cursor-pointer"
              @click="$router.push('/three')"
            >
              <q-img :src="category?.media[0]?.url" spinner-color="black" />

              <q-card-section>
                <q-btn
                  fab
                  color="red"
                  icon="favorite"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%)"
                />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    {{category.name}}
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px" />
              </q-card-section>

              <q-separator />

              <q-card-actions>
                <q-btn flat round icon="event" />
                <q-btn flat color="primary"> Read More</q-btn>
              </q-card-actions>
            </q-card>
          </template>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row q-pa-xl">
      <div class="col-md-6 col-sm-12">
        <h4 class="q-mb-none"><strong>GET IN TOUCH</strong></h4>
        <p class="q-ma-none">
          For any kind of queries please feel free to contact us,
        </p>
        <h6 class="q-mt-none">Pakistan</h6>
        <p class="q-mt-none"><strong>03004645434</strong></p>
        <p><strong>woodsurface99@gmail.com</strong></p>
        <p><strong>Lahore, Punjab, pakistan</strong></p>
      </div>
      <div class="col-md-6 col-sm-12"><ContactUs /></div>
    </div>
  </div>
  <!-- </q-page> -->
</template>

<script lang="ts">
import { Todo, Meta, Category } from 'components/models';
import ContactUs from 'src/components/ContactUs.vue';
// import ExampleComponent from 'components/ExampleComponent.vue';
import { defineComponent, ref,onMounted } from 'vue';
import http from '../api/axios.js';

import { useQuasar } from 'quasar';
import Api from "src/services/api";

export default defineComponent({
  name: 'IndexPage',
  components: { ContactUs },
  setup() {
    const products = ref([]);
    const images = ref([]);
    const todos = ref<Todo[]>([
      {
        id: 1,
        content: 'ct1',
      },
      {
        id: 2,
        content: 'ct2',
      },
      {
        id: 3,
        content: 'ct3',
      },
      {
        id: 4,
        content: 'ct4',
      },
      {
        id: 5,
        content: 'ct5',
      },
    ]);
    const meta = ref<Meta>({
      totalCount: 1200,
    });
    const slide = ref(1);
    const tab = ref('all');
    const categories = ref([]);
    const categoriess = ref(['all']);
    const url = process.env.ROOT_URL + '/public/media/1657039301-9RXEN7lTHA.png';
    const testUrl = url.replace("public/", "storage/");
    const $q = useQuasar();
    function getCategories(xs : any, key: any) {
      return [...new Set(xs.map(item => item.category))];
    }
    function updateProducts(){
      categories.value = [];
      categories.value = tab.value === 'all' ? products.value : products.value.filter( product => product.category == tab.value );
    }
    onMounted(async () => {
      let res = await Api.getList('gallery');
      res.data.data.forEach(i => {
        images.value.push(i.url)
      })
      let response = await Api.getList('products')
      products.value = response.data.data
      categories.value = response.data.data
      // tab.value = categories.value[0].category
      let cat = getCategories(products.value,'category')
      cat.forEach(c=>{
        categoriess.value.push(c)
      })

      console.log('categoriess.value',categoriess.value)
    })
    return {
      testUrl,
      todos,
      meta,
      slide,
      images,
      products,
      categoriess,
      getCategories,
      updateProducts,
      tab,
      stars: ref(5),
      categories,
      async getAll() {
        $q.loading.show();
        let $res = await http.login();
        console.log($res);
        $q.loading.hide();
      },
      async getDetail(id: number) {
        $q.loading.show();
        let $res = await http.get(id);
        console.log($res);
        $q.loading.hide();
      },
      async postText() {
        $q.loading.show({
          message: 'Posting comment. Please wait...',
          spinnerColor: 'primary',
        });
        let $res = await http.create({
          description: 'dummy description',
          'added by': 'xeemax',
        });
        console.log($res);
        $q.loading.hide();
      },
    };
  },
});
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 300px
</style>
