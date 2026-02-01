import { YStack, XStack, ScrollView } from 'tamagui';
import { Heading, BodyText } from '../components/Typography';
import { transactionsData, formatTransactionAmount } from './screenData';
import type { TransactionData } from './screenData';

function TransactionItemWithDate({ icon, title, category, amount, date }: TransactionData) {
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
            {date && (
              <>
                <BodyText size="sm" color="$neutral400">•</BodyText>
                <BodyText size="sm" color="$neutral400">{date}</BodyText>
              </>
            )}
          </XStack>
        </YStack>
      </XStack>
      <BodyText fontWeight="600" color={isIncome ? '#10b981' : '$color'}>
        {formatTransactionAmount(amount)}
      </BodyText>
    </XStack>
  );
}

interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

function FilterChip({ label, active }: FilterChipProps) {
  return (
    <YStack
      backgroundColor={active ? '#6366f1' : 'white'}
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius="$4"
    >
      <BodyText
        color={active ? 'white' : '$neutral600'}
        size="sm"
        fontWeight="500"
      >
        {label}
      </BodyText>
    </YStack>
  );
}

interface TransactionsContentProps {
  headerIcon?: React.ReactNode;
}

export function TransactionsContent({ headerIcon }: TransactionsContentProps) {
  return (
    <YStack flex={1}>
      {/* Header */}
      <YStack padding="$4" paddingBottom="$2">
        <XStack alignItems="center" gap="$3">
          {headerIcon || (
            <YStack
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor="#e0e7ff"
              alignItems="center"
              justifyContent="center"
            >
              <BodyText fontSize={24}>📋</BodyText>
            </YStack>
          )}
          <YStack>
            <Heading level={2}>Transactions</Heading>
            <BodyText color="$neutral500" size="sm">Your recent activity</BodyText>
          </YStack>
        </XStack>
      </YStack>

      {/* Filter Chips */}
      <XStack paddingHorizontal="$4" paddingBottom="$3" gap="$2">
        <FilterChip label="All" active />
        <FilterChip label="Income" />
        <FilterChip label="Expenses" />
      </XStack>

      {/* Transactions List */}
      <YStack padding="$4" paddingTop="$2" gap="$2" flex={1}>
        {transactionsData.map((tx) => (
          <TransactionItemWithDate key={tx.id} {...tx} />
        ))}
      </YStack>
    </YStack>
  );
}
