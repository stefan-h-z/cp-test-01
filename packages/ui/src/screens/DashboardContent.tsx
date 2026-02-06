import { YStack, XStack } from 'tamagui';
import { Card } from '../components/Card';
import { Heading, BodyText } from '../components/Typography';
import { statsData, transactionsData, categoriesData, formatTransactionAmount } from './screenData';
import type { StatData, TransactionData, CategoryData } from './screenData';

// Reusable Components
export function StatCard({ label, value, change, changeType }: StatData) {
  return (
    <YStack
      backgroundColor="white"
      padding="$3"
      borderRadius="$4"
      flex={1}
      minWidth={140}
      gap="$1"
      shadowColor="rgba(0,0,0,0.08)"
      shadowOffset={{ width: 0, height: 2 }}
      shadowRadius={8}
      elevation={3}
    >
      <BodyText size="sm" color="$neutral500">
        {label}
      </BodyText>
      <Heading level={3}>{value}</Heading>
      <BodyText size="xs" color={changeType === 'positive' ? '#10b981' : '#ef4444'}>
        {change} from last month
      </BodyText>
    </YStack>
  );
}

export function TransactionItem({
  icon,
  title,
  category,
  amount,
}: Omit<TransactionData, 'id' | 'date'>) {
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
          <BodyText fontWeight="600" numberOfLines={1}>
            {title}
          </BodyText>
          <BodyText size="sm" color="$neutral500">
            {category}
          </BodyText>
        </YStack>
      </XStack>
      <BodyText fontWeight="600" color={isIncome ? '#10b981' : '$color'}>
        {formatTransactionAmount(amount)}
      </BodyText>
    </XStack>
  );
}

export function CategoryItem({ name, percentage, spent, budget, color }: CategoryData) {
  const progress = (spent / budget) * 100;

  return (
    <YStack gap="$2">
      <XStack justifyContent="space-between" alignItems="center">
        <XStack gap="$2" alignItems="center">
          <YStack width={12} height={12} borderRadius={6} backgroundColor={color} />
          <BodyText fontWeight="500">
            {percentage}% {name}
          </BodyText>
        </XStack>
      </XStack>
      <YStack height={6} backgroundColor="#e2e8f0" borderRadius={3} overflow="hidden">
        <YStack
          height="100%"
          width={`${Math.min(progress, 100)}%`}
          backgroundColor={color}
          borderRadius={3}
        />
      </YStack>
      <BodyText size="xs" color="$neutral500">
        Spent ${spent} of ${budget}
      </BodyText>
    </YStack>
  );
}

export function BudgetOverviewCard() {
  return (
    <Card padded backgroundColor="white">
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
        <Heading level={4}>Budget overview</Heading>
      </XStack>
      <XStack justifyContent="space-between">
        <YStack alignItems="center">
          <BodyText size="sm" color="$neutral500">
            Budgeted
          </BodyText>
          <Heading level={4}>$3,500</Heading>
        </YStack>
        <YStack alignItems="center">
          <BodyText size="sm" color="$neutral500">
            Spent
          </BodyText>
          <Heading level={4}>$1,400</Heading>
        </YStack>
        <YStack alignItems="center">
          <BodyText size="sm" color="$neutral500">
            Left
          </BodyText>
          <Heading level={4} color="#10b981">
            $2,100
          </Heading>
        </YStack>
      </XStack>
      <XStack
        marginTop="$3"
        padding="$3"
        backgroundColor="#ecfdf5"
        borderRadius="$3"
        alignItems="center"
        gap="$2"
      >
        <BodyText color="#059669">✓</BodyText>
        <BodyText size="sm" color="#059669">
          You are on track!
        </BodyText>
      </XStack>
    </Card>
  );
}

export function TransactionsCard({ limit = 4 }: { limit?: number }) {
  return (
    <Card padded backgroundColor="white">
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
        <Heading level={4}>Latest transactions</Heading>
        <BodyText size="sm" color="#6366f1" fontWeight="500">
          Show all
        </BodyText>
      </XStack>
      <YStack gap="$2">
        {transactionsData.slice(0, limit).map((tx) => (
          <TransactionItem key={tx.id} {...tx} />
        ))}
      </YStack>
    </Card>
  );
}

export function SpendingTrendsCard() {
  return (
    <Card padded backgroundColor="white">
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
        <Heading level={4}>Spending trends</Heading>
        <BodyText size="xs" color="$neutral500">
          This month
        </BodyText>
      </XStack>
      <YStack gap="$4">
        {categoriesData.map((cat) => (
          <CategoryItem key={cat.name} {...cat} />
        ))}
      </YStack>
    </Card>
  );
}

interface DashboardHeaderProps {
  userName?: string;
  userAvatar?: string;
  balance?: string;
  onMenuPress?: () => void;
}

// Menu Icon for header
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function DashboardHeader({
  userName = 'Developer',
  balance = '$450',
  onMenuPress,
}: DashboardHeaderProps) {
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <YStack gap="$4">
      {/* Top Bar */}
      <XStack justifyContent="space-between" alignItems="center">
        <XStack gap="$3" alignItems="center">
          <YStack
            width={44}
            height={44}
            borderRadius={22}
            backgroundColor="rgba(255,255,255,0.2)"
            alignItems="center"
            justifyContent="center"
          >
            <BodyText color="white" fontWeight="600" fontSize={18}>
              {userName.charAt(0)}
            </BodyText>
          </YStack>
          <YStack>
            <BodyText size="sm" color="rgba(255,255,255,0.7)">
              My Budget
            </BodyText>
            <BodyText color="white" fontWeight="500">
              {currentMonth}
            </BodyText>
          </YStack>
        </XStack>
        {onMenuPress && (
          <YStack
            padding="$2"
            borderRadius="$2"
            backgroundColor="rgba(255,255,255,0.1)"
            cursor="pointer"
            hoverStyle={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onPress={onMenuPress}
          >
            <MenuIcon />
          </YStack>
        )}
      </XStack>

      {/* Balance */}
      <YStack alignItems="center" gap="$1" paddingVertical="$4">
        <BodyText color="rgba(255,255,255,0.7)">Funds available to budget</BodyText>
        <Heading level={1} color="white" fontSize={48}>
          {balance}
        </Heading>
      </YStack>
    </YStack>
  );
}

export function StatsRow() {
  return (
    <XStack gap="$3" justifyContent="center">
      {statsData.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </XStack>
  );
}

// Main Dashboard Content - can be used by both web and mobile
interface DashboardContentProps {
  userName?: string;
  userAvatar?: string;
}

export function DashboardContent({
  userName: _userName,
  userAvatar: _userAvatar,
}: DashboardContentProps) {
  return (
    <YStack flex={1} gap="$4" padding="$4">
      <BudgetOverviewCard />
      <TransactionsCard />
      <SpendingTrendsCard />
    </YStack>
  );
}
