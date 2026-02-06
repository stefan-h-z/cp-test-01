import { ChevronRight, Home } from '@tamagui/lucide-icons';
import React from 'react';
import { XStack, Text, styled } from 'tamagui';

export interface BreadcrumbItem {
  title: string;
  path: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onItemPress?: (item: BreadcrumbItem) => void;
  showHomeIcon?: boolean;
  separator?: React.ReactNode;
  maxItems?: number;
}

const BreadcrumbContainer = styled(XStack, {
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '$1',
});

const BreadcrumbLink = styled(XStack, {
  alignItems: 'center',
  gap: '$1',
  paddingVertical: '$1',
  paddingHorizontal: '$1',
  borderRadius: '$1',
  cursor: 'pointer',
  hoverStyle: {
    backgroundColor: '$gray3',
  },
  pressStyle: {
    backgroundColor: '$gray4',
  },
});

const BreadcrumbText = styled(Text, {
  fontSize: '$2',
  color: '$gray10',
  variants: {
    isLast: {
      true: {
        color: '$gray12',
        fontWeight: '500',
      },
    },
  } as const,
});

export function Breadcrumbs({
  items,
  onItemPress,
  showHomeIcon = true,
  separator,
  maxItems = 0,
}: BreadcrumbsProps) {
  // Truncate items if maxItems is set
  let displayItems = items;
  let showEllipsis = false;

  if (maxItems > 0 && items.length > maxItems) {
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));
    displayItems = [firstItem, ...lastItems];
    showEllipsis = true;
  }

  const renderSeparator = () => {
    if (separator) {
      return separator;
    }
    return <ChevronRight size={14} color="$gray8" />;
  };

  return (
    <BreadcrumbContainer>
      {displayItems.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === displayItems.length - 1;
        const showEllipsisHere = showEllipsis && index === 1;

        return (
          <React.Fragment key={item.path}>
            {showEllipsisHere && (
              <>
                <Text fontSize="$2" color="$gray8">
                  ...
                </Text>
                {renderSeparator()}
              </>
            )}
            {!isFirst && renderSeparator()}
            <BreadcrumbLink
              onPress={() => !isLast && onItemPress?.(item)}
              opacity={isLast ? 1 : 0.8}
            >
              {isFirst && showHomeIcon && (
                <Home size={14} color={isLast ? '$gray12' : '$gray10'} />
              )}
              <BreadcrumbText isLast={isLast}>{item.title}</BreadcrumbText>
            </BreadcrumbLink>
          </React.Fragment>
        );
      })}
    </BreadcrumbContainer>
  );
}
