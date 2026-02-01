import { ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack, XStack, Heading, BodyText, Card } from '@app/ui';
import { useAuth } from '@app/shared';
import { ChevronRight } from '@tamagui/lucide-icons';

const { width } = Dimensions.get('window');

// Demo data
const stats = [
  { label: 'Saving', value: '$565', change: '+10%', changeType: 'positive' as const },
  { label: 'Debts', value: '$597', change: '-0.2%', changeType: 'negative' as const },
];

const transactions = [
  { id: '1', icon: '🥬', title: 'Fruits & Vegetables', category: 'Groceries', amount: -100 },
  { id: '2', icon: '💰', title: 'From Bank to Cash', category: 'Transfer', amount: 700 },
  { id: '3', icon: '🍔', title: 'Burger', category: 'Groceries', amount: -5.45 },
  { id: '4', icon: '💰', title: 'From Bank to Cash', category: 'Transfer', amount: 1200 },
];

const categories = [
  { name: 'Groceries', percentage: 20, spent: 583, budget: 610, color: '#6366f1' },
  { name: 'Transportation', percentage: 18, spent: 216, budget: 430, color: '#f59e0b' },
  { name: 'Housing', percentage: 16, spent: 362, budget: 750, color: '#10b981' },
  { name: 'Personal', percentage: 14, spent: 280, budget: 400, color: '#ec4899' },
];

function StatCard({ label, value, change, changeType }: { label: string; value: string; change: string; changeType: 'positive' | 'negative' }) {
  return (
    <YStack
      backgroundColor="white"
      padding="$3"
      borderRadius="$4"
      minWidth={(width - 60) / 2}
      gap="$1"
      shadowColor="rgba(0,0,0,0.08)"
      shadowOffset={{ width: 0, height: 2 }}
      shadowRadius={8}
      elevation={3}
    >
      <BodyText size="sm" color="$neutral500">{label}</BodyText>
      <Heading level={3}>{value}</Heading>
      <BodyText size="xs" color={changeType === 'positive' ? '#10b981' : '#ef4444'}>
        {change} from last month
      </BodyText>
    </YStack>
  );
}

function TransactionItem({ icon, title, category, amount }: { icon: string; title: string; category: string; amount: number }) {
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
          <BodyText size="sm" color="$neutral500">{category}</BodyText>
        </YStack>
      </XStack>
      <BodyText fontWeight="600" color={isIncome ? '#10b981' : '$color'}>
        {isIncome ? '+' : ''}{amount < 0 ? `-$${Math.abs(amount)}` : `$${amount}`}
      </BodyText>
    </XStack>
  );
}

function CategoryItem({ name, percentage, spent, budget, color }: { name: string; percentage: number; spent: number; budget: number; color: string }) {
  const progress = (spent / budget) * 100;

  return (
    <YStack gap="$2">
      <XStack justifyContent="space-between" alignItems="center">
        <XStack gap="$2" alignItems="center">
          <YStack width={12} height={12} borderRadius={6} backgroundColor={color} />
          <BodyText fontWeight="500">{percentage}% {name}</BodyText>
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

export default function DashboardScreen() {
  const { user } = useAuth();
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

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
          {/* Top Bar */}
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
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
                  {user?.name?.charAt(0) || 'D'}
                </BodyText>
              </YStack>
              <YStack>
                <BodyText size="sm" color="rgba(255,255,255,0.7)">My Budget</BodyText>
                <BodyText color="white" fontWeight="500">{currentMonth}</BodyText>
              </YStack>
            </XStack>
            <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
          </XStack>

          {/* Balance */}
          <YStack alignItems="center" gap="$1" paddingVertical="$4">
            <BodyText color="rgba(255,255,255,0.7)">Funds available to budget</BodyText>
            <Heading level={1} color="white" fontSize={48}>$450</Heading>
          </YStack>
        </LinearGradient>

        {/* Stats Cards */}
        <XStack
          paddingHorizontal="$4"
          marginTop={-40}
          gap="$3"
          justifyContent="center"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </XStack>

        {/* Budget Overview */}
        <YStack padding="$4" gap="$4">
          <Card padded backgroundColor="white">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <Heading level={4}>Budget overview</Heading>
              <ChevronRight size={20} color="#94a3b8" />
            </XStack>
            <XStack justifyContent="space-between">
              <YStack alignItems="center">
                <BodyText size="sm" color="$neutral500">Budgeted</BodyText>
                <Heading level={4}>$3,500</Heading>
              </YStack>
              <YStack alignItems="center">
                <BodyText size="sm" color="$neutral500">Spent</BodyText>
                <Heading level={4}>$1,400</Heading>
              </YStack>
              <YStack alignItems="center">
                <BodyText size="sm" color="$neutral500">Left</BodyText>
                <Heading level={4} color="#10b981">$2,100</Heading>
              </YStack>
            </XStack>
            <XStack marginTop="$3" padding="$3" backgroundColor="#ecfdf5" borderRadius="$3" alignItems="center" gap="$2">
              <BodyText color="#059669">✓</BodyText>
              <BodyText size="sm" color="#059669">You are on track!</BodyText>
            </XStack>
          </Card>

          {/* Latest Transactions */}
          <Card padded backgroundColor="white">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <Heading level={4}>Latest transactions</Heading>
              <BodyText size="sm" color="#6366f1" fontWeight="500">Show all</BodyText>
            </XStack>
            <YStack gap="$2">
              {transactions.map((tx) => (
                <TransactionItem key={tx.id} {...tx} />
              ))}
            </YStack>
          </Card>

          {/* Spending by Category */}
          <Card padded backgroundColor="white">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
              <Heading level={4}>Spending trends</Heading>
              <BodyText size="xs" color="$neutral500">This month</BodyText>
            </XStack>
            <YStack gap="$4">
              {categories.map((cat) => (
                <CategoryItem key={cat.name} {...cat} />
              ))}
            </YStack>
          </Card>
        </YStack>

        {/* Bottom padding for tab bar */}
        <YStack height={20} />
      </ScrollView>
    </SafeAreaView>
  );
}
