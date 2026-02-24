import axios from 'axios';

const api = axios.create({
    baseURL:'https://moonsigns-backend-0fa96cd0f5d0.herokuapp.com/v1/ms-app/'
});

export default api;