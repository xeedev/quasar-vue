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
          src="logo.png"
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
          <q-btn
            fab-mini
            class="q-mx-md"
            flat
            icon="shopping_cart"
            text-color="black"
            >
          <q-menu fit>
            <q-list style="min-width: 300px; height: 400px">
              <q-item>
                <q-item-section class="text-center text-bold">Cart Items</q-item-section>
              </q-item>
              <q-separator />
              <q-item v-if="cart.cartItems.length === 0">
                <q-item-section class="text-center">No Items</q-item-section>
              </q-item>
              <template v-else v-for="(cart, index) in cart.cartItems" :key="index">
                <q-separator />
                <q-item>
                  <q-item-section>
                    <div class="row items-center">
                      <div class="col-md-2">
                        <q-img height="50px" width="50px" :src="cart.image" />
                      </div>
                      <div class="col-md-10">
                        <h6 class="q-ml-md q-pa-none q-ma-none">{{cart.name}}</h6>
                        <span class="q-ml-md q-pa-none q-ma-none">PKR: {{cart.price}}</span> <span><q-badge color="red">{{cart.quantity}}</q-badge></span>
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </template>
              <q-item v-if="cart.cartItems.length">
                <q-item-section>
                  <q-btn class="q-mx-md" outline label="Check Out" color="dark" @click="$router.push('/checkout')"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
          </q-btn>
          <q-btn v-if="!store.isAuthenticated" class="q-mx-md q-px-xl" rounded label="LOGIN" @click="$router.push('/login')" color="dark"/>
          <q-btn v-if="store.isAuthenticated" class="q-mx-md" label="Logout" @click="logout" color="dark"/>
          <q-btn v-if="!store.isAuthenticated" class="q-mx-md q-px-xl" outline rounded label="REGISTER" @click="$router.push('/register')" color="dark"/>
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
import {defineComponent, onMounted, ref} from 'vue';

import EssentialLink from 'components/EssentialLink.vue';
import Api from 'src/services/api';
import {useRouter} from 'vue-router';
import {useAuthStore} from 'stores/useAuth';
import {useCartStore} from 'stores/useCart';

const linksList = [
  {
    title: 'Home',
    caption: 'home page',
    icon: 'home',
    link: '',
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
    const store = useAuthStore();
    const cart = useCartStore();
    const router = useRouter()
    async function logout(){
      await Api.post('logout');
      isLoggedIn.value = false
      store.changeAuthStatus(false)
      localStorage.removeItem('token')
      localStorage.removeItem('token_check')
      router.push({path:'/'})
    }
    const isLoggedIn = ref(false)
    onMounted(async () => {
      await Api.getList( 'validateToken').then((response) => {
        if (response?.data?.authenticated){
          store.changeAuthStatus(true)
        }
      });
    })
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      isLoggedIn,
      store,
      cart,
      logout,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
