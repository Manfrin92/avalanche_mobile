import React from 'react';
import { View, Alert, SafeAreaView, ScrollView } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Logo from '../../../assets/logo.png';

import HelpItem from '../../components/HelpItem';

import {
    Container,
    HeaderNavigatorContainer,
    NavigationText,
    StyledImage,
    StageText,
    BoldText,
    TextInput,
    InputContainer,
} from './styles';
import getValidationsErrors from '../../utils/getValidationsErrors';
import Input from '../../components/Input';
import api from '../../services/api';

const MainScreen: React.FC = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderNavigatorContainer>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginLeft: 19,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}
                >
                    <StyledImage source={Logo} />
                    <NavigationText>
                        Minhas <BoldText>Ajudas</BoldText>
                    </NavigationText>
                </View>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '4%',
                    }}
                    onPress={() => navigation.navigate('Menu')}
                >
                    <Entypo name="menu" size={40} color="black" />
                </TouchableOpacity>
            </HeaderNavigatorContainer>

            <HelpItem />
            <HelpItem />
            <HelpItem />
            <HelpItem />
            <HelpItem />

            <View style={{ flexDirection: 'row', marginTop: '4%' }}>
                <View style={{ width: '84%', height: '100%' }} />
                <TouchableOpacity onPress={() => navigation.navigate('NewHelp')}>
                    <Ionicons name="md-add-circle" size={60} color="#4A89DC" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default MainScreen;
