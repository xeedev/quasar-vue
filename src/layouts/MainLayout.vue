<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated reveal class="bg-black">
      <q-toolbar class="row justify-between items-center">
        <q-btn
          flat
          dense
          round
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
        <div class="row justify-between desktop-only">
          <p
            class="q-px-xl q-ma-none cursor-pointer"
            @click="$router.push('/')"
          >
            ONE
          </p>
          <p
            class="q-px-xl q-ma-none cursor-pointer"
            @click="$router.push('/two')"
          >
            TWO
          </p>
          <p
            class="q-px-xl q-ma-none cursor-pointer"
            @click="$router.push('/three')"
          >
            THREE
          </p>
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
    <q-footer reveal>
      <q-toolbar class="bg-black text-center">
        <q-toolbar-title
          >©{{ new Date().getFullYear() }} Wood Surface, All rights
          reserved</q-toolbar-title
        >
        <!-- <q-btn flat round dense icon="facebook" />
        <q-btn flat round dense icon="instagram" /> -->
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: 'ONE',
    caption: 'quasar.dev',
    icon: 'school',
    link: '',
  },
  {
    title: 'TWO',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'TWO',
  },
  {
    title: 'THREE',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'THREE',
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
