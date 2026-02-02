import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, Heading, BodyText } from '@app/ui';
import { Plus } from '@tamagui/lucide-icons';

// This is a placeholder screen for the FAB action
// The actual add flow is handled by the FAB button navigating to /add route
export default function AddPlaceholder() {
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
          <Plus size={40} color="#6366f1" />
        </YStack>
        <Heading level={2}>Add Transaction</Heading>
        <BodyText color="$neutral500" textAlign="center">
          Use the + button to add a new transaction.
        </BodyText>
      </YStack>
    </SafeAreaView>
  );
}
