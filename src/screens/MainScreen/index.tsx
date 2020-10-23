import React, { useCallback, useState, useEffect } from 'react';
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
import { HelpDataToShow } from '../../utils/Interfaces';
import { useAuth } from '../../hooks/auth';
import { ScreenNamesEnum } from '../../utils/enums';

const MainScreen: React.FC = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [helps, setHelps] = useState([] as HelpDataToShow[]);

    const getHelpsByUser = useCallback(async () => {
        const helpsRaw = await api.post('/help/findHelps', {
            userManagerId: user.id,
        });

        setHelps(helpsRaw.data);
    }, [user.id]);

    useEffect(() => {
        getHelpsByUser();
    }, [getHelpsByUser]);

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

            <ScrollView>
                {helps.length > 0 &&
                    helps.map((help) => {
                        return <HelpItem key={help.id} id={help.id} title={help.title} />;
                    })}
            </ScrollView>

            <View style={{ flexDirection: 'row', marginTop: '4%' }}>
                <View style={{ width: '84%', height: '100%' }} />
                <TouchableOpacity onPress={() => navigation.navigate(ScreenNamesEnum.NewHelp)}>
                    <Ionicons name="md-add-circle" size={60} color="#4A89DC" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default MainScreen;
