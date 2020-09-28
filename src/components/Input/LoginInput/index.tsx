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

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
    { name, icon, containerStyle = {}, ...rest },
    ref,
) => {
    const inputElementRef = useRef<any>(null);
    const { registerField, defaultValue = '', fieldName, error } = useField(name);
    const inputValueRef = useRef<InputValueReference>({ value: defaultValue });
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleInputBlur = useCallback(() => {
        setIsFocused(false);
        setIsFilled(!!inputValueRef.current.value);
        // if (inputValueRef.current.value) {
        //   setIsFilled(true);
        // } else {
        //   setIsFilled(false);
        // }
    }, []);

    useImperativeHandle(ref, () => ({
        focus() {
            inputElementRef.current.focus();
        },
    }));

    useEffect(() => {
        registerField<string>({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',
            // setValue(ref: any, value) {
            //   inputValueRef.current.value = value;
            //   inputElementRef.current.setNativeProps({ text: value });
            // },
            // clearValue() {
            //   inputValueRef.current.value = '';
            //   inputElementRef.current.clear();
            // },
        });
    }, [fieldName, registerField]);

    return (
        <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>
            {icon === 'lock' ? (
                <MaterialIcons
                    style={{ marginRight: 8 }}
                    name={isFocused || isFilled ? 'lock' : 'lock-outline'}
                    size={20}
                    color={isFocused || isFilled ? '#DA4453' : '#DA4453'}
                />
            ) : (
                <MaterialCommunityIcons
                    style={{ marginRight: 8 }}
                    name={isFocused || isFilled ? 'email' : 'email-outline'}
                    size={20}
                    color={isFocused || isFilled ? '#DA4453' : '#DA4453'}
                />
            )}

            <TextInput
                ref={inputElementRef}
                keyboardAppearance="dark"
                placeholderTextColor="#DA4453"
                defaultValue={defaultValue}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onChangeText={(value) => {
                    inputValueRef.current.value = value;
                }}
                {...rest}
            />
        </Container>
    );
};

export default forwardRef(Input);
