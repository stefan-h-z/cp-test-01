import { YStack, XStack, Heading, BodyText, Card } from '@app/ui';
import { CreditCard, Building2, Wallet, PiggyBank } from '@tamagui/lucide-icons';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Demo accounts data
const accounts = [
  {
    id: '1',
    name: 'Main Checking',
    type: 'checking',
    institution: 'Chase Bank',
    balance: 4520.50,
    icon: Building2,
    color: '#6366f1'
  },
  {
    id: '2',
    name: 'Savings Account',
    type: 'savings',
    institution: 'Chase Bank',
    balance: 12350.00,
    icon: PiggyBank,
    color: '#10b981'
  },
  {
    id: '3',
    name: 'Credit Card',
    type: 'credit',
    institution: 'American Express',
    balance: -1250.75,
    icon: CreditCard,
    color: '#f59e0b'
  },
  {
    id: '4',
    name: 'Cash',
    type: 'cash',
    institution: 'Cash on hand',
    balance: 350.00,
    icon: Wallet,
    color: '#ec4899'
  },
];

function AccountCard({ name, type, institution, balance, icon: Icon, color }: {
  name: string;
  type: string;
  institution: string;
  balance: number;
  icon: typeof CreditCard;
  color: string;
}) {
  const isNegative = balance < 0;
  return (
    <Card padded backgroundColor="white">
      <XStack alignItems="center" justifyContent="space-between">
        <XStack gap="$3" alignItems="center" flex={1}>
          <YStack
            width={48}
            height={48}
            borderRadius={24}
            backgroundColor={`${color}20`}
            alignItems="center"
            justifyContent="center"
          >
            <Icon size={24} color={color} />
          </YStack>
          <YStack flex={1}>
            <BodyText fontWeight="600">{name}</BodyText>
            <BodyText size="sm" color="$neutral500">{institution}</BodyText>
          </YStack>
        </XStack>
        <YStack alignItems="flex-end">
          <Heading level={4} color={isNegative ? '#ef4444' : '$color'}>
            {isNegative ? '-' : ''}${Math.abs(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Heading>
          <BodyText size="xs" color="$neutral400" textTransform="capitalize">{type}</BodyText>
        </YStack>
      </XStack>
    </Card>
  );
}

export default function AccountsScreen() {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

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
              <CreditCard size={24} color="#6366f1" />
            </YStack>
            <YStack>
              <Heading level={2}>Accounts</Heading>
              <BodyText color="$neutral500" size="sm">Manage your finances</BodyText>
            </YStack>
          </XStack>
        </YStack>

        {/* Total Balance Card */}
        <YStack paddingHorizontal="$4" paddingBottom="$4">
          <Card padded backgroundColor="#6366f1">
            <YStack alignItems="center" gap="$2" paddingVertical="$2">
              <BodyText color="rgba(255,255,255,0.7)" size="sm">Total Net Worth</BodyText>
              <Heading level={1} color="white">
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Heading>
              <XStack gap="$4" marginTop="$2">
                <YStack alignItems="center">
                  <BodyText color="rgba(255,255,255,0.7)" size="xs">Assets</BodyText>
                  <BodyText color="white" fontWeight="600">
                    ${accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </BodyText>
                </YStack>
                <YStack alignItems="center">
                  <BodyText color="rgba(255,255,255,0.7)" size="xs">Liabilities</BodyText>
                  <BodyText color="white" fontWeight="600">
                    ${Math.abs(accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + a.balance, 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </BodyText>
                </YStack>
              </XStack>
            </YStack>
          </Card>
        </YStack>

        {/* Accounts List */}
        <YStack paddingHorizontal="$4" gap="$3">
          <Heading level={4}>Your Accounts</Heading>
          {accounts.map((account) => (
            <AccountCard key={account.id} {...account} />
          ))}
        </YStack>

        {/* Add Account Button */}
        <YStack padding="$4">
          <Card
            padded
            backgroundColor="white"
            borderWidth={2}
            borderColor="#e2e8f0"
            borderStyle="dashed"
          >
            <XStack alignItems="center" justifyContent="center" gap="$2" paddingVertical="$2">
              <CreditCard size={20} color="#94a3b8" />
              <BodyText color="$neutral500" fontWeight="500">Add New Account</BodyText>
            </XStack>
          </Card>
        </YStack>

        {/* Bottom padding for tab bar */}
        <YStack height={20} />
      </ScrollView>
    </SafeAreaView>
  );
}
