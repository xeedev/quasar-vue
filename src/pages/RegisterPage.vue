<template>
  <div class="q-py-xl">
    <q-card
      :style="$q.screen.sm || $q.screen.xs ? '' : { width: '350px' }"
      class="ma-auto-0 q-py-xl text-center"
      :flat="$q.screen.sm || $q.screen.xs"
    >
      <q-img
        src="logo.png"
        spinner-color="white"
        @click="$router.push('/')"
        fit="contain"
        width="100px"
        class="q-ma-sm cursor-pointer"
      />
      <p class="text-dark">{{error}}</p>
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            filled
            dense
            v-model="name"
            label="Name *"
            hint="Name"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter your Name',
            ]"
          />
          <q-input
            filled
            dense
            type="email"
            v-model="Email"
            label="Your Email *"
            hint="Email"
            :error-message="error"
            :error="!isValid"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter your email',
            ]"
          />

          <q-input
            filled
            dense
            type="password"
            v-model="Password"
            label="Password"
            hint="Password"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Password is required',
            ]"
          />

          <q-input
            filled
            dense
            type="password"
            v-model="confirm_password"
            label="Confirm Password"
            hint="Confirm Password"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Confirm Password is required',
              (val) => (val === Password) || 'Password and Confirm Password must be same',
            ]"
          />

          <div class="flex justify-center">
            <q-btn label="Register" outline class="q-px-xl" type="submit" color="dark" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>
<script lang="ts">
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import {useAuthStore} from 'stores/useAuth'
import Api from '../services/api/index'
import { ref, onMounted } from 'vue';

export default {
  setup() {
    onMounted(async () => {
      await Api.getList( 'validateToken').then((response) => {
        if (response?.data?.authenticated && localStorage.getItem('token_check') === process.env.ADMIN){
          router.push('/admin-dashboard');
        }else if(response?.data?.authenticated && localStorage.getItem('token_check') === process.env.USER){
          router.push('/');
        }
      });
    })
    const $q = useQuasar();
    const router = useRouter();

    const Email = ref(null);
    const name = ref(null);
    const confirm_password = ref(null);
    const Password = ref(null);
    const error = ref('');
    const isValid = ref(true);
    const store = useAuthStore();
    return {
      Email,
      name,
      Password,
      confirm_password,
      error,
      isValid,
      async onSubmit() {
        $q.loading.show();
        let res = await Api.signup({
          email : Email.value,
          password : Password.value,
          c_password : confirm_password.value,
          name : name.value,
        });
        // return false;
        if (res?.data?.error){
          isValid.value = false;
          error.value = res.data.error
        }else if(res?.data?.message == 'Validation Error.'){
          isValid.value = false;
          error.value = res.data.data.email[0]
        }else if(res?.data?.data?.token && res?.data?.data?.me === 1){
          localStorage.setItem('token', res?.data?.data?.token);
          localStorage.setItem('token_check', process.env.ADMIN!);
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Success',
          });
          router.push('/admin-dashboard');
        }else if(res?.data?.data?.token && res?.data?.data?.me === 0 || res?.data?.data?.me === null){
          localStorage.setItem('token', res?.data?.data?.token);
          localStorage.setItem('token_check', process.env.USER!);
          store.changeAuthStatus(true)
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Success',
          });
          router.push('/');
        }else{
          isValid.value = false;
          error.value = 'Something went wrong please try again'
        }
        $q.loading.hide();
      },
    };
  },
};
</script>
<style>
.ma-auto-0 {
  margin: 0 auto;
}
</style>
