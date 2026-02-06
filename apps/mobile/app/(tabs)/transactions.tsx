import { YStack, TransactionsContent } from '@app/ui';
import { List } from '@tamagui/lucide-icons';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f5f9' }} edges={['top']}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <TransactionsContent
          headerIcon={
            <YStack
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor="#e0e7ff"
              alignItems="center"
              justifyContent="center"
            >
              <List size={24} color="#6366f1" />
            </YStack>
          }
        />
        <YStack height={20} />
      </ScrollView>
    </SafeAreaView>
  );
}
