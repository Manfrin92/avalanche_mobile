import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

const App: React.FC = () => {
    return (
        <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
            <Text> teste Open up App.tsx to start working on your app!</Text>
            <StatusBar backgroundColor="#F9F9F9" />
        </View>
    );
};

export default App;
