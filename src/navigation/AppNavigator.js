import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MockTestSelector from '../screens/MockTestSelector';
import TestRunner from '../screens/TestRunner';
import ParentDashboard from '../screens/ParentDashboard';
import { COLORS } from '../constants/theme';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerShell() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.blue },
        headerTintColor: '#FFFFFF',
        drawerActiveTintColor: COLORS.blue,
        drawerInactiveTintColor: COLORS.text,
        drawerLabelStyle: { fontWeight: '700' },
        sceneStyle: { backgroundColor: '#F8F9FA' },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Mock Tests" component={MockTestSelector} />
      <Drawer.Screen name="Parent Dashboard" component={ParentDashboard} />
    </Drawer.Navigator>
  );
}

export function AppNavigator() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#F8F9FA',
      card: '#FFFFFF',
      text: COLORS.text,
      border: COLORS.border,
      primary: COLORS.blue,
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.blue },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: '#F8F9FA' },
        }}
      >
        <Stack.Screen name="Main" component={DrawerShell} options={{ headerShown: false }} />
        <Stack.Screen name="TestRunner" component={TestRunner} options={{ title: 'Mock Test' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
