import type { DataGridColumn, DataGridAction } from '@app/types';
import { Eye, Pencil, Trash2 } from '@tamagui/lucide-icons';
import React from 'react';
import { XStack, YStack, Text, Checkbox } from 'tamagui';
import { Button } from '../Button';

interface DataGridRowProps<T> {
  row: T;
  index: number;
  columns: DataGridColumn<T>[];
  actions?: DataGridAction<T>[];
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

// Icon mapping for common actions
const iconMap: Record<string, React.ComponentType<{ size: number; color?: string }>> = {
  view: Eye,
  edit: Pencil,
  delete: Trash2,
  eye: Eye,
  pencil: Pencil,
  trash: Trash2,
};

export function DataGridRow<T>({
  row,
  index,
  columns,
  actions,
  striped,
  hoverable,
  compact,
  selectable,
  isSelected,
  onSelect,
}: DataGridRowProps<T>) {
  const padding = compact ? '$2' : '$3';
  const isEven = index % 2 === 0;

  return (
    <XStack
      backgroundColor={isSelected ? '$blue2' : striped && !isEven ? '$gray2' : '$background'}
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      hoverStyle={hoverable ? { backgroundColor: isSelected ? '$blue3' : '$gray2' } : undefined}
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
          <Checkbox checked={isSelected} onCheckedChange={onSelect} size="$3">
            <Checkbox.Indicator>
              <Text>✓</Text>
            </Checkbox.Indicator>
          </Checkbox>
        </YStack>
      )}

      {/* Data cells */}
      {columns.map((column) => {
        const value = getNestedValue(row, column.key as string);
        const renderedValue = column.render ? column.render(value, row, index) : formatValue(value);

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
          >
            {typeof renderedValue === 'string' || typeof renderedValue === 'number' ? (
              <Text fontSize="$3" numberOfLines={2}>
                {renderedValue}
              </Text>
            ) : (
              renderedValue
            )}
          </XStack>
        );
      })}

      {/* Action buttons */}
      {actions && actions.length > 0 && (
        <XStack width={120} padding={padding} alignItems="center" justifyContent="center" gap="$1">
          {actions.map((action) => {
            // Check visibility
            if (action.isVisible && !action.isVisible(row)) {
              return null;
            }

            const isDisabled = action.isDisabled ? action.isDisabled(row) : false;
            const IconComponent = action.icon ? iconMap[action.icon.toLowerCase()] : null;

            const buttonVariant =
              action.variant === 'destructive'
                ? 'ghost'
                : action.variant === 'primary'
                  ? 'primary'
                  : 'ghost';

            const buttonColor = action.variant === 'destructive' ? '$red10' : undefined;

            return (
              <Button
                key={action.id}
                size="$2"
                variant={buttonVariant}
                disabled={isDisabled}
                onPress={() => action.onPress(row, index)}
                padding="$1"
                circular
                opacity={isDisabled ? 0.5 : 1}
              >
                {IconComponent ? (
                  <IconComponent size={16} color={buttonColor} />
                ) : (
                  <Text fontSize="$1" color={buttonColor}>
                    {action.label}
                  </Text>
                )}
              </Button>
            );
          })}
        </XStack>
      )}
    </XStack>
  );
}

// Helper function to get nested object values
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

// Helper function to format values for display
function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '—';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
