import { db } from "../src/lib/db";
import { videos } from "../src/lib/db/schema";

const FAMOUS_REPOS = [
    "facebook/react",
    "facebook/react-native",
    "vercel/next.js",
    "tailwindlabs/tailwindcss",
    "shadcn-ui/ui",
    "anthropics/claude-code",
    "google/generative-ai-js",
    "openai/openai-python",
    "kamailio/kamailio",
    "microsoft/vscode"
];

const BACKEND_URL = "http://127.0.0.1:8000/generate";

async function generateForRepo(repoPath: string) {
    const repoUrl = `https://github.com/${repoPath}`;
    console.log(`\n⏳ [1/3] Calling Backend for: ${repoPath}...`);
    console.log(`   (Note: High-detail 1000+ token scripts can take 3-5+ minutes to encode)`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200000); // 20 minute timeout

    try {
        const startTime = Date.now();
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                github_url: repoUrl,
                voice: "Puck",
                subtitle_style: "brainrot"
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const err = await response.text();
            console.error(`❌ Backend Error for ${repoPath}: ${err}`);
            return;
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`✨ [2/3] Video generated in ${duration}s. Fetching metadata...`);

        const r2Url = response.headers.get("X-R2-URL");
        const jobId = response.headers.get("X-Job-Id") || Math.random().toString(36).substring(7);

        if (!r2Url || r2Url === "None") {
            console.warn(`⚠️ No valid R2 URL returned for ${repoPath}. R2 might be misconfigured.`);
            return;
        }

        console.log(`💾 [3/3] Saving to Database: ${r2Url}`);

        await db.insert(videos).values({
            jobId,
            repoUrl,
            repoName: repoPath,
            videoUrl: r2Url,
            subtitleStyle: "brainrot",
            repoDescription: `Repository: ${repoPath}.`,
            stars: 1000
        });

        console.log(`✅ Success: ${repoPath}`);
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.error(`🛑 Timeout: Backend took too long for ${repoPath}`);
        } else {
            console.error(`💥 Fatal Error for ${repoPath}:`, error.message);
        }
    } finally {
        clearTimeout(timeoutId);
    }
}

async function main() {
    console.log("------------------------------------------");
    console.log("🎬 BRAINROT POPULATION ENGINE STARTING");
    console.log("------------------------------------------");

    // Check if we already have these in DB to avoid dupes
    const existing = await db.select().from(videos);
    const existingRepos = new Set(existing.map(v => v.repoName));

    for (const repo of FAMOUS_REPOS) {
        if (existingRepos.has(repo)) {
            console.log(`⏩ Skipping ${repo} (Already in DB)`);
            continue;
        }
        await generateForRepo(repo);
    }

    console.log("\n✨ Done! Database population complete.");
    process.exit(0);
}

main();
