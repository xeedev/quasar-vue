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
        <q-btn color="dark" label="Logout" @click="$router.push('/login')">
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
            src="http://woodsurface.pk/jewelry/img/logo.png"
            spinner-color="white"
            @click="$router.push('/dashboard')"
            fit="contain"
            height="80px"
            class="q-ma-sm cursor-pointer"
            style="max-width: 150px"
          />
        </q-item-label>

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
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: 'Dashboard',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Products',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Orders',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Media',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
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
