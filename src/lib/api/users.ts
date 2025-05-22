export const fetchAllUsers = async () => {
  const res = await fetch("/api/user");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const fetchUserById = async (id: string) => {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};
