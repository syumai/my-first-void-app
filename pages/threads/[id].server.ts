import { defineHandler, defineHead, type InferProps } from "void";
import { asc, db, eq, sql } from "void/db";
import { posts, threads } from "@schema";
import { createInsertSchema } from "void/drizzle-zod";
import { HTTPException } from "hono/http-exception";
import { getAuthorName } from "../../src/profile";

export type Props = InferProps<typeof loader>;

async function findThread(id: string | undefined) {
  const threadId = Number(id);
  if (!Number.isInteger(threadId) || threadId <= 0) return undefined;
  const [thread] = await db.select().from(threads).where(eq(threads.id, threadId));
  return thread;
}

export const loader = defineHandler(async (c) => {
  const thread = await findThread(c.req.param("id"));
  if (!thread) {
    throw new HTTPException(404, { message: "スレッドが見つかりません" });
  }
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.threadId, thread.id))
    .orderBy(asc(posts.id));
  return { thread, posts: rows };
});

export const head = defineHead<Props>((_c, props) => ({ title: props.thread.title }));

export const action = defineHandler.withValidator({
  body: createInsertSchema(posts, {
    body: (schema) =>
      schema
        .trim()
        .min(1, "本文を入力してください")
        .max(5000, "本文は5000文字以内で入力してください"),
  }).pick({ body: true }),
})(async (c, { body }) => {
  const thread = await findThread(c.req.param("id"));
  if (!thread) {
    throw new HTTPException(404, { message: "スレッドが見つかりません" });
  }
  await db.insert(posts).values({
    threadId: thread.id,
    authorName: getAuthorName(c),
    body: body.body,
  });
  await db
    .update(threads)
    .set({ lastPostedAt: sql`(datetime('now'))` })
    .where(eq(threads.id, thread.id));
});
