import React from 'react';
import { XStack, YStack, Text, Button, Select } from 'tamagui';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@tamagui/lucide-icons';

interface DataGridPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function DataGridPagination({
  page,
  pageSize,
  total,
  totalPages,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: DataGridPaginationProps) {
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 5;
    const halfShow = Math.floor(showPages / 2);

    let startPage = Math.max(1, page - halfShow);
    let endPage = Math.min(totalPages, page + halfShow);

    // Adjust if we're near the beginning or end
    if (page <= halfShow) {
      endPage = Math.min(totalPages, showPages);
    }
    if (page > totalPages - halfShow) {
      startPage = Math.max(1, totalPages - showPages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis');
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <XStack
      padding="$3"
      borderTopWidth={1}
      borderTopColor="$borderColor"
      backgroundColor="$gray2"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap="$3"
    >
      {/* Items info and page size selector */}
      <XStack alignItems="center" gap="$3">
        <Text fontSize="$2" color="$gray11">
          Showing {startItem} - {endItem} of {total}
        </Text>

        <XStack alignItems="center" gap="$2">
          <Text fontSize="$2" color="$gray11">
            Rows:
          </Text>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
            size="$2"
          >
            <Select.Trigger width={70} iconAfter={() => null}>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Viewport>
                {pageSizeOptions.map((option) => (
                  <Select.Item key={option} value={String(option)} index={option}>
                    <Select.ItemText>{option}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select>
        </XStack>
      </XStack>

      {/* Page navigation */}
      <XStack alignItems="center" gap="$1">
        {/* First page */}
        <Button
          size="$2"
          variant="ghost"
          disabled={!canGoPrevious}
          onPress={() => onPageChange(1)}
          opacity={canGoPrevious ? 1 : 0.5}
          padding="$1"
        >
          <ChevronsLeft size={18} />
        </Button>

        {/* Previous page */}
        <Button
          size="$2"
          variant="ghost"
          disabled={!canGoPrevious}
          onPress={() => onPageChange(page - 1)}
          opacity={canGoPrevious ? 1 : 0.5}
          padding="$1"
        >
          <ChevronLeft size={18} />
        </Button>

        {/* Page numbers */}
        <XStack gap="$1">
          {getPageNumbers().map((pageNum, index) =>
            pageNum === 'ellipsis' ? (
              <YStack key={`ellipsis-${index}`} paddingHorizontal="$2" justifyContent="center">
                <Text color="$gray10">...</Text>
              </YStack>
            ) : (
              <Button
                key={pageNum}
                size="$2"
                variant={pageNum === page ? 'primary' : 'ghost'}
                onPress={() => onPageChange(pageNum)}
                minWidth={32}
                padding="$1"
              >
                <Text
                  fontSize="$2"
                  color={pageNum === page ? '$white' : '$gray11'}
                >
                  {pageNum}
                </Text>
              </Button>
            )
          )}
        </XStack>

        {/* Next page */}
        <Button
          size="$2"
          variant="ghost"
          disabled={!canGoNext}
          onPress={() => onPageChange(page + 1)}
          opacity={canGoNext ? 1 : 0.5}
          padding="$1"
        >
          <ChevronRight size={18} />
        </Button>

        {/* Last page */}
        <Button
          size="$2"
          variant="ghost"
          disabled={!canGoNext}
          onPress={() => onPageChange(totalPages)}
          opacity={canGoNext ? 1 : 0.5}
          padding="$1"
        >
          <ChevronsRight size={18} />
        </Button>
      </XStack>
    </XStack>
  );
}
