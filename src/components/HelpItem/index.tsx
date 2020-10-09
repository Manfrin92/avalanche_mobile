import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { HelpDataToShow } from '../../utils/Interfaces';

import { HelpTitle, HelpDescription, HelpBoldDescription } from './styles';
import api from '../../services/api';

const HelpItem: React.FC<HelpDataToShow> = ({ id, title, ...rest }) => {
    return (
        <View {...rest} style={{ marginTop: '8%' }}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity
                    style={{ flexDirection: 'row' }}
                    onLongPress={() =>
                        Alert.alert('Excluir ajuda', `Realmente deseja excluir a ajuda ${title}?`, [
                            {
                                text: 'Não',
                                style: 'cancel',
                            },
                            {
                                text: 'Sim',
                                onPress: async () => {
                                    try {
                                        await api.delete('help', {
                                            id,
                                        });

                                        Alert.alert('Ajuda excluída com sucesso');
                                    } catch (e) {
                                        Alert.alert('Falha ao excluir ajuda');
                                    }
                                },
                            },
                        ])
                    }
                >
                    <MaterialIcons
                        style={{ marginLeft: '4%' }}
                        name="airline-seat-individual-suite"
                        size={48}
                        color="black"
                    />
                    <View style={{ justifyContent: 'space-around', marginLeft: '4%' }}>
                        <HelpTitle style={{ marginBottom: '4%' }}>Acompanhamento {'\n'}Hospitalar</HelpTitle>
                        <HelpDescription>
                            Título da ajuda <HelpBoldDescription>{title}</HelpBoldDescription>
                        </HelpDescription>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: '4%' }}>
                    <MaterialCommunityIcons name="pencil" size={40} color="#F6BB42" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HelpItem;
