import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { TextInputProps, View } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useField } from '@unform/core';

import {
    cpfPattern,
    phonePattern,
    phonePatternExtraDigit,
    cepPattern,
    hourPattern,
} from '../../utils/RegexPatterns';

import { Container, TextInput, Label, LabelContainer } from './styles';

interface InputProps extends TextInputProps {
    name: string;
    iconName?: string;
    maskName?: 'phone' | 'cpf' | 'cep';
    width?: number;
    cepIcon?: boolean;
    getCep?: (e: any) => Promise<void>;
    labelName?: string;
    marginBottom?: number;
    isProfile?: boolean;
}

interface InputValueReference {
    value: string;
}

interface InputRef {
    focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
    { name, iconName, maskName, width, cepIcon, getCep, labelName, marginBottom, isProfile, ...rest },
    ref,
) => {
    const [maskedText, setMaskedText] = useState('');
    const inputElementRef = useRef<any>(null);
    const { registerField, defaultValue = '', fieldName, error } = useField(name);
    const inputValueRef = useRef<InputValueReference>({ value: defaultValue });
    // const [isIos, setIsIos] = useState(false);

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
            setValue(ref: any, value) {
                inputValueRef.current.value = value;
                inputElementRef.current.setNativeProps({ text: value });
            },
            clearValue() {
                inputValueRef.current.value = '';
                inputElementRef.current.clear();
            },
        });
    }, [fieldName, registerField]);

    return (
        <>
            {labelName && !width && (
                <LabelContainer>
                    <Label>{labelName}</Label>
                </LabelContainer>
            )}

            <Container marginBottom={marginBottom} isErrored={!!error} width={width}>
                {width && (
                    <LabelContainer style={{ marginTop: '-5%', marginLeft: '3%' }}>
                        <Label>{labelName}</Label>
                    </LabelContainer>
                )}

                {iconName && (
                    <Ionicons style={{ padding: 18, paddingRight: 4 }} name={iconName} color="#FFF" size={26} />
                )}

                <TextInput
                    ref={inputElementRef}
                    placeholderTextColor="#FFFFFF"
                    defaultValue={maskedText}
                    onChangeText={(value) => {
                        if (maskName === 'phone') {
                            if (value.replace(/\D/g, '').length === 9) {
                                let masked = value;
                                masked = value.replace(/\D/g, '');
                                masked = value.replace(phonePatternExtraDigit.Regex, phonePatternExtraDigit.Mask);
                                setMaskedText(masked);
                                inputValueRef.current.value = value;
                            } else if (value.replace(/\D/g, '').length === 8) {
                                let masked = value;
                                masked = value.replace(/\D/g, '');
                                masked = value.replace(phonePattern.Regex, phonePattern.Mask);
                                setMaskedText(masked);
                                inputValueRef.current.value = value;
                            }
                        } else if (maskName === 'cpf') {
                            let masked = value;
                            masked = value.replace(/\D/g, '');
                            masked = value.replace(cpfPattern.Regex, cpfPattern.Mask);
                            setMaskedText(masked);
                            inputValueRef.current.value = value;
                        } else if (maskName === 'cep') {
                            let masked = value;
                            masked = value.replace(/\D/g, '');
                            masked = value.replace(cepPattern.Regex, cepPattern.Mask);
                            setMaskedText(masked);
                            inputValueRef.current.value = value;
                        } else if (maskName === 'hourPattern') {
                            let masked = value;
                            masked = value.replace(/\D/g, '');
                            masked = value.replace(hourPattern.Regex, hourPattern.Mask);
                            setMaskedText(masked);
                            inputValueRef.current.value = value;
                        }
                    }}
                    {...rest}
                />
                {cepIcon && (
                    <View style={{ marginRight: 0 }}>
                        <FontAwesome
                            style={{ marginRight: 15 }}
                            onClick={getCep}
                            color="#e82b43"
                            size={24}
                            name="search"
                        />
                    </View>
                )}
            </Container>
        </>
    );
};

export default forwardRef(Input);
