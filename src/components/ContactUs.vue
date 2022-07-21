<template>
  <div class="form bg-white q-pa-md">
    <h4 class="q-my-none text-black"><strong>GET IN TOUCH</strong></h4>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md q-mt-md"
    >
      <q-input
        dense
        outlined
        class="bg-white"
        clearable
        v-model="name"
        label="Your name *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        dense
        outlined
        clearable
        type="email"
        v-model="email"
        label="Your Email *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        dense
        outlined
        clearable
        type="number"
        v-model="contact"
        label="Your Contact Number *"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type your number',
        ]"
      />
      <q-input
        dense
        outlined
        clearable
        v-model="message"
        label="your message *"
        type="textarea"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />
      <div>
        <q-btn label="Submit" type="submit" color="black"/>
        <q-btn label="Reset" type="reset" color="black" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

export default {
  setup () {
    const $q = useQuasar()

    const name = ref('')
    const email = ref('')
    const contact = ref('')
    const message = ref('')

    return {
      name,
      email,
      contact,
      message,

      onSubmit () {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Submitted'
          })
      },

      onReset () {
        name.value = null
        email.value = null
        contact.value = null
      }
    }
  }
}
</script>
<style scoped>
.form{
  border: 1px solid white;
  border-radius: 10px;
}
</style>
