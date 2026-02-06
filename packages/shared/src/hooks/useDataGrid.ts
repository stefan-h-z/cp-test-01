import type { SortState, FilterState, PaginationState } from '@app/types';
import { useState, useCallback, useMemo } from 'react';

interface UseDataGridOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialSort?: SortState;
  initialFilters?: FilterState;
}

interface UseDataGridReturn<T> {
  // Sort
  sortState: SortState;
  setSortState: (sort: SortState) => void;
  // Filter
  filterState: FilterState;
  setFilterState: (filters: FilterState) => void;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  // Pagination
  paginationState: PaginationState;
  setPaginationState: (pagination: PaginationState) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  // Processed data
  processData: (data: T[]) => T[];
  paginateData: (data: T[]) => T[];
  // Reset
  reset: () => void;
}

export function useDataGrid<T extends Record<string, unknown>>(
  options: UseDataGridOptions = {}
): UseDataGridReturn<T> {
  const {
    initialPage = 1,
    initialPageSize = 10,
    initialSort = { column: null, direction: null },
    initialFilters = {},
  } = options;

  // State
  const [sortState, setSortState] = useState<SortState>(initialSort);
  const [filterState, setFilterState] = useState<FilterState>(initialFilters);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
  });

  // Filter helpers
  const setFilter = useCallback((key: string, value: string) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
    setPaginationState((prev) => ({ ...prev, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilterState({});
    setPaginationState((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Pagination helpers
  const setPage = useCallback((page: number) => {
    setPaginationState((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setPaginationState((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  // Process data (filter + sort)
  const processData = useCallback(
    (data: T[]): T[] => {
      let result = [...data];

      // Apply filters
      Object.entries(filterState).forEach(([key, value]) => {
        if (value) {
          const lowerValue = value.toLowerCase();
          result = result.filter((item) => {
            const itemValue = getNestedValue(item, key);
            return String(itemValue).toLowerCase().includes(lowerValue);
          });
        }
      });

      // Apply sort
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
    },
    [filterState, sortState]
  );

  // Paginate data
  const paginateData = useCallback(
    (data: T[]): T[] => {
      const start = (paginationState.page - 1) * paginationState.pageSize;
      const end = start + paginationState.pageSize;
      return data.slice(start, end);
    },
    [paginationState.page, paginationState.pageSize]
  );

  // Reset all state
  const reset = useCallback(() => {
    setSortState(initialSort);
    setFilterState(initialFilters);
    setPaginationState({
      page: initialPage,
      pageSize: initialPageSize,
      total: 0,
    });
  }, [initialSort, initialFilters, initialPage, initialPageSize]);

  return {
    sortState,
    setSortState,
    filterState,
    setFilterState,
    setFilter,
    clearFilters,
    paginationState,
    setPaginationState,
    setPage,
    setPageSize,
    processData,
    paginateData,
    reset,
  };
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
