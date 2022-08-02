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
import {useCartStore} from '../stores/useCart';

export default {
  setup () {
    const columns = [
      { name: 'name', required: true, label: 'Product Name', align: 'left', field: row => row.name, format: val => `${val}`, sortable: true},
      { name: 'price', align: 'center', label: 'Price', field: 'price', sortable: true },
      { name: 'quantity', label: 'Quantity', field: 'quantity', sortable: true },
      { name: 'total', label: 'Total', field: 'total' },
    ]

    const rows = ref([])
    const $q = useQuasar()
    const cart = useCartStore();
    const contact = ref('');
    const address = ref('');
    const city = ref('Lahore');
    const country = ref('Pakistan');
    const transaction_id = ref('');
    const total = ref(0)
    const description = ref('')
    const submitLoading = ref(false)
    rows.value = cart.cartItems
    cart.cartItems.forEach(item => {
      total.value += parseInt(item.total)
      description.value += ' ' + item.quantity+'x ' + item.name + '.'
    })
    async function orderNow(){
      submitLoading.value = true
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
      submitLoading.value = false
    }
    function onReset () {
      contact.value = null
      address.value = null
      city.value = null
      country.value = null
      transaction_id.value = null
      cart.emptyCart()
      total.value = 0
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
      cart,
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
