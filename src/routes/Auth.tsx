import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import LoginRegister from '../screens/LoginRegister';
import Login from '../screens/Login';
import Register from '../screens/Register';
import MainScreen from '../screens/MainScreen';

const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => (
    <Auth.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#f0f0f0' },
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
    >
        <Auth.Screen name="Login" component={Login} />
        <Auth.Screen name="LoginRegister" component={LoginRegister} />
        <Auth.Screen name="Register" component={Register} />
        <Auth.Screen name="Main" component={MainScreen} />
    </Auth.Navigator>
);

export default AuthRoutes;
