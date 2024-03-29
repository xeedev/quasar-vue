<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
    >
      <template v-slot:top>
        <q-space />
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="orderby" :props="props">
            {{ props.row.user.name }}
          </q-td>
          <q-td key="contact" :props="props">
            {{ props.row.contact }}
          </q-td>
          <q-td key="total" :props="props">
            {{ props.row.total }} RS
          </q-td>
          <q-td key="status" :props="props">
            <q-badge :color="props.row.status === 'unpaid' ? 'red' : 'green'">
              {{ props.row.status.toUpperCase() }}
            </q-badge>
          </q-td>
          <q-td auto-width>
            <q-btn size="sm" color="dark" round dense icon="visibility" @click="submit(props.row.id)" />
          </q-td>
          <q-td auto-width>
            <q-btn size="sm" color="red" :key="props.row.id" :loading="deleteLoading[`deleteLoading-${props.row.id}`]" round dense icon="delete" @click="deleteOrder(props.row.id)" />
          </q-td>
          <q-td auto-width>
            <q-btn size="sm" :color="props.row.status === 'unpaid' ? 'green' : 'red'" :key="props.row.id" :loading="updateStatus[`updateStatus-${props.row.id}`]" round dense :icon="props.row.status === 'unpaid' ? 'task_alt' : 'close'" @click="save(props.row.id, props.row.status)" />
          </q-td>
        </q-tr>
      </template>

    </q-table>

    <q-dialog
      v-model="dialog"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="text-white">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup @click="reset">
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <div class="row">
          <div class="col-md-8 col-sm-12 col-xs-12 q-pa-md">
            <q-card-section class="custom-border">
              <q-card-section>
                <div class="text-h6 text-dark">Order Details {{selectedOrder}}</div>
              </q-card-section>
              <q-separator inset />
              <q-card-section>
                <p class="text-dark"><b>Order Id:</b> {{orderDetails.id}} </p>
                <p class="text-dark"><b>Description:</b> {{orderDetails.description}} </p>
                <p class="text-dark"><b>Total:</b> {{orderDetails.total}} </p>
                <p class="text-dark"><b>Transaction ID:</b> {{orderDetails.transaction_id ?? 'N/A'}} </p>
                <p class="text-dark"><b>Address:</b> {{orderDetails.address ?? 'N/A'}} </p>
                <p class="text-dark"><b>City:</b> {{orderDetails.city ?? 'N/A'}} </p>
                <p class="text-dark"><b>Country:</b> {{orderDetails.country ?? 'N/A'}} </p>
                <p class="text-dark"><b>Status: </b>
                  <q-badge :color="orderDetails.status === 'unpaid' ? 'red' : 'green'">
                    {{orderDetails.status.toUpperCase() ?? 'N/A'}}
                  </q-badge>
                </p>
              </q-card-section>
            </q-card-section>
          </div>
          <q-separator v-if="$q.screen.xs || $q.screen.sm" inset/>
          <div class="col-md-4 col-sm-12 col-xs-12 q-pa-md">
            <q-card-section class="custom-border">
              <q-card-section>
                <div class="text-h6 text-dark">User Details</div>
              </q-card-section>
              <q-separator inset />
              <q-card-section>

                <p class="text-dark"><b>Name:</b> {{orderDetails.user.name ?? 'N/A'}} </p>
                <p class="text-dark"><b>Email:</b> {{orderDetails.user.email ?? 'N/A'}} </p>
                <p class="text-dark"><b>Contact:</b> {{orderDetails.contact ?? 'N/A'}} </p>
                <p class="text-dark"><b>Address:</b> {{orderDetails.address ?? 'N/A'}} </p>
                <p class="text-dark"><b>City:</b> {{orderDetails.city ?? 'N/A'}} </p>
                <p class="text-dark"><b>Country:</b> {{orderDetails.country ?? 'N/A'}} </p>
              </q-card-section>
            </q-card-section>
            <q-card-section class="text-center">

                <q-form
                  @submit="save(selectedOrder)"
                  class="q-gutter-md"
                >
                  <div>
                    <q-btn type="submit" :color="orderDetails.status === 'unpaid' ? 'green' : 'red'" :icon="orderDetails.status === 'unpaid' ? 'task_alt' : 'close'" :disable="loading" :label="orderDetails.status === 'unpaid' ? 'Mark as Paid' : 'Mark as Unpaid'" />
                  </div>
                </q-form>
            </q-card-section>
          </div>
        </div>

      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import Api from '../services/api';
