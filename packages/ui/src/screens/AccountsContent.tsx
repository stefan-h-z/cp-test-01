import { YStack, XStack } from 'tamagui';
import { Card } from '../components/Card';
import { Heading, BodyText } from '../components/Typography';
import { accountsData, formatCurrency } from './screenData';
import type { AccountData } from './screenData';

interface AccountCardProps extends AccountData {
  icon?: React.ReactNode;
}

function AccountCard({ name, type, institution, balance, color, icon }: AccountCardProps) {
  const isNegative = balance < 0;
  return (
    <Card padded backgroundColor="white">
      <XStack alignItems="center" justifyContent="space-between">
        <XStack gap="$3" alignItems="center" flex={1}>
          {icon || (
            <YStack
              width={48}
              height={48}
              borderRadius={24}
              backgroundColor={`${color}20`}
              alignItems="center"
              justifyContent="center"
            >
              <BodyText fontSize={24}>
                {type === 'checking' ? '🏦' : type === 'savings' ? '🐷' : type === 'credit' ? '💳' : '💵'}
              </BodyText>
            </YStack>
          )}
          <YStack flex={1}>
            <BodyText fontWeight="600">{name}</BodyText>
            <BodyText size="sm" color="$neutral500">{institution}</BodyText>
          </YStack>
        </XStack>
        <YStack alignItems="flex-end">
          <Heading level={4} color={isNegative ? '#ef4444' : '$color'}>
            {formatCurrency(balance)}
          </Heading>
          <BodyText size="xs" color="$neutral400" textTransform="capitalize">{type}</BodyText>
        </YStack>
      </XStack>
    </Card>
  );
}

interface AccountsContentProps {
  headerIcon?: React.ReactNode;
}

export function AccountsContent({ headerIcon }: AccountsContentProps) {
  const totalBalance = accountsData.reduce((sum, acc) => sum + acc.balance, 0);
  const assets = accountsData.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0);
  const liabilities = Math.abs(accountsData.filter(a => a.balance < 0).reduce((sum, a) => sum + a.balance, 0));

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
              <BodyText fontSize={24}>💳</BodyText>
            </YStack>
          )}
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
              {formatCurrency(totalBalance)}
            </Heading>
            <XStack gap="$4" marginTop="$2">
              <YStack alignItems="center">
                <BodyText color="rgba(255,255,255,0.7)" size="xs">Assets</BodyText>
                <BodyText color="white" fontWeight="600">
                  {formatCurrency(assets)}
                </BodyText>
              </YStack>
              <YStack alignItems="center">
                <BodyText color="rgba(255,255,255,0.7)" size="xs">Liabilities</BodyText>
                <BodyText color="white" fontWeight="600">
                  {formatCurrency(liabilities)}
                </BodyText>
              </YStack>
            </XStack>
          </YStack>
        </Card>
      </YStack>

      {/* Accounts List */}
      <YStack paddingHorizontal="$4" gap="$3">
        <Heading level={4}>Your Accounts</Heading>
        {accountsData.map((account) => (
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
            <BodyText fontSize={20}>➕</BodyText>
            <BodyText color="$neutral500" fontWeight="500">Add New Account</BodyText>
          </XStack>
        </Card>
      </YStack>
    </YStack>
  );
}
