"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  popoverClassName?: string;
}

export function SearchableSelect({
  options = [],
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No options available",
  loadingMessage = "Loading...",
  isLoading = false,
  disabled = false,
  className,
  buttonClassName,
  popoverClassName,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  const getSelectedLabel = () => {
    const selected = options.find((option) => option.value === value);
    return selected ? selected.label : placeholder;
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between w-full h-11", buttonClassName)}
            disabled={disabled || isLoading}
          >
            <span className="truncate">
              {value ? getSelectedLabel() : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 w-4 h-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "p-0 w-full bg-background border-border shadow-lg",
            popoverClassName,
          )}
          align="start"
        >
          <Command className="bg-background">
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              {isLoading ? (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  {loadingMessage}
                </div>
              ) : (
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        const newValue =
                          option.value === value ? "" : option.value;
                        onValueChange?.(newValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span className="truncate">{option.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
