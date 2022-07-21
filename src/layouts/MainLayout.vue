<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated reveal class="bg-white">
      <q-toolbar class="row justify-between items-center">
        <q-btn
          flat
          dense
          round
          color="dark"
          icon="menu"
          aria-label="Menu"
          v-if="!$q.screen.lg && !$q.screen.xl"
          @click="toggleLeftDrawer"
        />
        <q-img
          src="http://woodsurface.pk/jewelry/img/logo.png"
          spinner-color="white"
          @click="$router.push('/')"
          fit="contain"
          height="60px"
          class="q-ma-sm cursor-pointer"
          style="max-width: 150px"
        />
        <div class="row justify-between desktop-only items-center">
          <p
            class="q-px-xl text-black q-ma-none cursor-pointer"
            @click="$router.push('/')"
          >
            Home
          </p>
          <p
            class="q-px-xl text-black q-ma-none cursor-pointer"
            @click="$router.push('/two')"
          >
            TWO
          </p>
          <q-btn
            fab-mini
            class="q-mx-md"
            icon="shopping_cart"
            color="dark">
          <q-menu fit>
            <q-list style="min-width: 300px; height: 400px">
              <q-item clickable>
                <q-item-section>Cart Items</q-item-section>
              </q-item>
              <q-separator />
              <q-item>
                <q-item-section>No Items</q-item-section>
              </q-item>
              <q-separator />
              <q-item>
                <q-item-section>
                  <div class="row items-center">
                    <div class="col-md-2">
                      <q-img height="50px" width="50px" src="http://127.0.0.1:8000/storage/media/1657614168-b5Z4r9sC2Y.jpg" />
                    </div>
                    <div class="col-md-10">
                      <h6 class="q-ml-md q-pa-none q-ma-none">Item Name Here</h6>
                      <p class="q-ml-md q-pa-none q-ma-none">PKR: 756</p>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item>
                <q-item-section>
                  <div class="row items-center">
                    <div class="col-md-2">
                      <q-img height="50px" width="50px" src="http://127.0.0.1:8000/storage/media/1657614168-b5Z4r9sC2Y.jpg" />
                    </div>
                    <div class="col-md-10">
                      <h6 class="q-ml-md q-pa-none q-ma-none">Item Name Here</h6>
                      <p class="q-ml-md q-pa-none q-ma-none">PKR: 756</p>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item>
                <q-item-section>
                  <div class="row items-center">
                    <div class="col-md-2">
                      <q-img height="50px" width="50px" src="http://127.0.0.1:8000/storage/media/1657614168-b5Z4r9sC2Y.jpg" />
                    </div>
                    <div class="col-md-10">
                      <h6 class="q-ml-md q-pa-none q-ma-none">Item Name Here</h6>
                      <p class="q-ml-md q-pa-none q-ma-none">PKR: 756</p>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item>
                <q-item-section>
                  <div class="row items-center">
                    <div class="col-md-2">
                      <q-img height="50px" width="50px" src="http://127.0.0.1:8000/storage/media/1657614168-b5Z4r9sC2Y.jpg" />
                    </div>
                    <div class="col-md-10">
                      <h6 class="q-ml-md q-pa-none q-ma-none">Item Name Here</h6>
                      <p class="q-ml-md q-pa-none q-ma-none">PKR: 756</p>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item>
                <q-item-section>
                  <div class="row items-center">
                    <div class="col-md-2">
                      <q-img height="50px" width="50px" src="http://127.0.0.1:8000/storage/media/1657614168-b5Z4r9sC2Y.jpg" />
                    </div>
                    <div class="col-md-10">
                      <h6 class="q-ml-md q-pa-none q-ma-none">Item Name Here</h6>
                      <p class="q-ml-md q-pa-none q-ma-none">PKR: 756</p>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item>
                <q-item-section>
                  <q-btn class="q-mx-md" outline label="Check Out" color="dark"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
          </q-btn>
          <q-btn class="q-mx-md" label="LOGIN" @click="$router.push('/login')" color="dark"/>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      v-if="!$q.screen.lg && !$q.screen.xl"
    >
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
<!--    <q-footer reveal>-->
<!--      <q-toolbar class="bg-black text-center">-->
<!--        <q-toolbar-title-->
<!--          >-->
<!--          ©{{ new Date().getFullYear() }} Wood Surface, All rights-->
<!--          reserved-->
<!--        </q-toolbar-title-->
<!--        >-->
<!--        &lt;!&ndash; <q-btn flat round dense icon="facebook" />-->
<!--        <q-btn flat round dense icon="instagram" /> &ndash;&gt;-->
<!--      </q-toolbar>-->
<!--    </q-footer>-->
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: 'Home',
    caption: 'home page',
    icon: 'home',
    link: '',
  },
  {
    title: 'TWO',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'TWO',
  },
  {
    title: 'Login',
    caption: 'Login',
    icon: 'user',
    link: 'login',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
