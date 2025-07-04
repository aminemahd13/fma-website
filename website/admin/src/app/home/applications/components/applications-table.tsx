"use client"

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/table";
import { 
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ApplicationsPagination } from './applications-pagination';
import { ApplicationsToolbarProps } from './applications-toolbar';
const ApplicationsToolbar = dynamic<ApplicationsToolbarProps<any>>(
  () => import('./applications-toolbar').then(module =>   module.ApplicationsToolbar),
  { ssr: false },
)

interface ApplicationsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onFilteredDataChange?: (filteredData: TData[]) => void
}

// Keys for localStorage
const FILTER_STORAGE_KEY = 'applications-table-filters'
const SORTING_STORAGE_KEY = 'applications-table-sorting'
const VISIBILITY_STORAGE_KEY = 'applications-table-visibility'

export function ApplicationsTable<TData, TValue>({
  columns,
  data,
  onFilteredDataChange,
}: ApplicationsTableProps<TData, TValue>) {
  // Load saved state from localStorage
  const [sorting, setSorting] = useState<SortingState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SORTING_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(FILTER_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(VISIBILITY_STORAGE_KEY)
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(columnFilters))
    }
  }, [columnFilters])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SORTING_STORAGE_KEY, JSON.stringify(sorting))
    }
  }, [sorting])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(VISIBILITY_STORAGE_KEY, JSON.stringify(columnVisibility))
    }
  }, [columnVisibility])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Notify parent of filtered data changes
  useEffect(() => {
    if (onFilteredDataChange) {
      const filteredRows = table.getFilteredRowModel().rows;
      const filteredData = filteredRows.map(row => row.original);
      onFilteredDataChange(filteredData);
    }
  }, [columnFilters, data, onFilteredDataChange, table]);

  return (
    <div className='space-y-4'>
      <ApplicationsToolbar table={table} />
      
      <div className="rounded-md border ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ApplicationsPagination table={table} />
    </div>
  )
}
