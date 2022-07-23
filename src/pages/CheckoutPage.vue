<template>
  <q-page>
    <q-img
      src="https://placeimg.com/500/300/nature"
      spinner-color="white"
      height="60vh"
      style="opacity: 0.5"
    >
      <h4 class="absolute-center text-black q-ma-none text-center" style="z-index: 999; width: 100%">Ready to check out?</h4>
    </q-img>
    <q-page-container class="text-center row justify-center">
      <q-table
        :style="$q.screen.xs || $q.screen.sm ? {'width': '90%'} : {'width': '60%'}"
        title="Your Cart Products"
        :rows="rows"
        :columns="columns"
        row-key="name"
      />
    </q-page-container>
    <div class="row justify-center q-pt-xl">
      <q-card :style="$q.screen.xs || $q.screen.sm ? {'width': '90%'} : {'width': '60%'}">
        <q-card-section>
          <div class="row">
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-md">
              <h5 class="q-pa-none q-ma-none">Shipping Details</h5>
              <q-form
                @submit="orderNow"
                @reset="onReset"
                class="q-gutter-md q-mt-md"
              >
                <q-input
                  dense
                  outlined
                  class="bg-white"
                  clearable
                  v-model="contact"
                  type="number"
                  label="Your Contact *"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please enter your contact number']"
                />

                <q-input
                  dense
                  outlined
                  class="bg-white"
                  clearable
                  v-model="address"
                  label="Shipping Address *"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please enter your address']"
                />

                <q-input
                  dense
                  outlined
                  class="bg-white"
                  clearable
                  v-model="city"
                  label="City *"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Required']"
                />

                <q-input
                  dense
                  outlined
                  class="bg-white"
                  clearable
                  v-model="country"
                  label="Country *"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Required']"
                />

                <q-input
                  dense
                  outlined
                  class="bg-white"
                  clearable
                  v-model="transaction_id"
                  label="Transaction ID *"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Required']"
                />
                <p>
                  Note: Please Pay {{total}} PKR through JazzCash at 03004645434 and type in your transaction ID for verification
                </p>
                <div>
                  <q-btn label="Order Now" :disable="total=== 0" :loading="submitLoading" type="submit" color="black"/>
                </div>
              </q-form>
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12 q-pa-md">
              <div class="custom-border q-pa-md">
                <h5 class="q-pa-none q-ma-none">Cart Total</h5>
                <p class="q-pt-xl text-bold">Total Payable amount</p>
                <p class="text-bold">RS: {{total}}/-</p>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import {ref} from 'vue'
import Api from '../services/api';
import {useQuasar} from 'quasar';
const columns = [
  { name: 'name', required: true, label: 'Product', align: 'left', field: row => row.name, format: val => `${val}`, sortable: true},
  { name: 'calories', align: 'center', label: 'Price', field: 'calories', sortable: true },
  { name: 'fat', label: 'Quantity', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Total', field: 'carbs' },
]

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  }
]

export default {
  setup () {
    const $q = useQuasar()
    const contact = ref('');
    const address = ref('');
    const city = ref('Lahore');
    const country = ref('Pakistan');
    const transaction_id = ref('');
    const total = ref(0)
    const description = ref('Success')
    const submitLoading = ref(false)
    async function orderNow(){
      let res = await Api.post('order-now',{
        'description' : description.value,
        'contact' : contact.value,
        'total' : total.value,
        'transaction_id' : transaction_id.value,
        'address' : address.value,
        'city' : city.value,
        'country' : country.value
      })
      if (res.status === 200){
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: "Thank you for placing your order, you'll hear from us very soon"
        })
        onReset()
      }else{
        $q.notify({
          color: 'red-10',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'something went wrong, please try again'
        })
      }
    }
    function onReset () {
      contact.value = null
      address.value = null
      city.value = null
      country.value = null
      transaction_id.value = null
    }
    return {
      contact,
      address,
      city,
      country,
      transaction_id,
      columns,
      rows,
      total,
      description,
      submitLoading,
      onReset,
      orderNow
    }
  }
}
</script>
<style scoped>
.custom-border{
  border: 2px solid black;
  border-radius: 10px;
}
</style>
