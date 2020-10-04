import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes';

import MainScreen from './src/screens/MainScreen';

const App: React.FC = () => {
    return (
        <MainScreen />
        // <NavigationContainer>
        //     <Routes />
        // </NavigationContainer>
    );
};

export default App;
