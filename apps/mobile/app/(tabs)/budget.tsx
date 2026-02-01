import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, Heading, BodyText } from '@app/ui';
import { Calendar } from '@tamagui/lucide-icons';

export default function BudgetScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f5f9' }} edges={['top']}>
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$6" gap="$4">
        <YStack
          width={80}
          height={80}
          borderRadius={40}
          backgroundColor="#e0e7ff"
          alignItems="center"
          justifyContent="center"
        >
          <Calendar size={40} color="#6366f1" />
        </YStack>
        <Heading level={2}>Budget</Heading>
        <BodyText color="$neutral500" textAlign="center">
          Manage your monthly budgets and spending limits.
        </BodyText>
        <BodyText color="$neutral400" size="sm">Coming soon...</BodyText>
      </YStack>
    </SafeAreaView>
  );
}
