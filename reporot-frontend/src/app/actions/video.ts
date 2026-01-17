"use server"

import { db } from "@/lib/db";
import { videos } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { sql } from "drizzle-orm";

export async function saveVideo(data: {
    repoUrl: string;
    repoName: string;
    videoUrl: string;
    subtitleStyle: string;
    jobId: string;
    repoDescription?: string;
    stars?: number;
}) {
    try {
        const [result] = await db.insert(videos).values({
            jobId: data.jobId,
            repoUrl: data.repoUrl,
            repoName: data.repoName,
            videoUrl: data.videoUrl,
            subtitleStyle: data.subtitleStyle,
            repoDescription: data.repoDescription,
            stars: data.stars,
        }).returning();

        revalidatePath("/tiktok");
        return { success: true, video: result };
    } catch (error) {
        console.error("Error saving video:", error);
        return { success: false, error: "Failed to save video to database" };
    }
}


export async function getVideos() {
    try {
        return await db.select().from(videos).orderBy(videos.createdAt);
    } catch (error) {
        console.error("Error fetching videos:", error);
        return [];
    }
}

export async function getVideoByRepoUrl(repoUrl: string) {
    try {
        const result = await db.select().from(videos).where(sql`${videos.repoUrl} = ${repoUrl}`).limit(1);
        return result[0] || null;
    } catch (error) {
        console.error("Error fetching video by URL:", error);
        return null;
    }
}
