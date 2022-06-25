<template>
  <div>
    <q-carousel
      swipeable
      animated
      v-model="slide"
      thumbnails
      infinite
      height="100vh"
    >
      <q-carousel-slide
        :name="1"
        img-src="https://cdn.quasar.dev/img/mountains.jpg"
      />
      <q-carousel-slide
        :name="2"
        img-src="https://cdn.quasar.dev/img/parallax1.jpg"
      />
      <q-carousel-slide
        :name="3"
        img-src="https://cdn.quasar.dev/img/parallax2.jpg"
      />
      <q-carousel-slide
        :name="4"
        img-src="https://cdn.quasar.dev/img/quasar.jpg"
      />
    </q-carousel>
    <div>
      <q-tabs v-model="tab" align="justify" narrow-indicator class="q-mb-lg">
        <template v-for="(category, index) in categories" :key="index">
          <q-tab
            class="text-black"
            :name="category.key"
            :label="category.value"
          />
        </template>
      </q-tabs>

      <div class="q-gutter-y-sm">
        <q-tab-panels
          v-model="tab"
          animated
          transition-prev="scale"
          transition-next="scale"
          class="text-white text-center"
        >
          <template v-for="(category, index) in categories" :key="index">
            <q-tab-panel :name="category.key">
              <div class="text-h6">{{ category.value }}</div>
              <div class="row justify-center">
                <template
                  v-for="(image, index) in category.images"
                  :key="index"
                >
                  <q-card
                    class="my-card q-ma-md cursor-pointer"
                    @click="$router.push('/three')"
                  >
                    <q-img :src="image" spinner-color="black" />

                    <q-card-section>
                      <q-btn
                        fab
                        color="primary"
                        icon="place"
                        class="absolute"
                        style="top: 0; right: 12px; transform: translateY(-50%)"
                      />

                      <div class="row no-wrap items-center">
                        <div class="col text-h6 ellipsis">
                          Cafe Basilico ({{ index }})
                        </div>
                        <div
                          class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
                        >
                          <q-icon name="place" />
                          250 ft
                        </div>
                      </div>

                      <q-rating v-model="stars" :max="5" size="32px" />
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                      <div class="text-subtitle1">$・Italian, Cafe</div>
                      <div class="text-caption text-grey">
                        Small plates, salads & sandwiches in an intimate
                        setting.
                      </div>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions>
                      <q-btn flat round icon="event" />
                      <q-btn flat color="primary"> Reserve </q-btn>
                    </q-card-actions>
                  </q-card>
                </template>
              </div>
            </q-tab-panel>
          </template>
        </q-tab-panels>
      </div>
      <q-btn
        color="black"
        class="full-width"
        label="Get All"
        @click="getAll()"
      />
      <q-btn
        color="red"
        class="full-width"
        label="Get Detail"
        @click="getDetail(1)"
      />
      <q-btn
        color="yellow"
        class="full-width text-black"
        label="Post"
        @click="postText()"
      />
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
import { defineComponent, ref } from 'vue';
import http from '../api/axios.js';

import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'IndexPage',
  components: { ContactUs },
  setup() {
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
    const categories = ref<Category[]>([
      {
        id: 1,
        type: 'ct1',
        key: 'a',
        value: 'A',
        images: [
          'https://picsum.photos/200',
          'https://picsum.photos/201',
          'https://picsum.photos/202',
          'https://picsum.photos/203',
          'https://picsum.photos/204',
          'https://picsum.photos/205',
          'https://picsum.photos/206',
          'https://picsum.photos/207',
        ],
      },
      {
        id: 2,
        type: 'ct2',
        key: 'b',
        value: 'B',
        images: [
          'https://picsum.photos/208',
          'https://picsum.photos/209',
          'https://picsum.photos/210',
          'https://picsum.photos/213',
          'https://picsum.photos/214',
          'https://picsum.photos/215',
          'https://picsum.photos/216',
          'https://picsum.photos/217',
        ],
      },
      {
        id: 3,
        type: 'ct3',
        key: 'c',
        value: 'C',
        images: [
          'https://picsum.photos/220',
          'https://picsum.photos/221',
          'https://picsum.photos/222',
          'https://picsum.photos/223',
          'https://picsum.photos/224',
          'https://picsum.photos/225',
          'https://picsum.photos/226',
          'https://picsum.photos/227',
        ],
      },
      {
        id: 4,
        type: 'ct4',
        key: 'd',
        value: 'D',
        images: [
          'https://picsum.photos/230',
          'https://picsum.photos/231',
          'https://picsum.photos/232',
          'https://picsum.photos/233',
          'https://picsum.photos/234',
          'https://picsum.photos/235',
          'https://picsum.photos/236',
          'https://picsum.photos/237',
        ],
      },
      {
        id: 5,
        type: 'ct5',
        key: 'e',
        value: 'E',
        images: [
          'https://picsum.photos/230',
          'https://picsum.photos/231',
          'https://picsum.photos/232',
          'https://picsum.photos/233',
          'https://picsum.photos/234',
          'https://picsum.photos/235',
          'https://picsum.photos/236',
          'https://picsum.photos/237',
        ],
      },
      {
        id: 1,
        type: 'ct1',
        key: 'f',
        value: 'F',
        images: [
          'https://picsum.photos/200',
          'https://picsum.photos/201',
          'https://picsum.photos/202',
          'https://picsum.photos/203',
          'https://picsum.photos/204',
          'https://picsum.photos/205',
          'https://picsum.photos/206',
          'https://picsum.photos/207',
        ],
      },
      {
        id: 2,
        type: 'ct2',
        key: 'g',
        value: 'G',
        images: [
          'https://picsum.photos/240',
          'https://picsum.photos/241',
          'https://picsum.photos/242',
          'https://picsum.photos/243',
          'https://picsum.photos/244',
          'https://picsum.photos/245',
          'https://picsum.photos/246',
          'https://picsum.photos/247',
        ],
      },
      {
        id: 3,
        type: 'ct3',
        key: 'h',
        value: 'H',
        images: [
          'https://picsum.photos/250',
          'https://picsum.photos/251',
          'https://picsum.photos/252',
          'https://picsum.photos/253',
          'https://picsum.photos/254',
          'https://picsum.photos/255',
          'https://picsum.photos/256',
          'https://picsum.photos/257',
        ],
      },
      {
        id: 4,
        type: 'ct4',
        key: 'i',
        value: 'I',
        images: [
          'https://picsum.photos/260',
          'https://picsum.photos/261',
          'https://picsum.photos/262',
          'https://picsum.photos/263',
          'https://picsum.photos/264',
          'https://picsum.photos/265',
          'https://picsum.photos/266',
          'https://picsum.photos/267',
        ],
      },
      {
        id: 5,
        type: 'ct5',
        key: 'j',
        value: 'J',
        images: [
          'https://picsum.photos/270',
          'https://picsum.photos/271',
          'https://picsum.photos/272',
          'https://picsum.photos/273',
          'https://picsum.photos/274',
          'https://picsum.photos/275',
          'https://picsum.photos/276',
          'https://picsum.photos/277',
        ],
      },
    ]);
    const $q = useQuasar();
    return {
      todos,
      meta,
      slide,
      stars: ref(5),
      tab: ref('a'),
      categories,
      async getAll() {
        $q.loading.show();
        let $res = await http.getAll();
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
