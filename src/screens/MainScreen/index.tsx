import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import api from '../../services/api';
import MainHeader from '../../components/MainHeader';
import HelpItem from '../../components/HelpItem';
import NewHelpButton from '../../components/NewHelpButton';
import { HelpDataToShow } from '../../utils/Interfaces';
import { ScreenNamesEnum } from '../../utils/enums';
import { useAuth } from '../../hooks/auth';
import Loading from '../Loading';

const MainScreen: React.FC = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [helps, setHelps] = useState([] as HelpDataToShow[]);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    const getHelpsByUser = useCallback(async () => {
        const helpsRaw = await api.post('/help/findHelps', {
            userManagerId: user.id,
        });
        setHelps([...helpsRaw.data]);
        setLoading(false);
    }, [user.id]);

    useEffect(() => {
        getHelpsByUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    if (loading) {
        return <Loading />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <MainHeader navigateToMenu={() => navigation.navigate(ScreenNamesEnum.Menu)} />

            <ScrollView>
                {helps.length > 0 &&
                    helps.map((help) => {
                        return <HelpItem key={help.id} id={help.id} title={help.title} />;
                    })}
            </ScrollView>

            <NewHelpButton navigateToNewHelp={() => navigation.navigate(ScreenNamesEnum.NewHelp)} />
        </SafeAreaView>
    );
};

export default MainScreen;
