import React from 'react';
import { XStack, YStack, Text, Checkbox } from 'tamagui';
import { ChevronUp, ChevronDown, ChevronsUpDown } from '@tamagui/lucide-icons';
import type { DataGridColumn, SortState } from '@app/types';

interface DataGridHeaderProps<T> {
  columns: DataGridColumn<T>[];
  sortState: SortState;
  onSortChange?: (column: string) => void;
  selectable?: boolean;
  allSelected?: boolean;
  someSelected?: boolean;
  onSelectAll?: () => void;
  hasActions?: boolean;
  compact?: boolean;
}

export function DataGridHeader<T>({
  columns,
  sortState,
  onSortChange,
  selectable,
  allSelected,
  someSelected,
  onSelectAll,
  hasActions,
  compact,
}: DataGridHeaderProps<T>) {
  const padding = compact ? '$2' : '$3';

  return (
    <XStack
      backgroundColor="$gray3"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
    >
      {/* Selection checkbox */}
      {selectable && (
        <YStack
          width={50}
          padding={padding}
          alignItems="center"
          justifyContent="center"
          borderRightWidth={1}
          borderRightColor="$borderColor"
        >
          <Checkbox
            checked={allSelected}
            onCheckedChange={onSelectAll}
            size="$3"
          >
            <Checkbox.Indicator>
              <Text>{someSelected ? '−' : '✓'}</Text>
            </Checkbox.Indicator>
          </Checkbox>
        </YStack>
      )}

      {/* Column headers */}
      {columns.map((column) => {
        const isSortable = column.sortable !== false && onSortChange;
        const isSorted = sortState.column === column.key;
        const sortDirection = isSorted ? sortState.direction : null;

        return (
          <XStack
            key={String(column.key)}
            flex={column.width ? undefined : 1}
            width={column.width}
            minWidth={column.minWidth || 100}
            padding={padding}
            alignItems="center"
            justifyContent={
              column.align === 'center'
                ? 'center'
                : column.align === 'right'
                ? 'flex-end'
                : 'flex-start'
            }
            borderRightWidth={1}
            borderRightColor="$borderColor"
            cursor={isSortable ? 'pointer' : 'default'}
            hoverStyle={isSortable ? { backgroundColor: '$gray4' } : undefined}
            pressStyle={isSortable ? { backgroundColor: '$gray5' } : undefined}
            onPress={isSortable ? () => onSortChange(String(column.key)) : undefined}
            gap="$2"
          >
            <Text
              fontWeight="600"
              fontSize="$3"
              color="$gray11"
              numberOfLines={1}
            >
              {column.title}
            </Text>
            {isSortable && (
              <YStack>
                {sortDirection === 'asc' ? (
                  <ChevronUp size={16} color="$blue10" />
                ) : sortDirection === 'desc' ? (
                  <ChevronDown size={16} color="$blue10" />
                ) : (
                  <ChevronsUpDown size={16} color="$gray8" />
                )}
              </YStack>
            )}
          </XStack>
        );
      })}

      {/* Actions column header */}
      {hasActions && (
        <YStack
          width={120}
          padding={padding}
          alignItems="center"
          justifyContent="center"
        >
          <Text fontWeight="600" fontSize="$3" color="$gray11">
            Actions
          </Text>
        </YStack>
      )}
    </XStack>
  );
}
