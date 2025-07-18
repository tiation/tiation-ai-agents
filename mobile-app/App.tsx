import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as ReduxProvider } from 'react-redux';
import { StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { store } from './src/store';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { AgentsScreen } from './src/screens/AgentsScreen';
import { MonitoringScreen } from './src/screens/MonitoringScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <NavigationContainer>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background.primary}
          translucent={false}
        />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string;

              switch (route.name) {
                case 'Dashboard':
                  iconName = 'dashboard';
                  break;
                case 'Agents':
                  iconName = 'smart-toy';
                  break;
                case 'Monitoring':
                  iconName = 'analytics';
                  break;
                case 'Settings':
                  iconName = 'settings';
                  break;
                default:
                  iconName = 'help';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: colors.accent.cyan,
            tabBarInactiveTintColor: colors.text.secondary,
            tabBarStyle: styles.tabBar,
            tabBarBackground: () => (
              <LinearGradient
                colors={[colors.background.secondary, colors.background.primary]}
                style={styles.tabBarGradient}
              />
            ),
            headerStyle: {
              backgroundColor: colors.background.primary,
              borderBottomWidth: 1,
              borderBottomColor: colors.accent.cyan,
            },
            headerTitleStyle: {
              color: colors.text.primary,
              fontWeight: 'bold',
            },
            headerTintColor: colors.accent.cyan,
          })}
        >
          <Tab.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{
              title: 'AI Dashboard',
              headerTitle: '🤖 Tiation AI Agents',
            }}
          />
          <Tab.Screen 
            name="Agents" 
            component={AgentsScreen}
            options={{
              title: 'Agents',
              headerTitle: '⚡ AI Agents',
            }}
          />
          <Tab.Screen 
            name="Monitoring" 
            component={MonitoringScreen}
            options={{
              title: 'Monitoring',
              headerTitle: '📊 System Monitor',
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              title: 'Settings',
              headerTitle: '⚙️ Settings',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ReduxProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: 'transparent',
    height: 70,
  },
  tabBarGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: colors.accent.cyan,
  },
});

export default App;
