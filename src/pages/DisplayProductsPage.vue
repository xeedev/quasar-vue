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
        <q-btn color="dark" icon="add" :disable="loading" :label="$q.screen.xs || $q.screen.sm ? '' : 'Add Products'" @click="submit('Add')" />
        <q-space />
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-img :src="props.row.media[0]?.url ? props.row.media[0]?.url : ''" spinner-color="black" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn size="sm" color="dark" round dense icon="edit" @click="submit('Edit',props.row.id)" />
          </q-td>
          <q-td auto-width>
            <q-btn size="sm" color="red" :key="props.row.id" :loading="deleteLoading[`deleteLoading-${props.row.id}`]" round dense icon="delete" @click="deleteProduct(props.row.id)" />
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

        <q-card-section>
          <div class="text-h6 text-dark">{{action}} Product</div>
        </q-card-section>

        <q-card-section>
          <q-form
            @submit="save(action)"
            class="q-gutter-md"
          >
            <q-input
              outlined
              v-model="name"
              label="Name *"
              hint="Name"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              outlined
              v-model="detail"
              label="Detail *"
              hint="Description"
              type="textarea"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              outlined
              type="number"
              v-model="price"
              min="1"
              label="Product Price *"
              lazy-rules
              :rules="[
          val => val !== null && val !== '' || 'Please enter price',
        ]"
            />
            <q-select outlined v-model="category" :options="categories" :option-value="(categories) => categories === null ? null : categories.type" label="Select Category" :option-label="(categories) => categories === null ? null : categories.type"
                      :rules="[val => val !== null && val !== '' || 'Please select category']"
            />
            <p class="text-dark q-mt-md"><strong>Upload Images *</strong></p>
            <div class="text-dark q-gutter-md" style="font-size: 2em">
              <q-icon name="attachment" class="cursor-pointer" @click="$refs.image.click()" />
            </div>
            <input
              style="display: none"
              type="file"
              ref="image"
              multiple
              accept="image/*"
              @change="uploadImages"
            />
            <div class="row q-gutter-md">
              <template v-for="(uploadedImage,index) in uploadedImages" :key="index">
                <q-card class="my-card" :style="
                'background-image: url(' +
                uploadedImage +
                ');'
              ">
                  <q-icon name="close" class="absolute close bg-red-5 border-radius-inherit cursor-pointer" @click="removeUrl(index)"></q-icon>
                </q-card>
              </template>
            </div>
            <div>
              <q-btn :label="action === 'Edit' ? 'Update Product' : 'Add Product'" type="submit" color="dark"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import Api from '../services/api';
import axios from 'axios';
import imageCompression from "browser-image-compression";


const columns = [

  {
    label: 'Cover'
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'detail', align: 'center', label: 'Detail', field: 'detail', sortable: true, format: val => val.substring(0,20)},
  { name: 'price', label: 'Price', field: 'price', sortable: true },
  { name: 'category', label: 'Category', field: 'category', sortable: true },
]

const originalRows = ref([])

export default {
  setup () {
    const deleteLoading = ref({})
    const $q = useQuasar()
    const selectedProduct = ref('')
    const name = ref('')
    const detail = ref('')
    const price = ref(1)
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
    const action = ref('');
    const dialog = ref(false);
    const categories = ref([]);
    const category = ref('');
    const uploadedImages = ref([])
    function fetchFromServer (startRow, count, filter, sortBy, descending) {
      const data = filter
        ? originalRows.value.filter(row => row.name.includes(filter))
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
      originalRows.value.forEach(treat => {
        if (treat.name.includes(filter)) {
          ++count
        }
      })
      return count
    }

    async function onRequest (props) {
      loading.value = true
      let products = await Api.getList('products');
      originalRows.value = products.data.data;
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

    async function submit(val,id = null){
      action.value = val;
      if (val === 'Edit'){
        selectedProduct.value = id
        let res = await Api.getOne('products', {id});
        let product = res.data.data;
        name.value = product.name
        price.value = product.price
        detail.value = product.detail
        category.value = categories.value.find(obj => obj.type === product.category)
        product.media.forEach(media =>{
          uploadedImages.value.push(media.url)
        })
      }
      dialog.value = true
    }
    function uploadImages(event) {
      this.onFilesPicked(event);
    }
    const compressFile = (imageFile) => {
      let size = imageFile.size / 1024 / 1024; // in MiB
      if (size < 0.2) {
        return imageFile;
      }

      return new Promise((resolve, reject) => {
        let options = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        imageCompression(imageFile, options)
          .then(function(compressedFile) {
            resolve(compressedFile);
          })
          .catch(function(error) {
            reject(error.message);
          });
      });
    };
     async  function  onFilesPicked (event) {
      const files = event.target.files;
       let formData = new FormData();
       for (let i = 0; i < files.length; i++) {
         let file = files[i];
         file = await compressFile(file);
         console.log(file);
         formData.append('files[]', file);
       }

       if (!files.length) {
         return;
       }

       if (!files.length) {
        return;
      }

       $q.loading.show();
       axios
         .post(process.env.BASE_URL+'/imageUpload', formData, {
           headers: {
             'Content-Type': 'multipart/form-data',
             Authorization: 'Bearer ' + localStorage.getItem('token'),
           },
         })
        .then((response) => {
          let urls = response.data.urls;
          urls.forEach(url => {
              url = process.env.ROOT_URL+ '/' + url
              uploadedImages.value.push(url.replace('public/', 'storage/'))
          })
        });

       $q.loading.hide();
    }
    function removeUrl(index){
      uploadedImages.value.splice(index, 1);
    }
    onMounted(async () => {
      let res = await Api.getList('categories');
      categories.value = res.data.data
      onRequest({
        pagination: pagination.value,
        filter: undefined
      })
    })
    async function save(action){
      console.log(action);
      let payload = {
        'name' : name.value,
        'detail' : detail.value,
        'price' : price.value,
        'status' : 'normal',
        'category_id' : category.value.id,
        'uploadedImages' : uploadedImages.value,
      }
      if (!payload.uploadedImages.length){
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'error',
          message: 'Please select atleast one image',
        });
        return false;
      }
      let res = null;
      if (action === 'Add'){
        res = await Api.post('products',payload);
      }else{
        payload = Object.assign({'id': selectedProduct.value},payload)
        res = await Api.put('products',payload);
      }
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
    }
    function reset(){
      name.value = null
      price.value = null
      detail.value = null
      category.value = null
      uploadedImages.value = []
    }
    async function deleteProduct(id){
      deleteLoading.value[`deleteLoading-${id}`] =  true
      let res = await Api.delete('products',{id})
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
      action,
      dialog,
      name,
      detail,
      price,
      categories,
      category,
      uploadedImages,
      deleteLoading,
      selectedProduct,
      onRequest,
      submit,
      uploadImages,
      onFilesPicked,
      removeUrl,
      save,
      reset,
      deleteProduct,
      compressFile
    }
  }
}
</script>
<style scoped>
.my-card{
  height: 100px;
  width: 100px;
  background-size: cover;
}
.close{
  right: 0;
}
</style>
