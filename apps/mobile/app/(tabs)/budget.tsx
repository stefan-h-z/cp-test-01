import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, BudgetContent } from '@app/ui';
import { Calendar } from '@tamagui/lucide-icons';

export default function BudgetScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f5f9' }} edges={['top']}>
      <BudgetContent
        icon={
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
        }
      />
    </SafeAreaView>
  );
}
