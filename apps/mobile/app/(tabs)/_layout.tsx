import { Tabs } from 'expo-router';
import { Home, Search, User } from '@tamagui/lucide-icons';
import { useAppConfig } from '@app/shared';

export default function TabLayout() {
  const config = useAppConfig();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: config.name,
        tabBarActiveTintColor: config.theme.primaryColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
