import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import { Alert, BackHandler } from 'react-native';
import { APP_ENV } from '../../env';

const api = axios.create({
    baseURL: APP_ENV.APIURL,
    timeout: 15000,
});

api.interceptors.request.use(
    async (config: any) => {
        const token = await AsyncStorage.getItem('@Avalanche:token');
        if (token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => Promise.reject(error),
);

api.interceptors?.response?.use(undefined, async (err: any) => {
    const {
        config,
        response: { status },
    } = err;

    // // console.log(err);
    if (status === 401) {
        await AsyncStorage.multiRemove(['@Avalanche:token']);

        Alert.alert('Faça seu login novamente.');

        BackHandler.exitApp();

        // DevSettings.reload();
        return;
    }
    return Promise.reject(err);
});

export default api;
