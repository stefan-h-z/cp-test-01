import { YStack, XStack, Heading, BodyText, Card } from '@app/ui';
import { useAuth } from '@app/shared';

// Demo data
const stats = [
  { label: 'Balance', value: '$2,450', change: '+12%', changeType: 'positive' as const },
  { label: 'Saving', value: '$565', change: '+10%', changeType: 'positive' as const },
  { label: 'Debts', value: '$597', change: '-0.2%', changeType: 'negative' as const },
];

const transactions = [
  { id: '1', icon: '🥬', title: 'Fruits & Vegetables', category: 'Groceries', amount: -100, type: 'expense' as const },
  { id: '2', icon: '💰', title: 'From Bank to Cash', category: 'Transfer', amount: 700, type: 'income' as const },
  { id: '3', icon: '🍔', title: 'Burger', category: 'Groceries', amount: -5.45, type: 'expense' as const },
  { id: '4', icon: '💰', title: 'From Bank to Cash', category: 'Transfer', amount: 1200, type: 'income' as const },
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
      padding="$4"
      borderRadius="$4"
      minWidth={140}
      gap="$2"
      shadowColor="rgba(0,0,0,0.08)"
      shadowOffset={{ width: 0, height: 2 }}
      shadowRadius={8}
      $gtMd={{ minWidth: 180 }}
    >
      <BodyText size="sm" color="$neutral500">{label}</BodyText>
      <Heading level={3}>{value}</Heading>
      <BodyText size="xs" color={changeType === 'positive' ? '$success500' : '$error500'}>
        {change} from last month
      </BodyText>
    </YStack>
  );
}

function TransactionItem({ icon, title, category, amount, type }: { icon: string; title: string; category: string; amount: number; type: 'income' | 'expense' }) {
  return (
    <XStack
      backgroundColor="white"
      padding="$3"
      borderRadius="$3"
      alignItems="center"
      justifyContent="space-between"
    >
      <XStack gap="$3" alignItems="center">
        <YStack
          width={44}
          height={44}
          borderRadius="$full"
          backgroundColor="$neutral100"
          alignItems="center"
          justifyContent="center"
        >
          <BodyText>{icon}</BodyText>
        </YStack>
        <YStack>
          <BodyText fontWeight="600">{title}</BodyText>
          <BodyText size="sm" color="$neutral500">{category}</BodyText>
        </YStack>
      </XStack>
      <BodyText fontWeight="600" color={type === 'income' ? '$success500' : '$color'}>
        {type === 'income' ? '+' : ''}{amount < 0 ? `-$${Math.abs(amount)}` : `$${amount}`}
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
          <YStack width={12} height={12} borderRadius="$full" backgroundColor={color} />
          <BodyText fontWeight="500">{percentage}% {name}</BodyText>
        </XStack>
      </XStack>
      <YStack height={6} backgroundColor="$neutral200" borderRadius="$full" overflow="hidden">
        <YStack
          height="100%"
          width={`${Math.min(progress, 100)}%`}
          backgroundColor={color}
          borderRadius="$full"
        />
      </YStack>
      <BodyText size="xs" color="$neutral500">
        Spent ${spent} of ${budget}
      </BodyText>
    </YStack>
  );
}

function DonutChart() {
  // Simple CSS donut chart representation
  return (
    <YStack alignItems="center" justifyContent="center" position="relative" width={200} height={200}>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="70" fill="none" stroke="#e2e8f0" strokeWidth="20" />
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="#6366f1"
          strokeWidth="20"
          strokeDasharray="110 330"
          strokeDashoffset="0"
          transform="rotate(-90 100 100)"
        />
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="20"
          strokeDasharray="79 330"
          strokeDashoffset="-110"
          transform="rotate(-90 100 100)"
        />
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="#10b981"
          strokeWidth="20"
          strokeDasharray="70 330"
          strokeDashoffset="-189"
          transform="rotate(-90 100 100)"
        />
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="#ec4899"
          strokeWidth="20"
          strokeDasharray="62 330"
          strokeDashoffset="-259"
          transform="rotate(-90 100 100)"
        />
      </svg>
      <YStack position="absolute" alignItems="center">
        <Heading level={2}>$2,570</Heading>
        <BodyText size="sm" color="$neutral500">Total spent</BodyText>
      </YStack>
    </YStack>
  );
}

