import {
  Activity,
  Calendar,
  List,
  CreditCard,
  Plus,
  Settings,
  QrCode,
} from '@tamagui/lucide-icons';
import React from 'react';

const IconComponents: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Activity,
  Calendar,
  List,
  CreditCard,
  Plus,
  Settings,
  QrCode,
};

export function getIconComponent(iconName: string | undefined, fallback = Activity) {
  if (!iconName) return fallback;
  return IconComponents[iconName] || fallback;
}

export function getIcon(
  iconName: string | undefined,
  color: string,
  size: number = 20
): React.ReactNode {
  if (!iconName) return null;
  const IconComponent = IconComponents[iconName];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} />;
}
