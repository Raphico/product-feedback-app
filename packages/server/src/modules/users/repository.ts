import { eq, isNull, or } from "drizzle-orm";
import { DB } from "../../db/index.js";
import { type NewUser, type User, users } from "../../db/schema.js";

export function createUserRepository(db: DB) {
  return {
    async create(user: Omit<NewUser, "id">): Promise<User | undefined> {
      const [createdUser] = await db.insert(users).values(user).returning();
      return createdUser;
    },

    async findOne<T extends keyof Omit<User, "id" | "deletedAt" | "avatar">>(
      field: T,
      value: User[T],
    ): Promise<User | undefined> {
      if (value === null) {
        return db.query.users.findFirst({
          where: isNull(users[field]),
        });
      }

      return db.query.users.findFirst({
        where: eq(users[field], value),
      });
    },

    async findByEmailOrUsername(data: {
      username: string;
      email: string;
    }): Promise<User | undefined> {
      const { username, email } = data;
      return db.query.users.findFirst({
        where: or(eq(users.email, email), eq(users.username, username)),
      });
    },

    async findById(id: string): Promise<User | undefined> {
      return db.query.users.findFirst({
        where: eq(users.id, id),
      });
    },

    async update(
      id: string,
      updates: Partial<User>,
    ): Promise<User | undefined> {
      const [updatedUser] = await db
        .update(users)
        .set(updates)
        .where(eq(users.id, id))
        .returning();
      return updatedUser;
    },
  };
}

export type UserRepository = ReturnType<typeof createUserRepository>;
