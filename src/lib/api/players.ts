export const fetchAllPlayers = async () => {
  const res = await fetch("/api/players");
  if (!res.ok) throw new Error("Failed to fetch players");
  return res.json();
};

export const fetchPlayerById = async (id: string) => {
  const res = await fetch(`/api/players/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

export const fetchMotorPreferencesById = async (id: string) => {
  const res = await fetch(`/api/players/${id}/motor-preference`);
  if (!res.ok) throw new Error("Failed to fetch motor preference");
  return res.json();
};
