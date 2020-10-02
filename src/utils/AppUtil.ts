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

export function testCPF(cpf: string): boolean {
    let sum;
    let restOfDivision;
    sum = 0;

    if (cpf === '00000000000') {
        return false;
    }
    for (let i = 1; i <= 9; i++) {
        sum += Number(cpf.slice(i - 1, i)) * (11 - i);
    }
    restOfDivision = (sum * 10) % 11;
    if (restOfDivision === 10 || restOfDivision === 11) {
        restOfDivision = 0;
    }
    if (restOfDivision !== Number(cpf.slice(9, 10))) {
        return false;
    }
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += Number(cpf.substring(i - 1, i)) * (12 - i);
    }
    restOfDivision = (sum * 10) % 11;
    if (restOfDivision === 10 || restOfDivision === 11) {
        restOfDivision = 0;
    }
    if (restOfDivision !== Number(cpf.substring(10, 11))) {
        return false;
    }
    return true;
}
