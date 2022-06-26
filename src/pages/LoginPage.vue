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
            type="email"
            v-model="Email"
            label="Your Email *"
            hint="Email"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter your email',
            ]"
          />

          <q-input
            filled
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
            <span class="text-blue cursor-pointer">Forgot Password?</span>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { useQuasar } from 'quasar';
import { ref } from 'vue';

export default {
  setup() {
    const $q = useQuasar();

    const Email = ref(null);
    const Password = ref(null);

    return {
      Email,
      Password,

      onSubmit() {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted',
        });
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
