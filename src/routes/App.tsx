import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import FindHelp from '../screens/FindHelp';
import Login from '../screens/Login';
import LoginRegister from '../screens/LoginRegister';
import MainScreen from '../screens/MainScreen';
import Menu from '../screens/Menu';
import NewHelp from '../screens/NewHelp';
import Register from '../screens/Register';
import UpdateRegister from '../screens/UpdateRegister';



const App = createStackNavigator();

const AppRoutes: React.FC = () => {
    return (
        <App.Navigator
            initialRouteName="Main"
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#f0f0f0' },
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <App.Screen name="LoginRegister" component={LoginRegister} />
            <App.Screen name="Main" component={MainScreen} />
            <App.Screen name="Login" component={Login} />
            <App.Screen name="Register" component={Register} />
            <App.Screen name="Menu" component={Menu} />
            <App.Screen name="NewHelp" component={NewHelp} />
            <App.Screen name="UpdateRegister" component={UpdateRegister} />
            <App.Screen name="FindHelp" component={FindHelp} />
        </App.Navigator>
    );
};
export default AppRoutes;