import axios from 'axios';


const columns = [
  {
    name: 'orderby',
    required: true,
    label: 'Ordered By',
    align: 'left',
    field: row => row.user.name,
    sortable: true
  },
  {
    name: 'contact',
    required: true,
    label: 'Contact Number',
    align: 'left',
    field: row => row.contact,
    sortable: true
  },
  {
    name: 'total',
    required: true,
    label: 'Total Amount',
    align: 'left',
    field: row => row.total,
    format: val => 'RS: ' + val,
    sortable: true
  },
  {
    name: 'status',
    required: true,
    label: 'Status',
    align: 'left',
    field: row => row.status,
    // format: val => `${val}`,
    sortable: true
  },
]

const originalRows = ref([])

export default {
  setup () {
    const deleteLoading = ref({})
    const updateStatus = ref({})
    const orderDetails = ref('')
    const $q = useQuasar()
    const selectedOrder = ref('')
    const status = ref('')
    const rows = ref([])
    const filter = ref('')
    const loading = ref(false)
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10
    })
    const dialog = ref(false);
    function fetchFromServer (startRow, count, filter, sortBy, descending) {
      const data = filter
        ? originalRows.value.filter(row => row.description.includes(filter))
        : originalRows.value.slice()

      // handle sortBy
      if (sortBy) {
        const sortFn = sortBy === 'desc'
          ? (descending
              ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
              : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
          )
          : (descending
              ? (a, b) => (parseFloat(b[ sortBy ]) - parseFloat(a[ sortBy ]))
              : (a, b) => (parseFloat(a[ sortBy ]) - parseFloat(b[ sortBy ]))
          )
        data.sort(sortFn)
      }

      return data.slice(startRow, startRow + count)
    }

    function getRowsNumberCount (filter) {
      if (!filter) {
        return originalRows.value.length
      }
      let count = 0
      originalRows.value.forEach(row => {
        if (row.description.includes(filter)) {
          ++count
        }
      })
      return count
    }

    async function onRequest (props) {
      loading.value = true
      let orders = await Api.getList('orders');
      originalRows.value = orders.data.data;
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter

      // update rowsCount with appropriate value
      pagination.value.rowsNumber = await getRowsNumberCount(filter)

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage

      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage

      // fetch data from "server"
      const returnedData = fetchFromServer(startRow, fetchCount, filter, sortBy, descending)

      // clear out existing data and add new
      rows.value.splice(0, rows.value.length, ...returnedData)

      // don't forget to update local pagination object
      pagination.value.page = page
      pagination.value.rowsPerPage = rowsPerPage
      pagination.value.sortBy = sortBy
      pagination.value.descending = descending

      // ...and turn of loading indicator
      loading.value = false
    }

    async function submit(id = null){
        selectedOrder.value = id
        let res = await Api.getOne('orders', {id});
        orderDetails.value = res.data.data;
        dialog.value = true
    }
    onMounted(async () => {
      onRequest({
        pagination: pagination.value,
        filter: undefined
      })
    })
    async function save(id=null, status= null){
      updateStatus.value[`updateStatus-${id}`] =  true
      let updatedStatus = status ? status : orderDetails.value.status;
      let payload = {
        'status' : updatedStatus === 'unpaid' ? 'paid' : 'unpaid',
      }
        payload = Object.assign({'id': id ?? selectedOrder.value},payload)
        let res = await Api.put('orders',payload);
      if (res.data.success){
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Success',
        });
        onRequest({
          pagination: pagination.value,
          filter: filter.value
        })
        reset()
        dialog.value = false
      }else{
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Something went wrong',
        });
      }
      updateStatus.value[`updateStatus-${id}`] =  false
    }
    function reset(){
      status.value = ''
    }
    async function deleteOrder(id){
      deleteLoading.value[`deleteLoading-${id}`] =  true
      let res = await Api.delete('orders',{id})
      if (res.data.success){
        rows.value.splice(id, 1);
      }
      onRequest({
        pagination: pagination.value,
        filter: filter.value
      })
      deleteLoading.value[`deleteLoading-${id}`] =  false
    }

    return {
      filter,
      loading,
      pagination,
      columns,
      rows,
      dialog,
      status,
      deleteLoading,
      updateStatus,
      selectedOrder,
      orderDetails,
      onRequest,
      submit,
      save,
      reset,
      deleteOrder
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
