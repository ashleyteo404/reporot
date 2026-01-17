import { getVideos } from "@/app/actions/video";
import { VideoFeed } from "@/components/video-feed";

export const dynamic = "force-dynamic";

export default async function TiktokPage({
    searchParams
}: {
    searchParams: { v?: string }
}) {
    const videos = await getVideos();

    return (
        <main className="h-screen w-full bg-black overflow-hidden">
            <VideoFeed initialVideos={videos} initialVideoId={searchParams.v} />
        </main>
    );
}
