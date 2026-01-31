import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { XStack, YStack, Container, Button, Heading, BodyText, Image } from '@app/ui';
import { useAppConfig, useAuth } from '@app/shared';

export function Layout() {
  const config = useAppConfig();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, authConfig } = useAuth();

  const navItems = config.navigation.screens.filter((s) => s.showInNav);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <YStack flex={1} minHeight="100vh">
      {/* Header */}
      <XStack
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingVertical="$3"
        paddingHorizontal="$4"
        alignItems="center"
        justifyContent="space-between"
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Heading level={4}>{config.name}</Heading>
        </Link>

        <XStack gap="$3" alignItems="center">
          {/* Navigation */}
          <XStack gap="$2">
            {navItems.map((item) => (
              <Link key={item.id} to={`/${item.id === 'home' ? '' : item.id}`} style={{ textDecoration: 'none' }}>
                <Button
                  variant={location.pathname === (item.id === 'home' ? '/' : `/${item.id}`) ? 'primary' : 'ghost'}
                  size="sm"
                >
                  {item.title}
                </Button>
              </Link>
            ))}
          </XStack>

          {/* User info and logout */}
          {authConfig.enabled && isAuthenticated && user && (
            <XStack gap="$3" alignItems="center" borderLeftWidth={1} borderLeftColor="$borderColor" paddingLeft="$3">
              <XStack gap="$2" alignItems="center">
                {user.avatar && (
                  <Image
                    source={{ uri: user.avatar }}
                    width={32}
                    height={32}
                    borderRadius={16}
                  />
                )}
                <YStack>
                  <BodyText size="sm" fontWeight="600">{user.name}</BodyText>
                  <BodyText size="xs" muted>{user.email}</BodyText>
                </YStack>
              </XStack>
              <Button variant="ghost" size="sm" onPress={handleLogout}>
                Sign Out
              </Button>
            </XStack>
          )}
        </XStack>
      </XStack>

      {/* Main Content */}
      <YStack flex={1} backgroundColor="$gray2">
        <Container padded>
          <Outlet />
        </Container>
      </YStack>

      {/* Footer */}
      <XStack
        backgroundColor="$background"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        paddingVertical="$3"
        justifyContent="center"
      >
        <Heading level={5} color="$gray10">
          {config.name} v{config.version}
        </Heading>
      </XStack>
    </YStack>
  );
}
