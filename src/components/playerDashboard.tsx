"use client";

import { useState } from "react";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tab,
  Tabs,
} from "@heroui/react";
import { BarChart3, BookOpen, ChevronDown, Dumbbell } from "lucide-react";

import { Player } from "@/types/users";

import LessonsSection from "./lessonsComponent";
import OverviewSection from "./overviewSection";
import PlansSection from "./plans/plansComponent";
import PlayerCard from "./players/playerCard";

interface PlayerDashboardProps {
  player: Player;
}

const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ player }) => {
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  const tabOptions = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "lessons", label: "Lessons", icon: BookOpen },
    { key: "plans", label: "Plans", icon: Dumbbell },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case "overview":
        return <OverviewSection />;
      case "lessons":
        return <LessonsSection />;
      case "plans":
        return <PlansSection />;
      default:
        return <OverviewSection />;
    }
  };

  const selectedOption = tabOptions.find(
    (option) => option.key === selectedTab
  );

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Player Card */}
        <PlayerCard player={player} size="lg" />

        {/* Navigation - Tabs on larger screens, Dropdown on mobile */}
        <div className="w-full">
          {/* Desktop Tabs */}
          <div className="hidden sm:block">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              variant="underlined"
              classNames={{
                tabList:
                  "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-primary",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-primary",
              }}
            >
              {tabOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Tab
                    key={option.key}
                    title={
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    }
                  />
                );
              })}
            </Tabs>
          </div>

          {/* Mobile Dropdown */}
          <div className="sm:hidden">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="w-full justify-between"
                  endContent={<ChevronDown className="h-4 w-4" />}
                >
                  <div className="flex items-center gap-2">
                    {selectedOption && (
                      <>
                        <selectedOption.icon className="h-4 w-4" />
                        {selectedOption.label}
                      </>
                    )}
                  </div>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                selectedKeys={new Set([selectedTab])}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const selectedKeys = Array.from(keys as Set<string>);
                  if (selectedKeys.length > 0) {
                    setSelectedTab(selectedKeys[0]);
                  }
                }}
              >
                {tabOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <DropdownItem
                      key={option.key}
                      startContent={<IconComponent className="h-4 w-4" />}
                    >
                      {option.label}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
