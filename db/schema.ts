import { sql } from "void/db";
import { index, integer, sqliteTable, text } from "void/schema-d1";

export const threads = sqliteTable(
  "threads",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    authorName: text("author_name").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    lastPostedAt: text("last_posted_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [index("threads_last_posted_at_idx").on(table.lastPostedAt)],
);

export const posts = sqliteTable(
  "posts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    threadId: integer("thread_id")
      .notNull()
      .references(() => threads.id, { onDelete: "cascade" }),
    authorName: text("author_name").notNull(),
    body: text("body").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [index("posts_thread_id_idx").on(table.threadId)],
);
