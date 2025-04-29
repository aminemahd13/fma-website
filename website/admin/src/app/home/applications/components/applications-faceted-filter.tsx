import * as React from "react"
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/shared/badge"
import { Button } from "@/components/shared/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/shared/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/popover"
import Separator from "@/components/shared/separator"
import { Status, getStatusClassname } from "./application-status"

interface ApplicationsFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
    category?: string
  }[]
}

export function ApplicationsFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: ApplicationsFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])
  const [open, setOpen] = React.useState(false)

  // Group options by category if available
  const optionsByCategory = React.useMemo(() => {
    const grouped: Record<string, typeof options> = {}
    
    options.forEach(option => {
      const category = option.category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(option)
    })
    
    return grouped
  }, [options])

  // Get all categories
  const categories = React.useMemo(() => 
    Object.keys(optionsByCategory),
  [optionsByCategory])

  // Get the active badge variant based on the filter type
  const getBadgeVariant = (value: string) => {
    // For status filters, use the status classname
    if (title === "Status") {
      return getStatusClassname(value as Status, 'sm')
    }
    
    // For advanced filters, use specialized styles based on category
    const option = options.find(opt => opt.value === value)
    if (option?.category === "Registration Status") {
      return "bg-blue-100 text-blue-800"
    } else if (option?.category === "Missing Documents") {
      return "bg-amber-100 text-amber-800"
    }
    
    return "bg-gray-100"
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "h-9 border-dashed px-3 font-medium",
            selectedValues?.size > 0 && "border-solid bg-muted"
          )}
        >
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className={cn("rounded-sm px-1 font-normal", getBadgeVariant(option.value))}
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${title?.toLowerCase()}...`} />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No results found.</CommandEmpty>
            
            {categories.map(category => (
              <React.Fragment key={category}>
                <CommandGroup heading={category}>
                  {optionsByCategory[category].map((option) => {
                    const isSelected = selectedValues.has(option.value)
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          if (isSelected) {
                            selectedValues.delete(option.value)
                          } else {
                            selectedValues.add(option.value)
                          }
                          const filterValues = Array.from(selectedValues)
                          column?.setFilterValue(
                            filterValues.length ? filterValues : undefined
                          )
                        }}
                        className={cn(
                          "flex items-center px-2 py-1.5",
                          isSelected && "bg-muted/50"
                        )}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <CheckIcon className={cn("h-4 w-4")} />
                        </div>
                        {option.icon && (
                          <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={cn(
                          isSelected && title === "Status" ? getBadgeVariant(option.value) : "",
                          "font-normal"
                        )}>
                          {option.label}
                        </span>
                        {facets?.get(option.value) && (
                          <Badge className="ml-auto flex h-5 rounded-sm px-1 font-normal">
                            {facets.get(option.value)}
                          </Badge>
                        )}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                {categories.indexOf(category) < categories.length - 1 && (
                  <CommandSeparator />
                )}
              </React.Fragment>
            ))}
            
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      column?.setFilterValue(undefined)
                      setOpen(false)
                    }}
                    className="justify-center text-center font-medium text-primary"
                  >
                    Clear all filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}