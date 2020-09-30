import React from 'react';

import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import Login from '../screens/Login';
import LoginRegister from '../screens/LoginRegister';
import Register from '../screens/Register';

const App = createStackNavigator();

const AppRoutes: React.FC = () => {
    return (
        <App.Navigator
            initialRouteName="LoginRegister"
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#f0f0f0' },
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <App.Screen name="LoginRegister" component={LoginRegister} />
            <App.Screen name="Login" component={Login} />
            <App.Screen name="Register" component={Register} />
        </App.Navigator>
    );
};
export default AppRoutes;
