<template>
  <div class="q-py-xl">
    <q-card
      :style="$q.screen.sm || $q.screen.xs ? '' : { width: '350px' }"
      class="ma-auto-0 q-py-xl"
    >
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            filled
            dense
            type="email"
            v-model="Email"
            :error-message="error"
            :error="!isValid"
            label="Your Email *"
            hint="Email"
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

          <div class="flex items-center">
            <q-btn label="Login" type="submit" color="dark" />
            <q-space />
<!--            <span class="text-blue cursor-pointer">Forgot Password?</span>-->
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>
<script lang="ts">
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import Api from '../services/api/index'
import { ref, onMounted } from 'vue';

export default {
  setup() {
    onMounted(async () => {
       await Api.getList( 'validateToken').then((response) => {
        if (response?.data?.authenticated && localStorage.getItem('token_check') === 'dapibus'){
          router.push('/dashboard');
        }else if(response?.data?.authenticated && localStorage.getItem('token_check') === 'Pellentesque'){
          router.push('/');
        }
      });
    })
    const $q = useQuasar();
    const router = useRouter();

    const Email = ref(null);
    const Password = ref(null);
    const error = ref('');
    const isValid = ref(true);
    return {
      Email,
      Password,
      error,
      isValid,



      async onSubmit() {
        $q.loading.show();
        let res = await Api.login({
          email : Email.value,
          password : Password.value
        });
        if (res?.data?.error){
          isValid.value = false;
          error.value = res.data.error
        }else if(res?.data?.data?.token && res?.data?.data?.me === 1){
          localStorage.setItem('token', res?.data?.data?.token);
          localStorage.setItem('token_check', 'dapibus');

          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Success',
          });
          router.push('/dashboard');
        }else if(res?.data?.data?.token && res?.data?.data?.me === 0){
          localStorage.setItem('token', res?.data?.data?.token);
          localStorage.setItem('token_check', 'Pellentesque');
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
