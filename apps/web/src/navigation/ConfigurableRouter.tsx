import { useRemoteNavigation, useComponentRegistry } from '@app/shared';
import type { RouteDefinition } from '@app/types';
import { YStack, Heading, BodyText } from '@app/ui';
import React, { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RouteWrapper } from './RouteWrapper';

/**
 * Placeholder screen for screens not yet registered
 */
function PlaceholderScreen({ title }: { title: string }) {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" padding="$6">
      <Heading level={2}>{title}</Heading>
      <BodyText color="$neutral500" marginTop="$2">
        Coming soon...
      </BodyText>
    </YStack>
  );
}

/**
 * Renders a screen component from the registry, with fallback to placeholder
 */
function ScreenRenderer({ route }: { route: RouteDefinition }) {
  const registry = useComponentRegistry();

  // Try to resolve the screen component
  const ScreenComponent = registry.getScreen(route.screen);

  if (!ScreenComponent) {
    const title = typeof route.title === 'string' ? route.title : route.title.defaultValue || route.id;
    return <PlaceholderScreen title={title} />;
  }

  return <ScreenComponent />;
}

/**
 * Renders a route element, optionally wrapped in a layout
 */
function RouteElement({ route }: { route: RouteDefinition }) {
  const registry = useComponentRegistry();

  const screen = (
    <RouteWrapper route={route}>
      <ScreenRenderer route={route} />
    </RouteWrapper>
  );

  // If route has a layout, wrap in layout component
  if (route.layout) {
    const LayoutComponent = registry.getLayout(route.layout);
    if (LayoutComponent) {
      return <LayoutComponent>{screen}</LayoutComponent>;
    }
  }

  return screen;
}

interface ConfigurableRouterProps {
  /** Default layout to use for routes without a specified layout */
  defaultLayout?: React.ComponentType<{ children: React.ReactNode }>;
  /** Override fallback path (defaults to config.navigation.fallback.notFound) */
  fallbackPath?: string;
}

/**
 * Generates React Router routes from the remote config.
 * Routes are dynamically created based on the navigation configuration.
 */
export function ConfigurableRouter({
  defaultLayout: DefaultLayout,
  fallbackPath,
}: ConfigurableRouterProps) {
  const { routes, fallback } = useRemoteNavigation();
  const registry = useComponentRegistry();

  // Group routes by layout
  const routeGroups = useMemo(() => {
    const groups: Map<string | undefined, RouteDefinition[]> = new Map();

    routes.forEach((route) => {
      const layoutKey = route.layout;
      const existing = groups.get(layoutKey);
      if (existing) {
        existing.push(route);
      } else {
        groups.set(layoutKey, [route]);
      }
    });

    return groups;
  }, [routes]);

  // Render routes, grouping by layout
  const renderedRoutes = useMemo(() => {
    const result: React.ReactNode[] = [];

    routeGroups.forEach((groupRoutes, layoutKey) => {
      // Get layout component if specified
      const LayoutComponent = layoutKey
        ? registry.getLayout(layoutKey)
        : DefaultLayout;

      if (LayoutComponent) {
        // Wrap routes in layout outlet
        result.push(
          <Route key={`layout-${layoutKey || 'default'}`} element={<LayoutComponent><React.Fragment /></LayoutComponent>}>
            {groupRoutes.map((route) => (
              <Route
                key={route.id}
                path={route.path}
                element={
                  <RouteWrapper route={route}>
                    <ScreenRenderer route={route} />
                  </RouteWrapper>
                }
              />
            ))}
          </Route>
        );
      } else {
        // Routes without layout
        groupRoutes.forEach((route) => {
          result.push(
            <Route
              key={route.id}
              path={route.path}
              element={<RouteElement route={route} />}
            />
          );
        });
      }
    });

    return result;
  }, [routeGroups, registry, DefaultLayout]);

  const notFoundPath = fallbackPath || fallback?.notFound || '/';

  return (
    <Routes>
      {renderedRoutes}
      {/* Fallback route */}
      <Route path="*" element={<Navigate to={notFoundPath} replace />} />
    </Routes>
  );
}

/**
 * Simple router that renders routes individually (without layout grouping).
 * Use this if you handle layouts separately or don't need layout grouping.
 */
export function SimpleConfigurableRouter() {
  const { routes, fallback } = useRemoteNavigation();

  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.id}
          path={route.path}
          element={<RouteElement route={route} />}
        />
      ))}
      <Route path="*" element={<Navigate to={fallback?.notFound || '/'} replace />} />
    </Routes>
  );
}