function SpendingChart() {
  // Simple line chart visualization
  const points = [40, 65, 45, 80, 55, 90, 70];
  const maxY = 100;
  const width = 300;
  const height = 120;
  const padding = 10;

  const pathD = points.map((point, i) => {
    const x = padding + (i / (points.length - 1)) * (width - 2 * padding);
    const y = height - padding - (point / maxY) * (height - 2 * padding);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <YStack>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <path
          d={pathD}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, i) => {
          const x = padding + (i / (points.length - 1)) * (width - 2 * padding);
          const y = height - padding - (point / maxY) * (height - 2 * padding);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="white"
              stroke="#6366f1"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <XStack justifyContent="space-between" paddingHorizontal="$2" marginTop="$2">
        {['Feb 1', 'Feb 8', 'Feb 15', 'Feb 22'].map((label) => (
          <BodyText key={label} size="xs" color="$neutral400">{label}</BodyText>
        ))}
      </XStack>
    </YStack>
  );
}

export function DashboardScreen() {
  const { user } = useAuth();
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <YStack flex={1} backgroundColor="$neutral100">
      {/* Header */}
      <YStack
        paddingHorizontal="$4"
        paddingTop="$6"
        paddingBottom="$8"
        borderBottomLeftRadius="$6"
        borderBottomRightRadius="$6"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
        }}
      >
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
          <XStack gap="$3" alignItems="center">
            <YStack
              width={44}
              height={44}
              borderRadius="$full"
              backgroundColor="rgba(255,255,255,0.2)"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <BodyText color="white" fontWeight="600">
                  {user?.name?.charAt(0) || 'D'}
                </BodyText>
              )}
            </YStack>
            <YStack>
              <BodyText size="sm" color="rgba(255,255,255,0.7)">Welcome back</BodyText>
              <Heading level={4} color="white">{user?.name || 'Developer'}</Heading>
            </YStack>
          </XStack>
          <XStack gap="$2" alignItems="center">
            <BodyText color="white" fontWeight="500">{currentMonth}</BodyText>
          </XStack>
        </XStack>

        {/* Balance Card */}
        <YStack alignItems="center" gap="$2">
          <BodyText color="rgba(255,255,255,0.7)">Funds available to budget</BodyText>
          <Heading level={1} color="white">$2,450</Heading>
        </YStack>
      </YStack>

      {/* Stats Cards */}
      <XStack
        paddingHorizontal="$4"
        marginTop="$-6"
        gap="$3"
        flexWrap="wrap"
        justifyContent="center"
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </XStack>

      {/* Content Grid */}
      <YStack flex={1} padding="$4" gap="$4" $gtMd={{ flexDirection: 'row' }}>
        {/* Left Column */}
        <YStack flex={1} gap="$4">
          {/* Spending Overview */}
          <Card padded>
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
              <YStack>
                <Heading level={4}>Daily spending overview</Heading>
                <BodyText size="sm" color="$neutral500">Trend of Spending</BodyText>
              </YStack>
            </XStack>
            <YStack alignItems="center">
              <SpendingChart />
            </YStack>
            <XStack marginTop="$3" padding="$3" backgroundColor="$neutral50" borderRadius="$3">
              <BodyText size="sm">
                <BodyText size="sm" color="$primary500" fontWeight="600">$89</BodyText> spent in 31 transactions
              </BodyText>
            </XStack>
          </Card>

          {/* Latest Transactions */}
          <Card padded>
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
              <Heading level={4}>Latest transactions</Heading>
              <BodyText size="sm" color="$primary500" fontWeight="500">Show all</BodyText>
            </XStack>
            <YStack gap="$2">
              {transactions.map((tx) => (
                <TransactionItem key={tx.id} {...tx} />
              ))}
            </YStack>
          </Card>
        </YStack>

        {/* Right Column */}
        <YStack flex={1} gap="$4" $gtMd={{ maxWidth: 400 }}>
          {/* Spending Trends */}
          <Card padded>
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
              <Heading level={4}>Spending trends</Heading>
              <BodyText size="sm" color="$neutral500">Aug 1 - Aug 22, 2023</BodyText>
            </XStack>

            {/* Tabs */}
            <XStack gap="$2" marginBottom="$4">
              <YStack
                paddingHorizontal="$4"
                paddingVertical="$2"
                backgroundColor="$primary500"
                borderRadius="$full"
              >
                <BodyText size="sm" color="white" fontWeight="500">Categories</BodyText>
              </YStack>
              <YStack
                paddingHorizontal="$4"
                paddingVertical="$2"
                backgroundColor="$neutral100"
                borderRadius="$full"
              >
                <BodyText size="sm" color="$neutral600" fontWeight="500">Nature</BodyText>
              </YStack>
            </XStack>

            {/* Donut Chart */}
            <YStack alignItems="center" marginBottom="$4">
              <DonutChart />
            </YStack>

            {/* Categories */}
            <YStack gap="$4">
              <BodyText size="sm" color="$neutral500" fontWeight="500">All categories</BodyText>
              {categories.map((cat) => (
                <CategoryItem key={cat.name} {...cat} />
              ))}
            </YStack>
          </Card>

          {/* Budget Overview */}
          <Card padded>
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
              <Heading level={4}>Budget overview</Heading>
            </XStack>
            <XStack justifyContent="space-between">
              <YStack>
                <BodyText size="sm" color="$neutral500">Budgeted</BodyText>
                <Heading level={4}>$3,500</Heading>
              </YStack>
              <YStack>
                <BodyText size="sm" color="$neutral500">Spent</BodyText>
                <Heading level={4}>$1,400</Heading>
              </YStack>
              <YStack>
                <BodyText size="sm" color="$neutral500">Left</BodyText>
                <Heading level={4} color="$success500">$2,100</Heading>
              </YStack>
            </XStack>
            <XStack marginTop="$3" padding="$3" backgroundColor="$success50" borderRadius="$3" alignItems="center" gap="$2">
              <BodyText color="$success600">✓</BodyText>
              <BodyText size="sm" color="$success600">You are on track!</BodyText>
            </XStack>
          </Card>
        </YStack>
      </YStack>
    </YStack>
  );
}
