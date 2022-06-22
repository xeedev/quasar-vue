import axios from 'axios';
let url = 'https://jsonplaceholder.typicode.com/';
// posts
function get($endpoit) {
  return axios.get(url + $endpoit);
}
export default get;
