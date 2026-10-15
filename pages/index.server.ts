import { defineHandler, defineHead, type InferProps } from "void";
import { count, db, desc, eq } from "void/db";
import { posts, threads } from "@schema";
import { createInsertSchema } from "void/drizzle-zod";
import { getAuthorName } from "../src/profile";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async () => {
  const rows = await db
    .select({
      id: threads.id,
      title: threads.title,
      authorName: threads.authorName,
      createdAt: threads.createdAt,
      lastPostedAt: threads.lastPostedAt,
      postCount: count(posts.id),
    })
    .from(threads)
    .leftJoin(posts, eq(posts.threadId, threads.id))
    .groupBy(threads.id)
    .orderBy(desc(threads.lastPostedAt), desc(threads.id));
  return { threads: rows };
});

export const head = defineHead(() => ({ title: "スレッド一覧" }));

const titleSchema = createInsertSchema(threads, {
  title: (schema) =>
    schema
      .trim()
      .min(1, "タイトルを入力してください")
      .max(100, "タイトルは100文字以内で入力してください"),
}).pick({ title: true });

const bodySchema = createInsertSchema(posts, {
  body: (schema) =>
    schema
      .trim()
      .min(1, "本文を入力してください")
      .max(5000, "本文は5000文字以内で入力してください"),
}).pick({ body: true });

export const action = defineHandler.withValidator({
  body: titleSchema.extend(bodySchema.shape),
})(async (c, { body }) => {
  const authorName = getAuthorName(c);
  const [thread] = await db
    .insert(threads)
    .values({ title: body.title, authorName })
    .returning({ id: threads.id });
  await db.insert(posts).values({ threadId: thread.id, authorName, body: body.body });
  return c.redirect(`/threads/${thread.id}`);
});
