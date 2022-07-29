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
        <q-btn
          fab-mini
          class="q-mx-md mobile-only"
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

        <q-item clickable @click="$router.push('/')">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="$router.push('/login')" v-if="!store.isAuthenticated">
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Login</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="$router.push('/register')" v-if="!store.isAuthenticated">
          <q-item-section avatar>
            <q-icon name="person_add" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Register</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="logout" v-if="store.isAuthenticated">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <div class="bg-black block text-center">
      <div class="col text-white text-h6">
        <span>
          <a href="https://www.instagram.com/woodsurface/?igshid=YmMyMTA2M2Y%3D" target="_blank">
                      <q-btn
                        fab-mini
                        class="q-mx-md"
                        flat
                        icon="ti-instagram"
                        text-color="white"
                      />
          </a>
        </span>
        <span>
          <a href="https://www.facebook.com/woodsurface/" target="_blank">
                      <q-btn
                        fab-mini
                        class="q-mx-md"
                        flat
                        icon="ti-facebook"
                        text-color="white"
                      />
          </a>
        </span>
      </div>
    </div>
    <div class="bg-black block text-center">
      <div class="col text-white text-h6">© All Rights Reserved - Wood Surface</div>
    </div>
  </q-layout>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';

import Api from 'src/services/api';
import {useRouter} from 'vue-router';
import {useAuthStore} from 'stores/useAuth';
import {useCartStore} from 'stores/useCart';
export default defineComponent({
  name: 'MainLayout',

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
