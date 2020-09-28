import { Alert, Linking } from 'react-native';
import api from '../services/api';

export const maxAllowedImageSize = 30 * 1024 * 1024;

export function goToUrl(url: string): void {
    Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
            console.log(`Não foi possível abrir a URL ${url}`);
        }
        Linking.openURL(url);
    });
}
