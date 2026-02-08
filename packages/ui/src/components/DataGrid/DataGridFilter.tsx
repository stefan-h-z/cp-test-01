import type { DataGridColumn, FilterState } from '@app/types';
import { Search, Filter, X } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { XStack, YStack, Input, Text, Popover } from 'tamagui';
import { Button } from '../Button';

interface DataGridFilterProps<T> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  columns: DataGridColumn<T>[];
  columnFilters: FilterState;
  onColumnFilterChange: (filters: FilterState) => void;
}

export function DataGridFilter<T>({
  value,
  onChange,
  placeholder = 'Search...',
  columns,
  columnFilters,
  onColumnFilterChange,
}: DataGridFilterProps<T>) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filterableColumns = columns.filter((col) => col.filterable !== false);
  const activeFilterCount = Object.values(columnFilters).filter(Boolean).length;

  const handleColumnFilterChange = (key: string, filterValue: string) => {
    onColumnFilterChange({
      ...columnFilters,
      [key]: filterValue,
    });
  };

  const clearAllFilters = () => {
    onChange('');
    onColumnFilterChange({});
  };

  const hasActiveFilters = value || activeFilterCount > 0;

  return (
    <YStack padding="$3" borderBottomWidth={1} borderBottomColor="$borderColor" gap="$3">
      <XStack gap="$2" alignItems="center">
        {/* Global search */}
        <XStack flex={1} position="relative">
          <YStack
            position="absolute"
            left="$3"
            top={0}
            bottom={0}
            justifyContent="center"
            zIndex={1}
          >
            <Search size={18} color="$gray10" />
          </YStack>
          <Input
            flex={1}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            paddingLeft="$8"
            size="$3"
          />
          {value && (
            <YStack position="absolute" right="$2" top={0} bottom={0} justifyContent="center">
              <Button size="$2" variant="ghost" onPress={() => onChange('')} padding="$1" circular>
                <X size={16} color="$gray10" />
              </Button>
            </YStack>
          )}
        </XStack>

        {/* Advanced filter toggle */}
        {filterableColumns.length > 0 && (
          <Popover open={showAdvanced} onOpenChange={setShowAdvanced}>
            <Popover.Trigger asChild>
              <Button
                size="$3"
                variant={activeFilterCount > 0 ? 'primary' : 'ghost'}
                icon={<Filter size={18} />}
              >
                {activeFilterCount > 0 && (
                  <Text fontSize="$2" marginLeft="$1">
                    ({activeFilterCount})
                  </Text>
                )}
              </Button>
            </Popover.Trigger>

            <Popover.Content
              padding="$3"
              borderWidth={1}
              borderColor="$borderColor"
              backgroundColor="$background"
              elevate
              minWidth={300}
            >
              <YStack gap="$3">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontWeight="600" fontSize="$4">
                    Column Filters
                  </Text>
                  {activeFilterCount > 0 && (
                    <Button size="$2" variant="ghost" onPress={() => onColumnFilterChange({})}>
                      <Text color="$red10" fontSize="$2">
                        Clear all
                      </Text>
                    </Button>
                  )}
                </XStack>

                <YStack gap="$2">
                  {filterableColumns.map((column) => (
                    <YStack key={String(column.key)} gap="$1">
                      <Text fontSize="$2" color="$gray11">
                        {column.title}
                      </Text>
                      <Input
                        size="$3"
                        value={columnFilters[String(column.key)] || ''}
                        onChangeText={(val) => handleColumnFilterChange(String(column.key), val)}
                        placeholder={`Filter ${column.title}...`}
                      />
                    </YStack>
                  ))}
                </YStack>

                <Button size="$3" variant="primary" onPress={() => setShowAdvanced(false)}>
                  Apply Filters
                </Button>
              </YStack>
            </Popover.Content>
          </Popover>
        )}

        {/* Clear all button */}
        {hasActiveFilters && (
          <Button size="$3" variant="ghost" onPress={clearAllFilters} icon={<X size={18} />}>
            <Text fontSize="$2">Clear</Text>
          </Button>
        )}
      </XStack>

      {/* Active filter tags */}
      {activeFilterCount > 0 && (
        <XStack flexWrap="wrap" gap="$2">
          {Object.entries(columnFilters).map(([key, filterValue]) => {
            if (!filterValue) return null;
            const column = columns.find((col) => String(col.key) === key);
            return (
              <XStack
                key={key}
                backgroundColor="$blue2"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
                alignItems="center"
                gap="$1"
              >
                <Text fontSize="$2" color="$blue11">
                  {column?.title || key}: {filterValue}
                </Text>
                <Button
                  size="$1"
                  variant="ghost"
                  onPress={() => handleColumnFilterChange(key, '')}
                  padding="$0"
                  circular
                >
                  <X size={12} color="$blue11" />
                </Button>
              </XStack>
            );
          })}
        </XStack>
      )}
    </YStack>
  );
}
