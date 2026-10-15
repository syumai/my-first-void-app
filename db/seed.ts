import { defineSeed } from "void/seed";

const SAMPLE_THREADS = [
  {
    title: "ようこそ！自己紹介スレッド",
    authorName: "管理人",
    posts: [
      {
        authorName: "管理人",
        body: "はじめまして。ここは話題ごとにスレッドを立てて話せる掲示板です。\n気軽に自己紹介していってください！",
      },
      { authorName: "Alice", body: "Alice です。Void で遊んでいます。よろしくお願いします。" },
    ],
  },
  {
    title: "Void のおすすめ機能を教えて",
    authorName: "Bob",
    posts: [
      {
        authorName: "Bob",
        body: "最近 Void を触り始めました。便利な機能があれば教えてください。",
      },
    ],
  },
];

export default defineSeed<typeof import("./schema")>(async ({ db, schema }) => {
  for (const thread of SAMPLE_THREADS) {
    const [created] = await db
      .insert(schema.threads)
      .values({ title: thread.title, authorName: thread.authorName })
      .returning({ id: schema.threads.id });
    await db
      .insert(schema.posts)
      .values(thread.posts.map((post) => ({ ...post, threadId: created.id })));
  }
});
