import { Alert, Linking } from 'react-native';
import { format } from 'date-fns-tz';
import { add, sub, startOfMonth, endOfMonth, isBefore } from 'date-fns';
import api from '../services/api';
import { AddressFromURL } from './Interfaces';

export const maxAllowedImageSize = 30 * 1024 * 1024;

export function goToUrl(url: string): void {
    Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
            Alert.alert('Não foi possível abrir link.');
            console.log(`Não foi possível abrir a URL ${url}`);
        }
        Linking.openURL(url);
    });
}

export function testCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D+/g, '');
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

export async function getAddressByCep(cep: string): Promise<AddressFromURL | undefined> {
    try {
        const completeAddress = await api.get(`https://viacep.com.br/ws/${cep}/json/`);

        if (completeAddress) {
            return completeAddress.data;
        }
    } catch (e) {
        Alert.alert('Erro ao buscar CEP');
        console.log('Erro no cep, ', e);
    }

    return undefined;
}

export function formatFirstDateToFilter(dateToFormat: string | number | Date): string {
    return format(dateToFormat, 'yyyy-MM-dd 00:00:00 -03:00', {
        timeZone: 'America/Sao_Paulo',
    });
}

export function formatLastDateToFilter(dateToFormat: string | number | Date): string {
    return format(dateToFormat, 'yyyy-MM-dd 23:59:59 -03:00', {
        timeZone: 'America/Sao_Paulo',
    });
}
