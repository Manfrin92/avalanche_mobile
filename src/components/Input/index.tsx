import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import { TextInputProps, TouchableOpacity, Keyboard, Platform, View } from 'react-native';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';

import { useField } from '@unform/core';

import { Container, TextInput, Label, LabelContainer } from './styles';

interface InputProps extends TextInputProps {
    name: string;
    height?: number;
    width?: number;
    iconName?: string;
    cepIcon?: boolean;
    getCep?: (e: any) => Promise<void>;
    labelName?: string;
    marginBottom?: number;
    searchIcon?: boolean;
    searchClick?(): void;
}

interface InputValueReference {
    value: any;
}

interface InputRef {
    focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
    { name, iconName, height, width, cepIcon, getCep, labelName, marginBottom, searchIcon, searchClick, ...rest },
    ref,
) => {
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
        <>
            {labelName && (
                <LabelContainer>
                    <Label>{labelName}</Label>
                </LabelContainer>
            )}
            <Container marginBottom={marginBottom} isErrored={!!error} width={width} height={height}>
                {iconName && (
                    <Ionicons style={{ padding: 18, paddingRight: 4 }} name={iconName} color="#FFF" size={26} />
                )}

                <TextInput
                    ref={inputElementRef}
                    placeholderTextColor="#acacac"
                    defaultValue={defaultValue}
                    onChangeText={(value) => {
                        inputValueRef.current.value = value;
                    }}
                    {...rest}
                />

                {cepIcon && (
                    <View style={{ marginRight: 0 }}>
                        <FontAwesome
                            style={{ marginRight: 15, marginTop: '35%' }}
                            onClick={getCep}
                            color="#da4453"
                            size={24}
                            name="search"
                        />
                    </View>
                )}

                {searchIcon && searchClick && (
                    <TouchableOpacity style={{ marginRight: 0 }} onPress={searchClick}>
                        <FontAwesome
                            style={{ marginRight: 15, marginTop: '35%' }}
                            color="#da4453"
                            size={24}
                            name="search"
                        />
                    </TouchableOpacity>
                )}

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
        </>
    );
};

export default forwardRef(Input);
