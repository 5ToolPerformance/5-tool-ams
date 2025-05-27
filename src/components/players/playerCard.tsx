import React from "react";

import { Avatar, Card, CardBody, Chip } from "@heroui/react";

import { Player } from "@/types/users";

interface PlayerProfileCardProps {
  player: Player;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const PlayerProfileCard: React.FC<PlayerProfileCardProps> = ({
  player,
  className = "",
  size = "md",
}) => {
  const positionsArray = player.positions
    ? player.positions
        .split(",")
        .map((pos) => pos.trim())
        .filter((pos) => pos.length > 0)
    : [];
  const sizeClasses = {
    sm: {
      card: "p-2",
      avatar: "w-12 h-12",
      username: "text-xs",
      name: "text-sm",
      details: "text-xs",
      chip: "text-xs px-1 py-0.5 min-h-5",
    },
    md: {
      card: "p-4",
      avatar: "w-16 h-16",
      username: "text-sm",
      name: "text-base",
      details: "text-sm",
      chip: "text-xs",
    },
    lg: {
      card: "p-6",
      avatar: "w-20 h-20",
      username: "text-base",
      name: "text-lg",
      details: "text-base",
      chip: "text-sm",
    },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <Card className={`w-full max-w-md ${className}`} shadow="sm">
      <CardBody
        className={`${currentSize.card} flex flex-row items-center gap-4`}
      >
        <div className="flex-shrink-0">
          <Avatar
            src={player.image}
            alt={`${player.name || player.username}'s profile`}
            className={currentSize.avatar}
            showFallback
            name={
              player.name
                ? player.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : player.username?.charAt(0)
            }
          />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <h3
            className={`truncate font-semibold text-foreground ${currentSize.name}`}
          >
            {player.name}
          </h3>

          {player.name && player.name !== player.username && (
            <p className={`truncate text-default-600 ${currentSize.username}`}>
              @{player.username}
            </p>
          )}

          {player.date_of_birth && (
            <p className={`text-default-500 ${currentSize.details}`}>
              Date of Birth: {player.date_of_birth.toLocaleDateString()}
            </p>
          )}

          <div className={`flex flex-wrap gap-1 ${currentSize.details}`}>
            {player.hits && (
              <span className="text-default-500">
                Bats:{" "}
                <span className="font-medium text-default-700">
                  {player.hits}
                </span>
              </span>
            )}
            {player.hits && player.throws && (
              <span className="text-default-400">•</span>
            )}
            {player.throws && (
              <span className="text-default-500">
                Throws:{" "}
                <span className="font-medium text-default-700">
                  {player.throws}
                </span>
              </span>
            )}
          </div>

          {positionsArray.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {positionsArray.map((position, index) => (
                <Chip
                  key={index}
                  size="sm"
                  variant="flat"
                  color="primary"
                  className={currentSize.chip}
                >
                  {position}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default PlayerProfileCard;
