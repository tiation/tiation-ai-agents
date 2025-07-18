/**
 * Tiation AI Agents Mobile App
 * Enterprise AI Automation Platform
 * 
 * @format
 */

import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { TiationTheme } from './src/styles/theme';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AgentsScreen } from './src/screens/AgentsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={TiationTheme.colors.background}
        />
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              backgroundColor: TiationTheme.colors.surface,
              borderTopColor: TiationTheme.colors.accent,
              borderTopWidth: 1,
            },
            tabBarActiveTintColor: TiationTheme.colors.primary,
            tabBarInactiveTintColor: TiationTheme.colors.textSecondary,
            headerStyle: {
              backgroundColor: TiationTheme.colors.surface,
              borderBottomColor: TiationTheme.colors.accent,
            },
            headerTintColor: TiationTheme.colors.textPrimary,
          }}
        >
          <Tab.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Text style={{ color, fontSize: size }}>📊</Text>
              ),
            }}
          />
          <Tab.Screen 
            name="Agents" 
            component={AgentsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Text style={{ color, fontSize: size }}>🤖</Text>
              ),
            }}
          />
          <Tab.Screen 
            name="Analytics" 
            component={AnalyticsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Text style={{ color, fontSize: size }}>📈</Text>
              ),
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Text style={{ color, fontSize: size }}>⚙️</Text>
              ),
            }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TiationTheme.colors.background,
  },
});

export default App;
