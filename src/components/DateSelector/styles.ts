import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
    padding-top: 18px;
    padding-left: 8px;
    border-bottom-width: 2px;
    border-bottom-color: #e5e5e5;
`;

export const SelectorContainer = styled.View`
    background-color: #c4c4c4;
    padding: 5px;
    border-radius: 5px;
    margin: 0px 14px 16px 14px;
    height: ${Platform.OS === 'android' ? 50 : 80}px;
    justify-content: center;
`;

export const Text = styled.Text`
    font-family: sans-serif;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
`;

export const ActionText = styled.Text`
    font-family: sans-serif;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    color: #e82b43;
    padding: 2px 4% 1px 0;
`;
