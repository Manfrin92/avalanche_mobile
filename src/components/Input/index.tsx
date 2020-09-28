import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import { TextInputProps, TouchableOpacity, Keyboard, Platform } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';

import { useField } from '@unform/core';

import { Container, TextInput } from './styles';

interface InputProps extends TextInputProps {
    name: string;
    width?: number;
    iconName?: string;
}

interface InputValueReference {
    value: any;
}

interface InputRef {
    focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = ({ name, iconName, width, ...rest }, ref) => {
    const inputElementRef = useRef<any>(null);
    const { registerField, defaultValue = '', fieldName, error } = useField(name);
    const inputValueRef = useRef<InputValueReference>({ value: defaultValue });
    const [isIos, setIsIos] = useState(false);

    useImperativeHandle(ref, () => ({
        focus() {
            inputElementRef.current.focus();
        },
    }));

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',
            setValue(ref: any, value) {
                inputValueRef.current.value = value;
                inputElementRef.current.setNativeProps({ text: value });
            },
            clearValue() {
                inputValueRef.current.value = '';
                inputElementRef.current.clear();
            },
        });

        Platform.OS === 'ios' ? setIsIos(true) : setIsIos(false);
    }, [fieldName, registerField]);

    return (
        <Container isErrored={!!error} width={width}>
            {iconName && (
                <Ionicons style={{ padding: 18, paddingRight: 4 }} name={iconName} color="#FFF" size={26} />
            )}

            <TextInput
                ref={inputElementRef}
                placeholderTextColor="#FFFFFF"
                defaultValue={defaultValue}
                onChangeText={(value) => {
                    inputValueRef.current.value = value;
                }}
                {...rest}
            />
            {isIos && (
                <TouchableOpacity
                    onPress={() => {
                        Keyboard.dismiss();
                    }}
                    style={{ alignSelf: 'auto', paddingRight: 6 }}
                >
                    <AntDesign name="right" size={20} color="#FFF" />
                </TouchableOpacity>
            )}
        </Container>
    );
};

export default forwardRef(Input);
