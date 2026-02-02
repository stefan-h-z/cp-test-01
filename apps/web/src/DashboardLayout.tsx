import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { XStack, YStack, BodyText } from '@app/ui';
import { useAuth } from '@app/shared';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  activeIcon: string;
  path: string;
}

const tabs: TabItem[] = [
  { id: 'activity', label: 'Activity', icon: '📊', activeIcon: '📊', path: '/dashboard' },
  { id: 'budget', label: 'Budget', icon: '📋', activeIcon: '📋', path: '/budget' },
  { id: 'transactions', label: 'Transactions', icon: '📝', activeIcon: '📝', path: '/transactions' },
  { id: 'accounts', label: 'Accounts', icon: '💳', activeIcon: '💳', path: '/accounts' },
];

function TabBarIcon({ name, active }: { name: string; active: boolean }) {
  const icons: Record<string, { default: JSX.Element; active: JSX.Element }> = {
    activity: {
      default: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      active: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
    budget: {
      default: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      active: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    transactions: {
      default: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
      active: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    accounts: {
      default: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
      active: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
  };

  const icon = icons[name];
  if (!icon) return null;

  return active ? icon.active : icon.default;
}

function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <XStack
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      backgroundColor="white"
      borderTopWidth={1}
      borderTopColor="$neutral200"
      paddingBottom="$2"
      paddingTop="$2"
      justifyContent="space-around"
      alignItems="center"
      zIndex={100}
      style={{
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
      }}
    >
      {tabs.slice(0, 2).map((tab) => (
        <YStack
          key={tab.id}
          alignItems="center"
          gap="$1"
          padding="$2"
          opacity={isActive(tab.path) ? 1 : 0.6}
          cursor="pointer"
          hoverStyle={{ opacity: 0.8 }}
          onPress={() => navigate(tab.path)}
        >
          <YStack color={isActive(tab.path) ? '$primary500' : '$neutral500'}>
            <TabBarIcon name={tab.id} active={isActive(tab.path)} />
          </YStack>
          <BodyText
            size="xs"
            color={isActive(tab.path) ? '$primary500' : '$neutral500'}
            fontWeight={isActive(tab.path) ? '600' : '400'}
          >
            {tab.label}
          </BodyText>
        </YStack>
      ))}

      {/* FAB */}
      <YStack
        width={56}
        height={56}
        borderRadius="$full"
        alignItems="center"
        justifyContent="center"
        marginTop="$-6"
        cursor="pointer"
        hoverStyle={{ transform: [{ scale: 1.05 }] }}
        pressStyle={{ transform: [{ scale: 0.95 }] }}
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
        }}
        onPress={() => navigate('/add')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </YStack>

      {tabs.slice(2).map((tab) => (
        <YStack
          key={tab.id}
          alignItems="center"
          gap="$1"
          padding="$2"
          opacity={isActive(tab.path) ? 1 : 0.6}
          cursor="pointer"
          hoverStyle={{ opacity: 0.8 }}
          onPress={() => navigate(tab.path)}
        >
          <YStack color={isActive(tab.path) ? '$primary500' : '$neutral500'}>
            <TabBarIcon name={tab.id} active={isActive(tab.path)} />
          </YStack>
          <BodyText
            size="xs"
            color={isActive(tab.path) ? '$primary500' : '$neutral500'}
            fontWeight={isActive(tab.path) ? '600' : '400'}
          >
            {tab.label}
          </BodyText>
        </YStack>
      ))}
    </XStack>
  );
}

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <YStack flex={1} minHeight="100vh" backgroundColor="$neutral100">
      {/* Main Content with padding for bottom tab */}
      <YStack flex={1} paddingBottom={80}>
        <Outlet />
      </YStack>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </YStack>
  );
}
