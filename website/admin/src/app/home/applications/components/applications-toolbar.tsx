"use client"

import { Cross2Icon, FileTextIcon, MixerHorizontalIcon } from "@radix-ui/react-icons"
import { Search } from "lucide-react"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/shared/button"
import { Input } from "@/components/shared/input"
import { ApplicationsViewOptions } from "./applications-view-options"
import { statuses } from "./statuses"
import { advancedFilters } from "./advanced-filters"
import { ApplicationsFacetedFilter } from "./applications-faceted-filter"
import axios from 'axios-typescript';
import { getToken } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface ApplicationsToolbarProps<TData> {
  table: Table<TData>
}

export function ApplicationsToolbar<TData>({
  table,
}: ApplicationsToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  
  const onExportData = async () => {
    axios({
      url: process.env.NEXT_PUBLIC_API_ENDPOINT + `excel/applications`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      responseType: 'blob', // important
    }).then((response: any) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document?.createElement('a');
      link.href = url;
      link.setAttribute('download', 'applications.xlsx'); //or any other extension
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
  
  // Common filter presets
  const applyFilterPreset = (preset: string) => {
    // Clear existing filters first
    table.resetColumnFilters()
    
    // Apply the appropriate preset filter
    switch(preset) {
      case "accepted-no-documents":
        table.getColumn("advancedFilter")?.setFilterValue(["ACCEPTED_NO_DOCUMENTS"])
        break
      case "documents-pending-validation":
        table.getColumn("advancedFilter")?.setFilterValue(["DOCUMENTS_PENDING_VALIDATION"])
        break
      case "all-accepted":
        table.getColumn("status")?.setFilterValue(["ACCEPTED"])
        break
    }
  }

  // Count of active filters
  const activeFiltersCount = table.getState().columnFilters.reduce((count, filter) => {
    const values = filter.value as string[]
    return count + (values ? values.length : 0)
  }, 0)

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, city, or school..."
            value={(table.getColumn("globalFilter")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("globalFilter")?.setFilterValue(event.target.value)
            }
            className="pl-8"
          />
        </div>
        {(table.getColumn("globalFilter")?.getFilterValue() as string) && (
          <Button
            variant="ghost"
            onClick={() => table.getColumn("globalFilter")?.setFilterValue("")}
            className="h-8 px-2 lg:px-3"
          >
            Clear search
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="h-8 gap-1.5 pl-3 pr-3.5 flex items-center" title="Number of active filters">
            <MixerHorizontalIcon className="h-3.5 w-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 rounded-full px-1.5 h-5">
                {activeFiltersCount}
              </Badge>
            )}
          </Badge>
          
          {table.getColumn("status") && (
            <ApplicationsFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statuses}
            />
          )}
          
          {table.getColumn("advancedFilter") && (
            <ApplicationsFacetedFilter
              column={table.getColumn("advancedFilter")}
              title="Advanced Filters"
              options={advancedFilters}
            />
          )}
          
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset filters
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => applyFilterPreset("accepted-no-documents")}
            title="Show accepted users who haven't submitted their registration documents"
          >
            Missing Documents
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => applyFilterPreset("documents-pending-validation")}
            title="Show users with pending document validation"
          >
            Pending Validation
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => applyFilterPreset("all-accepted")}
            title="Show all accepted users"
          >
            All Accepted
          </Button>
          
          {/* export applications excel */}
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8 lg:flex"
            onClick={onExportData}
          >
            <FileTextIcon className="mr-2 h-4 w-4" />
            Export data
          </Button>

          <ApplicationsViewOptions table={table} />
        </div>
      </div>
    </div>
  )
}