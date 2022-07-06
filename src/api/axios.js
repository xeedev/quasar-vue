import axios from 'axios';
axios.defaults.baseURL = process.env.BASE_URL;
export default {
  getAll() {
    return axios.get(RESOURCE_NAME);
  },
  get(id) {
    return axios.get(`${RESOURCE_NAME}/${id}`);
  },
  create(data) {
    return axios.post(RESOURCE_NAME, data);
  },
  update(id, data) {
    return axios.put(`${RESOURCE_NAME}/${id}`, data);
  },
  delete(id) {
    return axios.delete(`${RESOURCE_NAME}/${id}`);
  },
  login(data) {
    return axios.post('/login',data);
  },
  checkToken(payload){
    return axios.get('validate-token',payload);
  }
};
