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
        <h4>Sample Product name</h4>
        <h5 class="text-red"><strong>PKR 70,000</strong></h5>
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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sapien
        nunc, laoreet non tincidunt sit amet, consequat vel nunc. Fusce pretium
        risus et justo imperdiet semper. Proin ut lacinia lectus, eu congue
        lorem. Aliquam vel nunc volutpat, rutrum augue sit amet, ullamcorper
        arcu. Donec lacinia iaculis odio, vel vestibulum quam rutrum ut.
        Praesent consectetur sapien ac sollicitudin ultrices. Morbi eget
        pulvinar urna, nec faucibus dolor. Donec erat nisl, hendrerit et magna
        in, convallis gravida turpis. Pellentesque aliquam sit amet risus sit
        amet feugiat. Quisque ornare vehicula justo a mollis. Mauris eget sapien
        eget neque efficitur pellentesque non eu libero. Interdum et malesuada
        fames ac ante ipsum primis in faucibus. Etiam ac cursus justo. Morbi
        tincidunt tellus a est posuere, at tristique est fermentum. Aliquam
        euismod mauris ac ante interdum bibendum. Quisque vestibulum quam ut
        mauris iaculis suscipit. Maecenas imperdiet augue sodales, euismod
        lectus nec, porta nisl. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Integer porttitor urna non augue pellentesque, eget
        viverra metus tempus. Nullam quam diam, cursus a pellentesque sit amet,
        pretium ac massa. Nunc sagittis, neque egestas auctor rutrum, lorem quam
        condimentum diam, id aliquam elit nisl ultrices arcu. Class aptent
        taciti sociosqu ad litora torquent per conubia nostra, per inceptos
        himenaeos. Aliquam suscipit nunc vel magna ultrices, vitae tempor urna
        cursus. Maecenas viverra ipsum eros, posuere luctus velit commodo id.
        Nullam maximus metus at odio consequat, ac pretium felis convallis.
        Praesent libero justo, mollis sit amet blandit in, vehicula quis tellus.
        Proin pharetra velit nec leo viverra fringilla. Morbi faucibus volutpat
        enim, quis pulvinar diam hendrerit quis. Phasellus euismod venenatis
        auctor. Nulla non libero at ipsum ullamcorper malesuada. Aenean ac
        accumsan lorem, a vehicula arcu. Sed ultrices porttitor fermentum. Nulla
        varius mollis mauris, ac blandit ligula laoreet at. Suspendisse a
        condimentum arcu. Quisque blandit est urna, in convallis velit volutpat
        ac. Vestibulum dapibus, quam id rutrum sollicitudin, sapien est maximus
        velit, sit amet laoreet mauris odio eget est. Donec vehicula turpis ex,
        nec aliquet nibh porta in. Donec facilisis risus quis lacinia eleifend.
        Donec pharetra pulvinar magna luctus venenatis. Fusce vel maximus
        lectus. Aenean accumsan ornare diam non feugiat. Sed placerat dapibus
        ipsum eu ultrices. Nam posuere nisl ac eros auctor, eu imperdiet quam
        luctus. Etiam sit amet ultricies enim. Curabitur ex turpis, convallis ut
        enim ac, viverra consectetur orci. Sed maximus turpis massa, et feugiat
        elit interdum non. Mauris gravida imperdiet risus a tempor. Praesent
        lacus nunc, finibus vel congue quis, iaculis ut massa. Praesent at enim
        dolor. Cras id risus eu felis auctor venenatis sed ut enim. Morbi quis
        odio id lectus gravida rhoncus sed sit amet lacus. Curabitur consectetur
        dignissim risus vitae volutpat. Nullam in ultrices metus. Proin blandit
        maximus consequat. Quisque eu pellentesque ligula.
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    return {
      slide: ref(1),
      fullscreen: ref(false),
      quantity: ref(1),
    };
  },
};
</script>
