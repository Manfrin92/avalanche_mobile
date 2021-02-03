import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

import { NavigationText } from './styles';

interface UpdateOptionProps {
    optionText: string;
    setFormStage(): void;
    setSelecting(): void;
}

const UpdateOption: React.FC<UpdateOptionProps> = ({ setFormStage, setSelecting, optionText, children }) => {
    const handlePress = useCallback(() => {
        setFormStage();
        setSelecting();
    }, [setFormStage, setSelecting]);

    return (
        <TouchableOpacity style={{ flexDirection: 'row', marginTop: '6%' }} onPress={handlePress}>
            {children && children}
            <NavigationText style={{ marginLeft: '2.5%' }}>{optionText}</NavigationText>
        </TouchableOpacity>
    );
};

export default UpdateOption;
