import { Alert } from 'react-native';

import api from './api';

export async function ExcludeHelp(id: string): Promise<void> {
    try {
        await api.delete(`help/${id}`);

        Alert.alert('Ajuda excluída com sucesso');
    } catch (e) {
        Alert.alert('Falha ao excluir ajuda');
    }
}
