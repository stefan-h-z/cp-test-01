import { Outlet, Link, useLocation } from 'react-router-dom';
import { XStack, YStack, Container, Button, Heading } from '@app/ui';
import { useAppConfig } from '@app/shared';

export function Layout() {
  const config = useAppConfig();
  const location = useLocation();

  const navItems = config.navigation.screens.filter((s) => s.showInNav);

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
