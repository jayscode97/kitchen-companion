import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.warmWhite,
          borderTopColor: Colors.divider,
          height: 68,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 15, fontWeight: '600' },
        tabBarActiveTintColor: Colors.warmOrange,
        tabBarInactiveTintColor: Colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Recipes',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🍽</Text>,
        }}
      />
      <Tabs.Screen
        name="airfryer"
        options={{
          title: 'Air Fryer',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>💨</Text>,
        }}
      />
    </Tabs>
  );
}
