import React, { useCallback, useState, useEffect } from 'react';
import { Alert, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import api from '../../services/api';
import MainHeader from '../../components/MainHeader';
import HelpItem from '../../components/HelpItem';
import NewHelpButton from '../../components/NewHelpButton';
import { HelpDateDataToShow } from '../../utils/Interfaces';
import { ScreenNamesEnum } from '../../utils/enums';
import { useAuth } from '../../hooks/auth';
import Loading from '../Loading';

const MainScreen: React.FC = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [helpDates, setHelpDates] = useState([] as HelpDateDataToShow[]);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    const handleExcludeHelp = useCallback(
        async (id: string) => {
            try {
                Alert.alert('Excluir ajuda', 'Realmente deseja excluir a ajuda?', [
                    {
                        text: 'Não',
                        style: 'cancel',
                    },
                    {
                        text: 'Sim',
                        onPress: async () => {
                            setLoading(true);
                            try {
                                await api.delete(`help/${id}`);
                                const newHelps = helpDates.filter((helpDate) => helpDate.help.id !== id);
                                setHelpDates(newHelps);
                                setLoading(false);
                            } catch (e) {
                                setLoading(false);
                                Alert.alert('Falha ao excluir ajuda.');
                            }
                        },
                    },
                ]);
            } catch (e) {
                Alert.alert('Não foi possível deletar a ajuda');
                // // console.log(e);
            }
        },
        [helpDates],
    );

    const getHelpsByUser = useCallback(async () => {
        try {
            if (user && user.id) {
                const helpsRaw = await api.get(`/help/${user.id}`);
                setHelpDates([...helpsRaw.data]);

                setLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    }, [user]);

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
                {helpDates.length > 0 &&
                    helpDates.map((helpDate) => {
                        return (
                            <HelpItem
                                helpType={helpDate.type}
                                ExcludeHelp={() => handleExcludeHelp(helpDate.help.id)}
                                key={helpDate.help.id}
                                id={helpDate.help.id}
                                title={helpDate.help.title}
                                navigate={() =>
                                    navigation.navigate(ScreenNamesEnum.NewHelp, {
                                        helpId: helpDate.help.id,
                                        editing: true,
                                    })
                                }
                            />
                        );
                    })}
            </ScrollView>

            <NewHelpButton navigateToNewHelp={() => navigation.navigate(ScreenNamesEnum.NewHelp)} />
        </SafeAreaView>
    );
};

export default MainScreen;
