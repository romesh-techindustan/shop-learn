import axios from 'axios';
axios.get('http://localhost:3000/products/1').then(res => console.log("DATA:", res.data)).catch(err => console.error(err.message));
