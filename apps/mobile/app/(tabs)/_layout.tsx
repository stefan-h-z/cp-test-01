import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Activity, Calendar, List, CreditCard, Plus } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

function FABButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.fabContainer}
      onPress={() => router.push('/add')}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#6366f1', '#a855f7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fab}
      >
        <Plus size={24} color="white" strokeWidth={2.5} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: () => <FABButton />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, size }) => <List size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color, size }) => <CreditCard size={size} color={color} />,
        }}
      />
      {/* Hidden screens */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
