"use client";

import { useEffect, useState } from "react";

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

import { useMotorPreferences } from "@/hooks";
import { useRecentArmScore } from "@/hooks/armcare-exams";
import { PlayerSelect } from "@/types/database";

import MotorPreferencesModal from "../assessments/motorPreferencesAssessment";
import LessonsSection from "../lessonsComponent";
import OverviewSection from "../overviewSection";
import PlansSection from "../plans/plansComponent";
import { AddWriteupLogForm } from "../players/AddWriteupLogForm";
import { ArmCareProfileCard } from "../players/ArmCareProfileCard";
import PlayerCreateForm from "../players/PlayerCreateForm";
import PlayerInjuryForm from "../players/PlayerInjuryForm";
import PlayerCard from "../players/playerCard";
import { MotorPreferenceCard } from "../ui/MotorPreferenceCard";

interface PlayerDashboardProps {
  player: PlayerSelect;
  coachId: string | undefined;
}

export default function PlayerDashboard({
  player,
  coachId,
}: PlayerDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [currentPlayer, setCurrentPlayer] = useState<PlayerSelect>(player);
  const {
    data: motorPreferences,
    isLoading: motorPreferencesLoading,
    error: motorPreferencesError,
  } = useMotorPreferences(currentPlayer.id);
  const { recentScore, isLoading: recentScoreLoading } = useRecentArmScore(
    currentPlayer.id
  );

  // Keep local player in sync if prop changes
  useEffect(() => {
    setCurrentPlayer(player);
  }, [player]);

  const tabOptions = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "lessons", label: "Lessons", icon: BookOpen },
    { key: "plans", label: "Plans", icon: Dumbbell },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case "overview":
        return <OverviewSection playerId={currentPlayer.id} />;
      case "lessons":
        return <LessonsSection playerId={currentPlayer.id} />;
      case "plans":
        return <PlansSection />;
      default:
        return <OverviewSection playerId={currentPlayer.id} />;
    }
  };

  const selectedOption = tabOptions.find(
    (option) => option.key === selectedTab
  );

  if (motorPreferencesLoading) {
    return <div>Loading...</div>;
  }

  if (motorPreferencesError) {
    return <div>Error: {motorPreferencesError}</div>;
  }

  const recentExamDate = new Date(recentScore.examDate).toLocaleDateString();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Player Card and Motor Preference Side by Side */}
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="flex flex-col gap-3">
            <PlayerCard player={currentPlayer} size="lg" />
            <PlayerCreateForm
              player={currentPlayer}
              onPlayerUpdated={setCurrentPlayer}
            />
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:gap-6">
            <div>
              {motorPreferences ? (
                <MotorPreferenceCard motorPreference={motorPreferences} />
              ) : (
                <MotorPreferencesModal
                  playerId={currentPlayer.id}
                  coachId={coachId}
                />
              )}
            </div>

            <div>
              <PlayerInjuryForm playerId={currentPlayer.id} />
            </div>
            <div>
              <AddWriteupLogForm playerId={currentPlayer.id} />
            </div>
          </div>

          <div className="flex flex-col gap-3 md:ml-auto">
            {recentScoreLoading ? (
              <div>Loading...</div>
            ) : recentScore && recentScore.armScore && recentScore.examDate ? (
              <ArmCareProfileCard
                playerId={currentPlayer.id}
                score={parseFloat(recentScore.armScore)}
                date={recentExamDate}
              />
            ) : (
              <div>No recent ArmScore found</div>
            )}
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
}
