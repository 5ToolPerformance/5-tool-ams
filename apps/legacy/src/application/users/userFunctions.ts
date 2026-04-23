import { and, eq } from "drizzle-orm";

import db from "@/db";
import { users } from "@/db/schema";

/**
 * Service for managing user data in the database.
 */
  /**
   * Fetch all users from the database.
   * @returns An array of User objects.
   * @throws Error if there is an issue with the database query.
   */
export async function getAllUsers() {
    try {
      return await db.select().from(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

export async function getAllUsersScoped(facilityId: string) {
    try {
      return await db.select().from(users).where(eq(users.facilityId, facilityId));
    } catch (error) {
      console.error("Error fetching scoped users:", error);
      throw new Error("Failed to fetch users");
    }
  }
  /**
   * Fetch all users with the role "player" from the database.
   * @returns An array of User objects.
   * @throws Error if there is an issue with the database query.
   */
export async function getAllPlayers() {
    try {
      return await db.select().from(users).where(eq(users.role, "player"));
    } catch (error) {
      console.error("Error fetching players:", error);
      throw new Error("Failed to fetch players");
    }
  }
  /**
   * Fetch all users with the role "coach" from the database.
   * @returns An array of User objects.
   * @throws Error if there is an issue with the database query.
   */
export async function getAllCoaches() {
    try {
      return await db.select().from(users).where(eq(users.role, "coach"));
    } catch (error) {
      console.error("Error fetching coaches:", error);
      throw new Error("Failed to fetch players");
    }
  }
  /**
   * Fetch all users with the role "admin" from the database.
   * @returns An array of User objects.
   * @throws Error if there is an issue with the database query.
   */
export async function getAllAdmins() {
    try {
      return await db.select().from(users).where(eq(users.role, "admin"));
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw new Error("Failed to fetch players");
    }
  }
  /**
   * Fetch a user by their unique user id in the database.
   * @param id - The user id of the user to fetch.
   * @returns The User object if found, otherwise null.
   * @throws Error if there is an issue with the database query.
   */
export async function getUserById(id: string) {
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return user.length > 0 ? user[0] : null;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("Failed to fetch user");
    }
  }

export async function getAllCoachesScoped(facilityId: string) {
    try {
      return await db
        .select()
        .from(users)
        .where(and(eq(users.role, "coach"), eq(users.facilityId, facilityId)));
    } catch (error) {
      console.error("Error fetching scoped coaches:", error);
      throw new Error("Failed to fetch players");
    }
  }

export async function getUserByIdScoped(id: string, facilityId: string) {
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (user.length === 0) return null;
      if (user[0].facilityId !== facilityId) return null;
      return user[0];
    } catch (error) {
      console.error("Error fetching scoped user by ID:", error);
      throw new Error("Failed to fetch user");
    }
  }
  /**
   * Fetch a user by their email address in the database.
   * @param email - The email address of the user to fetch.
   * @returns The User object if found, otherwise null.
   * @throws Error if there is an issue with the database query.
   */
export async function getUserByEmail(email: string) {
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      return user.length > 0 ? user[0] : null;
    } catch (error) {
      console.error("Error fetching user by Email:", error);
      throw new Error("Failed to fetch user");
    }
  }
  /**
   * Fetch a user by their username in the database.
   * @param username - The username of the user to fetch.
   * @returns The User object if found, otherwise null.
   * @throws Error if there is an issue with the database query.
   */
export async function getUserByUsername(username: string) {
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
      return user.length > 0 ? user[0] : null;
    } catch (error) {
      console.error("Error fetching user by Username:", error);
      throw new Error("Failed to fetch user");
    }
  }