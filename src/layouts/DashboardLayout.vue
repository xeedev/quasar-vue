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
        <q-btn color="dark" label="Settings">
          <q-menu>
            <q-list>
              <q-item clickable v-close-popup @click="change">
                <q-item-section>Change Password</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>Logout</q-item-section>
              </q-item>
              <q-separator />
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
      <q-dialog v-model="alert">
        <q-card style="width: 90%;">
          <q-card-actions align="right">
            <q-btn icon="close" style="min-width: 3px" size="5px" color="dark" v-close-popup />
          </q-card-actions>
          <q-card-section>
            <div class="text-h6">Change Password</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
              <q-form
                @submit="onSubmit"
                class="q-gutter-md q-mt-md"
              >
                <q-input
                  dense
                  outlined
                  type="password"
                  class="bg-white"
                  clearable
                  v-model="password"
                  label="Your New Password *"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please enter password']"
                />

                <q-input
                  dense
                  outlined
                  clearable
                  type="password"
                  v-model="confirm_password"
                  label="Confirm Password*"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 && val === password || 'Password dont match']"
                />
                <div>
                  <q-btn label="Change Password" :loading="submitLoading" type="submit" color="black"/>
                </div>
              </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
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
import {useQuasar} from 'quasar';
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
    const $q = useQuasar()
    const alert = ref(false);
    const user_id = ref(null);
    const leftDrawerOpen = ref(false);
    const router = useRouter()
    const confirm_password = ref('');
    const password = ref('');
    const submitLoading = ref(false)
    async function change(){
      await Api.getList( 'validateToken').then((response) => {
          user_id.value = response.data.user
          alert.value = true;
      }).catch((error) => {
        console.log(error)
      })
    }
    async function onSubmit () {
      submitLoading.value = true
      let res = await Api.post('change-password',{
        id: user_id.value,
        password : password.value,
      })
      submitLoading.value = false
      if (res.status === 200){
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Successfully changed password',
        })
        logout()
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
      password.value = ''
      confirm_password.value = ''
    }
    async function logout(){
      await Api.post('logout');
      localStorage.removeItem('token')
      localStorage.removeItem('token_check')
      router.push({path:'login'})
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      alert,
      confirm_password,
      password,
      submitLoading,
      user_id,
      change,
      onReset,
      onSubmit,
      logout,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
