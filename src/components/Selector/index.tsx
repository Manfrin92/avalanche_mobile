import React from 'react';
import { View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { Square, OptionText, OptionContainer } from './styles';

interface SelectorProps {
    selected: boolean;
    optionText: string;
    setSelected(): void;
}

const Selector: React.FC<SelectorProps> = ({ selected, optionText, setSelected, ...rest }) => {
    console.log('selecionado? ', selected);
    return (
        <View style={{ marginBottom: '4%' }} {...rest}>
            <OptionContainer onPress={setSelected}>
                <Square selected={selected}>
                    {selected && <AntDesign style={{ marginRight: 2 }} name="check" size={20} color="white" />}
                </Square>
                <OptionText>{optionText}</OptionText>
            </OptionContainer>
        </View>
    );
};

export default Selector;
