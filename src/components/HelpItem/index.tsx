import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { HelpDataToShow } from '../../utils/Interfaces';

import { HelpTitle, HelpDescription, HelpBoldDescription } from './styles';

const HelpItem: React.FC<HelpDataToShow> = ({ title, ExcludeHelp, ...rest }) => {
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
                                onPress: () => ExcludeHelp(),
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
