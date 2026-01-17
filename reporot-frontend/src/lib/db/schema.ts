import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const videos = sqliteTable("videos", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    jobId: text("job_id").notNull().unique(),
    repoUrl: text("repo_url").notNull(),
    repoName: text("repo_name").notNull(),
    repoDescription: text("repo_description"),
    videoUrl: text("video_url").notNull(),
    subtitleStyle: text("subtitle_style").notNull().default("brainrot"),
    stars: integer("stars").default(0),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;
