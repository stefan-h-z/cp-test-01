import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { XStack, YStack, BodyText, Heading, Button, Switch } from '@app/ui';
import { useAuth, useThemeMode } from '@app/shared';

// Menu icon component
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

// Close icon component
function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// Settings icon component
function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// QR icon component
function QRIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

// Sidebar Menu Component
function SidebarMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { resolvedMode, toggleMode } = useThemeMode();
  const isDarkMode = resolvedMode === 'dark';

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <YStack
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor="rgba(0, 0, 0, 0.5)"
        zIndex={200}
        onPress={onClose}
        style={{ cursor: 'pointer' }}
      />

      {/* Sidebar */}
      <YStack
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        width={300}
        backgroundColor={isDarkMode ? '#1a1a1a' : 'white'}
        zIndex={300}
        padding="$4"
        style={{
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
          animation: 'slideIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$6">
          <Heading level={4} color={isDarkMode ? 'white' : undefined}>Menu</Heading>
          <YStack
            padding="$2"
            borderRadius="$2"
            cursor="pointer"
            hoverStyle={{ backgroundColor: isDarkMode ? '$neutral800' : '$neutral100' }}
            onPress={onClose}
            color={isDarkMode ? 'white' : undefined}
          >
            <CloseIcon />
          </YStack>
        </XStack>

        {/* User Info */}
        {user && (
          <YStack
            backgroundColor={isDarkMode ? '$neutral800' : '$neutral100'}
            padding="$4"
            borderRadius="$4"
            marginBottom="$4"
          >
            <BodyText fontWeight="600" color={isDarkMode ? 'white' : undefined}>{user.name}</BodyText>
            <BodyText size="sm" color={isDarkMode ? '$neutral400' : '$neutral500'}>{user.email}</BodyText>
          </YStack>
        )}

        {/* Dark Mode Toggle */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          padding="$3"
          backgroundColor={isDarkMode ? '$neutral800' : '$neutral100'}
          borderRadius="$3"
          marginBottom="$4"
        >
          <BodyText color={isDarkMode ? 'white' : undefined}>Dark Mode</BodyText>
          <Switch
            checked={isDarkMode}
            onCheckedChange={() => toggleMode()}
            size="$3"
          >
            <Switch.Thumb animation="quick" />
          </Switch>
        </XStack>

        {/* Menu Items */}
        <YStack gap="$2" flex={1}>
          <XStack
            padding="$3"
            borderRadius="$3"
            cursor="pointer"
            hoverStyle={{ backgroundColor: isDarkMode ? '$neutral800' : '$neutral100' }}
            alignItems="center"
            gap="$3"
            onPress={() => handleNavigation('/qr-scanner')}
            color={isDarkMode ? 'white' : undefined}
          >
            <QRIcon />
            <BodyText color={isDarkMode ? 'white' : undefined}>QR Scanner</BodyText>
          </XStack>

          <XStack
            padding="$3"
            borderRadius="$3"
            cursor="pointer"
            hoverStyle={{ backgroundColor: isDarkMode ? '$neutral800' : '$neutral100' }}
            alignItems="center"
            gap="$3"
            onPress={() => handleNavigation('/settings')}
            color={isDarkMode ? 'white' : undefined}
          >
            <SettingsIcon />
            <BodyText color={isDarkMode ? 'white' : undefined}>Settings</BodyText>
          </XStack>
        </YStack>

        {/* Logout Button */}
        {user && (
          <Button
            variant="outline"
            onPress={handleLogout}
            marginTop="$4"
          >
            Sign Out
          </Button>
        )}
      </YStack>
    </>
  );
}

// Header Component
function Header({ onMenuOpen }: { onMenuOpen: () => void }) {
  const { resolvedMode } = useThemeMode();
  const isDarkMode = resolvedMode === 'dark';

  return (
    <XStack
      backgroundColor={isDarkMode ? '#1a1a1a' : 'white'}
      paddingHorizontal="$4"
      paddingVertical="$3"
      alignItems="center"
      justifyContent="space-between"
      borderBottomWidth={1}
      borderBottomColor={isDarkMode ? '$neutral700' : '$neutral200'}
    >
      <Heading level={4} color={isDarkMode ? 'white' : undefined}>FinanceApp</Heading>
      <YStack
        padding="$2"
        borderRadius="$2"
        cursor="pointer"
        hoverStyle={{ backgroundColor: isDarkMode ? '$neutral800' : '$neutral100' }}
        onPress={onMenuOpen}
        color={isDarkMode ? 'white' : undefined}
      >
        <MenuIcon />
      </YStack>
    </XStack>
  );
}

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
  const [menuOpen, setMenuOpen] = useState(false);
  const { resolvedMode } = useThemeMode();
  const isDarkMode = resolvedMode === 'dark';

  return (
    <YStack flex={1} minHeight="100vh" backgroundColor={isDarkMode ? '#121212' : '$neutral100'}>
      {/* Header with Menu */}
      <Header onMenuOpen={() => setMenuOpen(true)} />

      {/* Sidebar Menu */}
      <SidebarMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main Content with padding for bottom tab */}
      <YStack flex={1} paddingBottom={80}>
        <Outlet />
      </YStack>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </YStack>
  );
}
