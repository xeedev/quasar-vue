<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-black">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Wood Surface </q-toolbar-title>
        <q-space></q-space>
        <q-btn color="dark" label="Logout" @click="logout">
          <!-- <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup @click="$router.push('/login')">
                <q-item-section>Logout</q-item-section>
              </q-item>
              <q-separator />
            </q-list>
          </q-menu> -->
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          <q-img
            src="logo.png"
            spinner-color="white"
            @click="$router.push('/dashboard')"
            fit="contain"
            height="80px"
            class="q-ma-sm cursor-pointer"
            style="max-width: 150px"
          />
        </q-item-label>
        <template v-for="(essentialLink,index) in essentialLinks" :key="index">
          <q-item clickable tag="a" @click="$router.push(essentialLink.link)">
            <q-item-section avatar>
              <q-icon :name="essentialLink.icon" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{essentialLink.title}}</q-item-label>
              <q-item-label caption>{{essentialLink.caption}}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Api from 'src/services/api';
import { useRouter } from 'vue-router'
// import EssentialLink from 'components/EssentialLink.vue';
const linksList = [
  {
    title: 'Dashboard',
    caption: 'Statistics',
    icon: 'dashboard',
    link: 'dashboard',
  },
  {
    title: 'Products',
    caption: 'Manage Products',
    icon: 'store',
    link: 'products',
  },
  {
    title: 'Orders',
    caption: 'Track Orders',
    icon: 'trending_up',
    link: 'orders',
  },
  {
    title: 'Categories',
    caption: 'Manage Categories',
    icon: 'category',
    link: 'categories',
  },
  {
    title: 'Media',
    caption: 'Manage Gallery',
    icon: 'image',
    link: 'gallery',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    // EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter()
    async function logout(){
      await Api.post('logout');
      localStorage.removeItem('token')
      localStorage.removeItem('token_check')
      router.push({path:'login'})
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      logout,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
