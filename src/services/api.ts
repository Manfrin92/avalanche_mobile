import axios from 'axios';

import { APP_ENV } from '../../env';

const api = axios.create({
    baseURL: APP_ENV.APIURL,
    timeout: 15000,
});

// api.interceptors.request.use(
//     async (config: any) => {
//         const token = await AsyncStorage.getItem('@Avalanche:token');
//         if (token) {
//             config.headers.authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error: any) => Promise.reject(error),
// );

export default api;
