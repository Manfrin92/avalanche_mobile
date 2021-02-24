import React, { useMemo } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { HelpTitle, HelpDescription, HelpBoldDescription } from './styles';
import { Type } from '../../utils/Interfaces';

interface HelpItemProps {
    id: string;
    email?: string;
    title?: string;
    description?: string | null;
    observation?: string | null;
    addressZipCode?: string;
    addressStreet?: string;
    addressNumber?: string;
    addressCity?: string;
    addressState?: string;
    addressComplement?: string;
    addressArea?: string;
    addressCountry?: string;
    helpDateId?: string;
    helpDate?: Date;
    ExcludeHelp(): Promise<void>;
    navigate(): void;
    helpType: Type;
}

const HelpItem: React.FC<HelpItemProps> = ({ title, ExcludeHelp, navigate, helpType, ...rest }) => {
    const helpTypeName = useMemo(() => {
        let nameInArray;
        if (helpType && helpType.name) {
            nameInArray = helpType.name.split(' ');
            if (nameInArray && nameInArray.length === 1) {
                return nameInArray[0];
            }
            if (nameInArray && nameInArray.length === 2) {
                return `${nameInArray[0]} \n ${nameInArray[1]}`;
            }
        }
        return '';
    }, [helpType]);

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
                        <HelpTitle style={{ marginBottom: '4%' }}> {helpTypeName} </HelpTitle>
                        <HelpDescription>
                            Título da ajuda <HelpBoldDescription>{title}</HelpBoldDescription>
                        </HelpDescription>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate()} style={{ marginRight: '4%' }}>
                    <MaterialCommunityIcons name="pencil" size={40} color="#F6BB42" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HelpItem;
