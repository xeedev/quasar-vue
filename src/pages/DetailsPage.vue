<template>
  <div>
    <div :class="$q.screen.sm || $q.screen.xs ? '' : 'row q-pa-xl'">
      <div class="col-md-6 col-sm-12">
        <q-carousel
          swipeable
          animated
          arrows
          v-model="slide"
          v-model:fullscreen="fullscreen"
          infinite
          thumbnails
        >
          <template v-for="(productImage, index) in  product?.media" :key="index">
            <q-carousel-slide
              :name="index+1"
              :img-src="productImage.url"
            />
          </template>

          <template v-slot:control>
            <q-carousel-control position="bottom-right" :offset="[18, 18]">
              <q-btn
                push
                round
                dense
                color="white"
                text-color="primary"
                :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="fullscreen = !fullscreen"
              />
            </q-carousel-control>
          </template>
        </q-carousel>
      </div>
      <div class="col-md-6 col-sm-12 q-px-sm">
        <h4>{{product?.name}}</h4>
        <h5 class="text-red"><strong>PKR {{product?.price}}</strong></h5>
        <div class="row" style="width: 250px">
          <div class="col">
            <q-btn icon="minimize" size="md" color="red" @click="quantity !== 1 ? quantity-- : quantity"></q-btn>
          </div>
          <div class="col">
            <q-input
              outlined
              dense
              style="width: 50px"
              type="text"
              readonly
              v-model="quantity"
              min="1"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'quantity is required']"
            />
          </div>
          <div class="col">
            <q-btn icon="add" size="md" color="primary" @click="quantity++"></q-btn>
          </div>
        </div>
        <div class="q-mt-lg">
          <q-btn color="black" class="q-mt-sm" label="Add to Cart" @click="addToCart(product)" />
          <q-btn color="black" outline class="q-ml-sm q-mt-sm" label="Explore Product"  @click="alert = true" />
        </div>
      </div>
    </div>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-actions align="right">
          <q-btn icon="close" style="min-width: 3px" size="5px" color="dark" v-close-popup />
        </q-card-actions>
        <q-card-section>
          <div class="text-h6">Send A query about this product</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row block">
            <div class="col">
              {{product?.detail}}
            </div>
            <div class="col">
              <q-img :src="product?.media[0].url">
              </q-img>
            </div>
          </div>
          <div>
            <q-form
              @submit="onSubmit"
              class="q-gutter-md q-mt-md"
            >
              <q-input
                dense
                outlined
                class="bg-white"
                clearable
                v-model="name"
                label="Your name *"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']"
              />

              <q-input
                dense
                outlined
                clearable
                type="email"
                v-model="email"
                label="Your Email *"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']"
              />

              <q-input
                dense
                outlined
                clearable
                type="number"
                v-model="contact"
                label="Your Contact Number *"
                lazy-rules
                :rules="[
          val => val !== null && val !== '' || 'Please type your number',
        ]"
              />
              <q-input
                dense
                outlined
                clearable
                v-model="message"
                label="your message *"
                type="textarea"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']"
              />
              <div>
                <q-btn label="Send Query" :loading="submitLoading" type="submit" color="black"/>
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div style="display: block" :class="$q.screen.sm || $q.screen.xs ? 'q-pa-md' : 'row q-pa-xl'">
      <h6 class="q-py-none q-my-none">Description:</h6>
      <p>
        {{product?.detail}}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Api from '../services/api';
import {useRouter} from 'vue-router';
import {useQuasar} from 'quasar';
import {useCartStore} from '../stores/useCart';
import {useAuthStore} from "../stores/useAuth";

export default {
  setup() {
    const cart = useCartStore();
    const store = useAuthStore();
    const router = useRouter();
    const $q = useQuasar()
    const product = ref();
    const name = ref();
    const quantity = ref(1);
    const email = ref();
    const contact = ref();
    const message = ref();
    const alert=  ref(false);
    const submitLoading = ref(false)

      onMounted(async () => {
      let res = await Api.getOne('products',{'id':router.currentRoute.value.params.id});
      product.value = res.data.data
    })
    async function onSubmit () {
      submitLoading.value = true
      let res = await Api.post('general-query',{
        'userName' : name.value,
        'userEmail' : email.value,
        'userContact' : contact.value,
        'userMessage' : message.value,
        'product_id' : product.value.id
      })
      submitLoading.value = false
      if (res.status === 200){
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: "Thank you for contacting us, we'll get back to you shortly"
        })
        onReset()
        alert.value = false
      }else {
        $q.notify({
          color: 'red-10',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'something went wrong'
        })
      }
    }
    function onReset () {
      name.value = null
      email.value = null
      contact.value = null
      message.value = null
    }
    async function addToCart(product) {
      if (store.isAuthenticated){
        let cartItem = {
          'name' : product.name,
          'price' : product.price,
          'quantity' : quantity.value,
          'total' : product.price * quantity.value,
          'image' : product.media[0].url,
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
          message: 'Please login to add to cart',
        });
      }
    }
    return {
      slide: ref(1),
      fullscreen: ref(false),
      name,
      email,
      contact,
      message,
      product,
      alert,
      submitLoading,
      quantity,
      store,
      addToCart,
      onSubmit,
      onReset
    };
  },
};
</script>
