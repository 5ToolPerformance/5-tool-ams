"use client";

import { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tab,
  Tabs,
} from "@heroui/react";
import { BarChart3, BookOpen, ChevronDown, Dumbbell } from "lucide-react";

import { ApiService } from "@/lib/services/api";
import { PlayerSelect } from "@/types/database";

import MotorPreferencesModal from "./assessments/motorPreferencesAssessment";
import LessonsSection from "./lessonsComponent";
import OverviewSection from "./overviewSection";
import PlansSection from "./plans/plansComponent";
import PlayerCard from "./players/playerCard";

interface PlayerDashboardProps {
  player: PlayerSelect;
  coachId: string | undefined;
}

const PlayerDashboard: React.FC<PlayerDashboardProps> = ({
  player,
  coachId,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [motorPreference, setMotorPreference] = useState();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log(player);

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!player?.id) {
        setError("Player ID is missing");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Example: Fetch player data by ID
        const data = await ApiService.fetchMotorPreferenceById(player.id);
        setMotorPreference(data.data);
      } catch (err) {
        setError("Failed to fetch player data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [player.id]);

  const tabOptions = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "lessons", label: "Lessons", icon: BookOpen },
    { key: "plans", label: "Plans", icon: Dumbbell },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case "overview":
        return <OverviewSection playerId={player.id} />;
      case "lessons":
        return <LessonsSection playerId={player.id} />;
      case "plans":
        return <PlansSection />;
      default:
        return <OverviewSection playerId={player.id} />;
    }
  };

  const selectedOption = tabOptions.find(
    (option) => option.key === selectedTab
  );

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Player Card and Motor Preference Side by Side */}
        <div className="flex flex-col items-start gap-6 md:flex-row">
          <PlayerCard player={player} size="lg" />
          <div>
            <Card className="p-6">
              <CardHeader>
                <h3 className="text-lg font-semibold">Motor Preferences</h3>
              </CardHeader>
              {motorPreference ? (
                <p>{JSON.stringify(motorPreference)}</p>
              ) : (
                <MotorPreferencesModal playerId={player.id} coachId={coachId} />
              )}
            </Card>
          </div>
        </div>

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
