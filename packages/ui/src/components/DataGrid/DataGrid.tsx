import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Spinner } from 'tamagui';
import type {
  DataGridProps,
  DataGridColumn,
  SortState,
  FilterState,
  PaginationState,
} from '@app/types';
import { DataGridHeader } from './DataGridHeader';
import { DataGridRow } from './DataGridRow';
import { DataGridPagination } from './DataGridPagination';
import { DataGridFilter } from './DataGridFilter';

export function DataGrid<T extends { id: string | number }>({
  data,
  columns,
  actions,
  // Sorting
  sortable = true,
  sortState: externalSortState,
  onSortChange,
  // Filtering
  filterable = true,
  filterState: externalFilterState,
  onFilterChange,
  filterPlaceholder = 'Search...',
  // Pagination
  pagination = true,
  paginationState: externalPaginationState,
  onPaginationChange,
  pageSizeOptions = [10, 25, 50, 100],
  // Loading & Empty states
  isLoading = false,
  emptyMessage = 'No data available',
  // Selection
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  // Styling
  striped = true,
  hoverable = true,
  compact = false,
}: DataGridProps<T>) {
  // Internal state for uncontrolled mode
  const [internalSortState, setInternalSortState] = useState<SortState>({
    column: null,
    direction: null,
  });
  const [internalFilterState, setInternalFilterState] = useState<FilterState>({});
  const [internalPaginationState, setInternalPaginationState] = useState<PaginationState>({
    page: 1,
    pageSize: pageSizeOptions[0] || 10,
    total: data.length,
  });
  const [globalFilter, setGlobalFilter] = useState('');

  // Use external state if provided, otherwise use internal state
  const sortState = externalSortState ?? internalSortState;
  const filterState = externalFilterState ?? internalFilterState;
  const paginationState = externalPaginationState ?? internalPaginationState;

  // Handle sort change
  const handleSortChange = useCallback(
    (column: string) => {
      const newDirection: SortState['direction'] =
        sortState.column === column
          ? sortState.direction === 'asc'
            ? 'desc'
            : sortState.direction === 'desc'
            ? null
            : 'asc'
          : 'asc';

      const newSortState: SortState = {
        column: newDirection ? column : null,
        direction: newDirection,
      };

      if (onSortChange) {
        onSortChange(newSortState);
      } else {
        setInternalSortState(newSortState);
      }
    },
    [sortState, onSortChange]
  );

  // Handle filter change
  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      if (onFilterChange) {
        onFilterChange(newFilters);
      } else {
        setInternalFilterState(newFilters);
      }
      // Reset to first page when filtering
      if (onPaginationChange) {
        onPaginationChange({ ...paginationState, page: 1 });
      } else {
        setInternalPaginationState((prev) => ({ ...prev, page: 1 }));
      }
    },
    [onFilterChange, onPaginationChange, paginationState]
  );

  // Handle global filter change
  const handleGlobalFilterChange = useCallback(
    (value: string) => {
      setGlobalFilter(value);
      // Reset to first page when filtering
      if (onPaginationChange) {
        onPaginationChange({ ...paginationState, page: 1 });
      } else {
        setInternalPaginationState((prev) => ({ ...prev, page: 1 }));
      }
    },
    [onPaginationChange, paginationState]
  );

  // Handle pagination change
  const handlePaginationChange = useCallback(
    (newPagination: Partial<PaginationState>) => {
      const updatedPagination = { ...paginationState, ...newPagination };
      if (onPaginationChange) {
        onPaginationChange(updatedPagination);
      } else {
        setInternalPaginationState(updatedPagination);
      }
    },
    [paginationState, onPaginationChange]
  );

  // Handle selection
  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;
    const allIds = data.map((row) => row.id);
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    onSelectionChange(allSelected ? [] : allIds);
  }, [data, selectedIds, onSelectionChange]);

  const handleSelectRow = useCallback(
    (id: string | number) => {
      if (!onSelectionChange) return;
      const isSelected = selectedIds.includes(id);
      onSelectionChange(
        isSelected ? selectedIds.filter((selectedId) => selectedId !== id) : [...selectedIds, id]
      );
    },
    [selectedIds, onSelectionChange]
  );

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply global filter
    if (globalFilter) {
      const lowerFilter = globalFilter.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = getNestedValue(row, col.key as string);
          return String(value).toLowerCase().includes(lowerFilter);
        })
      );
    }

    // Apply column filters
    Object.entries(filterState).forEach(([key, value]) => {
      if (value) {
        const lowerValue = value.toLowerCase();
        result = result.filter((row) => {
          const cellValue = getNestedValue(row, key);
          return String(cellValue).toLowerCase().includes(lowerValue);
        });
      }
    });

    // Apply sorting
    if (sortState.column && sortState.direction) {
      result.sort((a, b) => {
        const aValue = getNestedValue(a, sortState.column!);
        const bValue = getNestedValue(b, sortState.column!);

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const comparison = aValue < bValue ? -1 : 1;
        return sortState.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, globalFilter, filterState, sortState, columns]);

  // Apply pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;

    const start = (paginationState.page - 1) * paginationState.pageSize;
    const end = start + paginationState.pageSize;
    return processedData.slice(start, end);
  }, [processedData, pagination, paginationState]);

  // Calculate total for pagination
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / paginationState.pageSize);

  // Check if all visible rows are selected
  const allSelected = paginatedData.length > 0 && paginatedData.every((row) => selectedIds.includes(row.id));
  const someSelected = paginatedData.some((row) => selectedIds.includes(row.id)) && !allSelected;

  return (
    <YStack
      backgroundColor="$background"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
      overflow="hidden"
    >
      {/* Filter Bar */}
      {filterable && (
        <DataGridFilter
          value={globalFilter}
          onChange={handleGlobalFilterChange}
          placeholder={filterPlaceholder}
          columns={columns}
          columnFilters={filterState}
          onColumnFilterChange={handleFilterChange}
        />
      )}

      {/* Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <YStack minWidth="100%">
          {/* Header */}
          <DataGridHeader
            columns={columns}
            sortState={sortState}
            onSortChange={sortable ? handleSortChange : undefined}
            selectable={selectable}
            allSelected={allSelected}
            someSelected={someSelected}
            onSelectAll={handleSelectAll}
            hasActions={!!actions?.length}
            compact={compact}
          />

          {/* Body */}
          {isLoading ? (
            <YStack padding="$6" alignItems="center" justifyContent="center">
              <Spinner size="large" />
            </YStack>
          ) : paginatedData.length === 0 ? (
            <YStack padding="$6" alignItems="center" justifyContent="center">
              <Text color="$gray10">{emptyMessage}</Text>
            </YStack>
          ) : (
            <YStack>
              {paginatedData.map((row, index) => (
                <DataGridRow
                  key={row.id}
                  row={row}
                  index={index}
                  columns={columns}
                  actions={actions}
                  striped={striped}
                  hoverable={hoverable}
                  compact={compact}
                  selectable={selectable}
                  isSelected={selectedIds.includes(row.id)}
                  onSelect={() => handleSelectRow(row.id)}
                />
              ))}
            </YStack>
          )}
        </YStack>
      </ScrollView>

      {/* Pagination */}
      {pagination && !isLoading && processedData.length > 0 && (
        <DataGridPagination
          page={paginationState.page}
          pageSize={paginationState.pageSize}
          total={totalItems}
          totalPages={totalPages}
          pageSizeOptions={pageSizeOptions}
          onPageChange={(page) => handlePaginationChange({ page })}
          onPageSizeChange={(pageSize) => handlePaginationChange({ pageSize, page: 1 })}
        />
      )}
    </YStack>
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
