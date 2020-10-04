import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { HelpTitle, HelpDescription, HelpBoldDescription } from './styles';

interface SHelpItemProps {
    selected: boolean;
    optionText: string;
    setSelected(): void;
}

const HelpItem: React.FC = ({ ...rest }) => {
    return (
        <View {...rest} style={{ marginTop: '8%' }}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <MaterialIcons
                    style={{ marginLeft: '4%' }}
                    name="airline-seat-individual-suite"
                    size={48}
                    color="black"
                />
                <View style={{ justifyContent: 'space-around' }}>
                    <HelpTitle style={{ marginBottom: '4%' }}>Acompanhamento {'\n'}Hospitalar</HelpTitle>
                    <HelpDescription>
                        Ajuda a <HelpBoldDescription>Sra. Cláudia</HelpBoldDescription> do dia 03/08 às 09/08
                    </HelpDescription>
                </View>
                <TouchableOpacity style={{ marginRight: '4%' }}>
                    <MaterialCommunityIcons name="pencil" size={40} color="#F6BB42" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HelpItem;
