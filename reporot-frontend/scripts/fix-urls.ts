import { db } from "../src/lib/db";
import { videos } from "../src/lib/db/schema";
import { sql } from "drizzle-orm";

async function fixUrls() {
    console.log("🛠️ Fixing URLs in database...");
    await db.run(sql`
    UPDATE videos 
    SET video_url = REPLACE(video_url, 'your-r2-public-domain.com', 'pub-380bc755537d428e815c9c8233435e68.r2.dev')
  `);
    console.log("✅ URLs updated!");
    process.exit(0);
}

fixUrls();
