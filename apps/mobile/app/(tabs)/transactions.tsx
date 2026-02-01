import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Heading, BodyText, Card } from '@app/ui';
import { List } from '@tamagui/lucide-icons';

// Demo transactions data
const transactions = [
  { id: '1', icon: '🥬', title: 'Fruits & Vegetables', category: 'Groceries', amount: -100, date: 'Today' },
  { id: '2', icon: '💰', title: 'From Bank to Cash', category: 'Transfer', amount: 700, date: 'Today' },
  { id: '3', icon: '🍔', title: 'Burger', category: 'Groceries', amount: -5.45, date: 'Yesterday' },
  { id: '4', icon: '💰', title: 'From Bank to Cash', category: 'Transfer', amount: 1200, date: 'Yesterday' },
  { id: '5', icon: '🛒', title: 'Weekly Shopping', category: 'Groceries', amount: -85.50, date: 'Jan 28' },
  { id: '6', icon: '⛽', title: 'Gas Station', category: 'Transportation', amount: -45.00, date: 'Jan 27' },
  { id: '7', icon: '🎬', title: 'Netflix', category: 'Entertainment', amount: -15.99, date: 'Jan 26' },
  { id: '8', icon: '💡', title: 'Electric Bill', category: 'Utilities', amount: -120.00, date: 'Jan 25' },
];

function TransactionItem({ icon, title, category, amount, date }: {
  icon: string;
  title: string;
  category: string;
  amount: number;
  date: string;
}) {
  const isIncome = amount > 0;
  return (
    <XStack
      backgroundColor="white"
      padding="$3"
      borderRadius="$3"
      alignItems="center"
      justifyContent="space-between"
    >
      <XStack gap="$3" alignItems="center" flex={1}>
        <YStack
          width={44}
          height={44}
          borderRadius={22}
          backgroundColor="#f1f5f9"
          alignItems="center"
          justifyContent="center"
        >
          <BodyText fontSize={20}>{icon}</BodyText>
        </YStack>
        <YStack flex={1}>
          <BodyText fontWeight="600" numberOfLines={1}>{title}</BodyText>
          <XStack gap="$2">
            <BodyText size="sm" color="$neutral500">{category}</BodyText>
            <BodyText size="sm" color="$neutral400">•</BodyText>
            <BodyText size="sm" color="$neutral400">{date}</BodyText>
          </XStack>
        </YStack>
      </XStack>
      <BodyText fontWeight="600" color={isIncome ? '#10b981' : '$color'}>
        {isIncome ? '+' : ''}{amount < 0 ? `-$${Math.abs(amount).toFixed(2)}` : `$${amount.toFixed(2)}`}
      </BodyText>
    </XStack>
  );
}

export default function TransactionsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f5f9' }} edges={['top']}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <YStack padding="$4" paddingBottom="$2">
          <XStack alignItems="center" gap="$3">
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
            <YStack>
              <Heading level={2}>Transactions</Heading>
              <BodyText color="$neutral500" size="sm">Your recent activity</BodyText>
            </YStack>
          </XStack>
        </YStack>

        {/* Filter Chips */}
        <XStack paddingHorizontal="$4" paddingBottom="$3" gap="$2">
          <YStack backgroundColor="#6366f1" paddingHorizontal="$3" paddingVertical="$2" borderRadius="$4">
            <BodyText color="white" size="sm" fontWeight="500">All</BodyText>
          </YStack>
          <YStack backgroundColor="white" paddingHorizontal="$3" paddingVertical="$2" borderRadius="$4">
            <BodyText color="$neutral600" size="sm" fontWeight="500">Income</BodyText>
          </YStack>
          <YStack backgroundColor="white" paddingHorizontal="$3" paddingVertical="$2" borderRadius="$4">
            <BodyText color="$neutral600" size="sm" fontWeight="500">Expenses</BodyText>
          </YStack>
        </XStack>

        {/* Transactions List */}
        <YStack padding="$4" paddingTop="$2" gap="$2">
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} {...tx} />
          ))}
        </YStack>

        {/* Bottom padding for tab bar */}
        <YStack height={20} />
      </ScrollView>
    </SafeAreaView>
  );
}
