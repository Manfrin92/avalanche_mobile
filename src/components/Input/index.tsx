import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { Container, TextInput } from './styles';

interface InputProps extends TextInputProps {
    name: string;
    icon: string;
    containerStyle?: {};
}

interface InputValueReference {
    value: string;
}

interface InputRef {
    focus(): void;
}

const Input: React.FC<TextInputProps> = ({ name, ...rest }) => {
    const inputElementRef = useRef<any>(null);
    const inputValueRef = useRef<InputValueReference>({ value: defaultValue });
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [isErrored, setIsErrored] = useState(false);

    return (
        <Container isFocused={isFocused} isErrored={isErrored}>
            <TextInput placeholderTextColor="#DA4453" {...rest} />
        </Container>
    );
};

export default forwardRef(Input);
