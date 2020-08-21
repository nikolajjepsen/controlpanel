import axios from 'axios';

const settings = {
    base_url: 'https://localhost',
    base_port: '3001'
}

const backend = axios.create({
    baseURL: `${settings.base_url}:${settings.base_port}`,
});

export default backend;