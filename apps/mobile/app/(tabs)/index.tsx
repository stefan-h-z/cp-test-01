import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  YStack,
  XStack,
  DashboardHeader,
  StatsRow,
  DashboardContent,
} from '@app/ui';
import { useAuth } from '@app/shared';

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const handleMenuPress = () => {
    router.push('/settings');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f5f9' }} edges={['top']}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6', '#a855f7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 60,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <DashboardHeader userName={user?.name} onMenuPress={handleMenuPress} />
        </LinearGradient>

        {/* Stats Cards */}
        <XStack paddingHorizontal="$4" marginTop={-40}>
          <StatsRow />
        </XStack>

        {/* Main Content */}
        <DashboardContent userName={user?.name} />

        {/* Bottom padding for tab bar */}
        <YStack height={20} />
      </ScrollView>
    </SafeAreaView>
  );
}
