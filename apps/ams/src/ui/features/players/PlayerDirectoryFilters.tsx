"use client";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import {
  PlayerDirectoryFiltersState,
  PlayerDirectorySortKey,
  PlayerDirectorySortOrder,
} from "@ams/domain/player/directory";

interface PositionOption {
  id: string;
  label: string;
}

interface PlayerDirectoryFiltersProps {
  filters: PlayerDirectoryFiltersState;
  showFilters: boolean;
  activeFiltersCount: number;
  ageOptions: number[];
  positionOptions: PositionOption[];
  onSearchChange: (value: string) => void;
  onAgeFilterChange: (value: string) => void;
  onPositionFilterChange: (value: string) => void;
  onInjuryStatusFilterChange: (value: "" | "none" | "injured" | "limited") => void;
  onProspectFilterChange: (value: "" | "prospect" | "nonProspect") => void;
  onSortByChange: (value: PlayerDirectorySortKey) => void;
  onSortOrderChange: (value: PlayerDirectorySortOrder) => void;
  onToggleExpandedFilters: () => void;
  onClearFilters: () => void;
}

export function PlayerDirectoryFilters({
  filters,
  showFilters,
  activeFiltersCount,
  ageOptions,
  positionOptions,
  onSearchChange,
  onAgeFilterChange,
  onPositionFilterChange,
  onInjuryStatusFilterChange,
  onProspectFilterChange,
  onSortByChange,
  onSortOrderChange,
  onToggleExpandedFilters,
  onClearFilters,
}: PlayerDirectoryFiltersProps) {
  return (
    <div className="mb-6 flex flex-col space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-500" />
          <Input
            type="search"
            placeholder="Search by player name..."
            className="pl-10"
            value={filters.searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <Button
          variant={showFilters ? "solid" : "bordered"}
          onPress={onToggleExpandedFilters}
          startContent={<SlidersHorizontal className="h-4 w-4" />}
          className="w-full sm:w-auto"
        >
          Filters
          {activeFiltersCount > 0 && (
            <Chip size="sm" color="default" variant="flat">
              {activeFiltersCount}
            </Chip>
          )}
        </Button>
      </div>

      {showFilters && (
        <Card shadow="sm">
          <CardBody className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Filter Options</h3>
              {activeFiltersCount > 0 && (
                <Button
                  size="sm"
                  variant="light"
                  onPress={onClearFilters}
                  startContent={<X className="h-3 w-3" />}
                >
                  Clear all
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Select
                label="Age"
                placeholder="All ages"
                selectedKeys={filters.ageFilter ? new Set([filters.ageFilter]) : new Set()}
                onChange={(event) => onAgeFilterChange(event.target.value)}
              >
                {ageOptions.map((age) => (
                  <SelectItem key={String(age)}>{age} years old</SelectItem>
                ))}
              </Select>

              <Select
                label="Position"
                placeholder="All positions"
                selectedKeys={
                  filters.positionFilter ? new Set([filters.positionFilter]) : new Set()
                }
                onChange={(event) => onPositionFilterChange(event.target.value)}
              >
                {positionOptions.map((option) => (
                  <SelectItem key={option.id}>{option.label}</SelectItem>
                ))}
              </Select>

              <Select
                label="Injury Status"
                placeholder="All statuses"
                selectedKeys={
                  filters.injuryStatusFilter
                    ? new Set([filters.injuryStatusFilter])
                    : new Set()
                }
                onChange={(event) =>
                  onInjuryStatusFilterChange(
                    (event.target.value as "" | "none" | "injured" | "limited") ?? ""
                  )
                }
              >
                <SelectItem key="none">No active injuries</SelectItem>
                <SelectItem key="injured">Injured</SelectItem>
                <SelectItem key="limited">Limited</SelectItem>
              </Select>

              <Select
                label="Prospect"
                placeholder="All players"
                selectedKeys={
                  filters.prospectFilter ? new Set([filters.prospectFilter]) : new Set()
                }
                onChange={(event) =>
                  onProspectFilterChange(
                    (event.target.value as "" | "prospect" | "nonProspect") ?? ""
                  )
                }
              >
                <SelectItem key="prospect">Prospect only</SelectItem>
                <SelectItem key="nonProspect">Non-prospect only</SelectItem>
              </Select>

              <Select
                label="Sort by"
                selectedKeys={new Set([filters.sortBy])}
                onChange={(event) => onSortByChange(event.target.value as PlayerDirectorySortKey)}
              >
                <SelectItem key="firstName">First Name</SelectItem>
                <SelectItem key="lastName">Last Name</SelectItem>
                <SelectItem key="age">Age</SelectItem>
              </Select>

              <Select
                label="Order"
                selectedKeys={new Set([filters.sortOrder])}
                onChange={(event) =>
                  onSortOrderChange(event.target.value as PlayerDirectorySortOrder)
                }
              >
                <SelectItem key="asc">Ascending</SelectItem>
                <SelectItem key="desc">Descending</SelectItem>
              </Select>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
