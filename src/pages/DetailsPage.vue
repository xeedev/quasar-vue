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
        <q-input
          filled
          type="number"
          v-model="quantity"
          min="1"
          label="Quantity *"
          hint="Enter Required quantity"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'quantity is required']"
        />
        <div class="q-mt-lg">
          <q-btn color="black" class="q-mt-sm" label="Add to Cart" />
          <q-btn color="brown" class="q-ml-sm q-mt-sm" label="Buy Now" />
        </div>
      </div>
    </div>
    <div :class="$q.screen.sm || $q.screen.xs ? 'q-pa-md' : 'row q-pa-xl'">
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

export default {
  setup() {
    const router = useRouter();
    const product = ref();
    onMounted(async () => {
      let res = await Api.getOne('products',{'id':router.currentRoute.value.params.id});
      product.value = res.data.data
    })
    return {
      slide: ref(1),
      fullscreen: ref(false),
      quantity: ref(1),
      product
    };
  },
};
</script>
