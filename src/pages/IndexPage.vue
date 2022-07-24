<template>
  <div>
    <q-carousel
      swipeable
      animated
      v-model="slide"
      thumbnails
      infinite
      height="90vh"
    >
      <q-carousel-slide
        v-for="(image,key) in images"
        :key="key"
        :name="key+1"
        :img-src="image"
      >
        <div class="absolute-center custom-caption">
          <div :class="$q.screen.sm || $q.screen.xs ? 'text-h6' : 'text-h2'">Premium Wooden Epoxy Products</div>
          <div class="text-subtitle2">Unique wooden Epoxy Items</div>
        </div>
      </q-carousel-slide>
    </q-carousel>
    <div>
      <h5 class="text-center text-bold">Our Products</h5>
      <q-tabs v-model="tab" @click="updateProducts" align="justify" narrow-indicator class="q-mb-lg">
        <template v-for="(category, index) in categories" :key="index">
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
            v-for="(product, index) in products"
            :key="index"
          >
            <q-card
              class="text-dark my-card q-ma-md cursor-pointer"
              @click="push($event,'/product/'+ product.id)"
            >
              <q-img :src="product?.media[0]?.url" spinner-color="black" style="height: 280px" />

              <q-card-section>
                <q-btn
                  fab
                  color="dark"
                  size="10px"
                  icon="favorite"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%)"
                />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">
                    {{product.name}}
                  </div>
                </div>

                <q-rating v-model="stars" readonly color="dark" :max="5" size="25px" />
                <span class="q-ml-md"><strong>RS: {{product.price}}</strong></span>
              </q-card-section>

              <q-separator />

              <q-card-actions>
                <q-btn flat round :loading="addingToCart" icon="shopping_cart" @click="addToCart(product.id)" />
                <q-btn flat color="dark"> View Details</q-btn>
              </q-card-actions>
            </q-card>
          </template>
        </div>
      </div>
    </div>
  </div>
  <div class="container bg-black text-white">
    <div class="row" :class="$q.screen.sm || $q.screen.xs ? 'q-pa-md' : 'q-pa-xl'">
      <div class="col-md-6 col-sm-12">
        <q-img
          src="logo.png"
          spinner-color="white"
          @click="$router.push('/')"
          fit="contain"
          height="150px"
          class="q-my-sm cursor-pointer"
          style="max-width: 150px"
        />
        <p class="q-ma-none">
          For any kind of queries please feel free to contact us,
        </p>
        <p class="q-mt-none"><strong>03004645434</strong></p>
        <p><strong>woodsurface99@gmail.com</strong></p>
        <p><strong>Lahore, Punjab, pakistan</strong></p>
      </div>
      <div class="col-md-6 col-sm-12" :class="$q.screen.sm || $q.screen.xs ? 'full-width' : ''"><ContactUs /></div>
    </div>
  </div>
  <!-- </q-page> -->
</template>

<script lang="ts">
import ContactUs from 'src/components/ContactUs.vue';
import { defineComponent, ref,onMounted } from 'vue';
import { useQuasar } from 'quasar';
import Api from 'src/services/api';
import { useRouter } from 'vue-router';
import {useCartStore} from 'stores/useCart';

export default defineComponent({
  name: 'IndexPage',
  components: { ContactUs },
  setup() {
    const cart = useCartStore();
    const products = ref([]);
    const allProducts = ref([]);
    const images = ref([]);
    const slide = ref(1);
    const tab = ref('all');
    const addingToCart = ref(false);
    const categories = ref(['all']);
    const $q = useQuasar();
    const router = useRouter();
    function getCategories(xs : any, key: any) {
      return [...new Set(xs.map(item => item.category))];
    }
    function push(e='',path=''){
      if (e.target.tagName !== 'I'){
        router.push(path);
      }
    }
    function updateProducts(){
      products.value = [];
      products.value = tab.value === 'all' ? allProducts.value : allProducts.value.filter( product => product.category == tab.value );
    }
    onMounted(async () => {
      let res = await Api.getList('gallery');
      res.data.data.forEach(i => {
        images.value.push(i.url)
      })
      let response = await Api.getList('products')
      allProducts.value = response.data.data
      products.value = response.data.data
      let cat = getCategories(products.value,'category')
      cat.forEach(c=>{
        categories.value.push(c)
      })

    })
    async function addToCart(id:number){
      addingToCart.value = true;
      let response = await Api.getOne('products', {id})
      if (response.data.success){
        let cartItem = {
          'name' : response?.data?.data?.name,
          'price' : response?.data?.data?.price,
          'image' : response?.data?.data?.media[0].url,
          'quantity' : 1,
          'total' : response?.data?.data?.price,
        }
        cart.addToCart(cartItem)
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Product added to cart',
        });
      }else{
        $q.notify({
          color: 'red-10',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Something Went Wrong',
        });
      }
      addingToCart.value = false;
    }
    return {
      slide,
      images,
      products,
      allProducts,
      addingToCart,
      cart,
      tab,
      stars: ref(5),
      categories,
      addToCart,
      updateProducts,
      push
    };
  },
});

</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 300px
.full-width
  width: 100%
.custom-caption
  width: 100%
  text-align: center
  padding: 50px 20px
  color: white
  background-color: rgba(0, 0, 0, 0.6)
  font-family: Circular-loom,serif
.text-subtitle2
  font-size: 1.375rem
  margin-top: 20px
</style>
