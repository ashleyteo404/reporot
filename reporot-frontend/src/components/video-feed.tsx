"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, MessageCircle, Share2, ExternalLink, Github, ArrowLeft, PlayCircle } from "lucide-react"
import Link from "next/link"
import { Video as VideoType } from "@/lib/db/schema"

interface VideoFeedProps {
    initialVideos: VideoType[]
    initialVideoId?: string | null
}

export function VideoFeed({ initialVideos, initialVideoId }: VideoFeedProps) {
    const findInitialIndex = () => {
        if (!initialVideoId) return 0;
        const index = initialVideos.findIndex(v => String(v.id) === initialVideoId || v.jobId === initialVideoId);
        return index !== -1 ? index : 0;
    };

    const [activeIndex, setActiveIndex] = useState(findInitialIndex)
    const containerRef = useRef<HTMLDivElement>(null)

    // Scroll to initial video on mount
    useEffect(() => {
        if (containerRef.current && activeIndex > 0) {
            containerRef.current.scrollTo({
                top: activeIndex * containerRef.current.clientHeight,
                behavior: "instant" as ScrollBehavior
            })
        }
    }, [])

    const handleScroll = () => {
        if (!containerRef.current) return
        const index = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight)
        if (index !== activeIndex) {
            setActiveIndex(index)
        }
    }



    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!containerRef.current) return

            if (e.key === "ArrowDown") {
                e.preventDefault()
                const nextIndex = Math.min(activeIndex + 1, initialVideos.length - 1)
                containerRef.current.scrollTo({
                    top: nextIndex * containerRef.current.clientHeight,
                    behavior: "smooth"
                })
            } else if (e.key === "ArrowUp") {
                e.preventDefault()
                const prevIndex = Math.max(activeIndex - 1, 0)
                containerRef.current.scrollTo({
                    top: prevIndex * containerRef.current.clientHeight,
                    behavior: "smooth"
                })

            } else if (e.key === " ") {
                // Determine active video player and toggle play (tricky from here, simpler to let VideoPlayer handle focus or use a ref map if needed, but 'm' is easy global)
                e.preventDefault()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [activeIndex, initialVideos.length])

    return (
        <div className="relative h-full w-full">
            {/* Top Navigation */}
            <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
                <Link href="/dashboard" className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-lg">Reporot Feed</h1>


            </div>

            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {initialVideos.length === 0 ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-white space-y-4 px-6 text-center">
                        <Github className="w-16 h-16 opacity-20" />
                        <p className="text-lg opacity-60">No videos generated yet. Head to the dashboard to create some brainrot!</p>
                        <Link href="/dashboard" className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform">
                            Go to Dashboard
                        </Link>
                    </div>
                ) : (
                    initialVideos.map((video, index) => (
                        <section
                            key={video.id}
                            className="h-full w-full snap-start relative flex items-center justify-center bg-zinc-950"
                        >
                            {/* Blurred Ambient Background */}
                            <div
                                className="absolute inset-0 opacity-20 bg-center bg-cover blur-3xl"
                                style={{ backgroundImage: `url(${video.videoUrl})` }}
                            />

                            {/* Main Video Container */}
                            <div className="relative w-full max-w-[420px] h-full max-h-[calc(100vh-4rem)] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/10 m-4">
                                <VideoPlayer
                                    src={video.videoUrl}
                                    isActive={index === activeIndex}
                                />

                                {/* Overlay Content */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />

                                {/* Sidebar Actions */}
                                <div className="absolute right-2 bottom-20 flex flex-col items-center gap-4 z-40">
                                    <button className="group flex flex-col items-center gap-1">
                                        <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-full group-hover:bg-red-500/20 group-hover:text-red-500 transition-all border border-white/10">
                                            <Heart className="w-6 h-6 text-white group-hover:text-red-500 fill-transparent group-hover:fill-red-500 transition-all" />
                                        </div>
                                        <span className="text-xs font-semibold text-white drop-shadow-md">42k</span>
                                    </button>
                                    <button className="group flex flex-col items-center gap-1">
                                        <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-full group-hover:bg-blue-500/20 group-hover:text-blue-500 transition-all border border-white/10">
                                            <MessageCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-xs font-semibold text-white drop-shadow-md">124</span>
                                    </button>
                                    <button className="group flex flex-col items-center gap-1">
                                        <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-full group-hover:bg-green-500/20 group-hover:text-green-500 transition-all border border-white/10">
                                            <Share2 className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-xs font-semibold text-white drop-shadow-md">Share</span>
                                    </button>
                                </div>

                                {/* Bottom Info */}
                                <div className="absolute left-3 bottom-0 right-14 z-40 p-4 pb-6 space-y-3 pointer-events-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 p-0.5 shadow-lg">
                                            <div className="h-full w-full rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold border-2 border-black/20 text-xs">
                                                {(video.repoName?.[0] || "?").toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-white text-base drop-shadow-md flex items-center gap-2">
                                                @{video.repoName.split('/')[0]}
                                                <span className="bg-blue-500 text-[9px] px-1 py-0.5 rounded-full uppercase tracking-tighter">Verified</span>
                                            </h2>
                                            <p className="text-white/60 text-xs italic drop-shadow-sm line-clamp-1">
                                                Summarizing {video.repoName}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-white text-sm line-clamp-3 leading-relaxed drop-shadow-sm opacity-90">
                                        {video.repoDescription || "Mind-blowing repo that will change your life. check it out! 🔥 #coding #github #brainrot"}
                                    </p>

                                    <div className="flex items-center gap-2 pt-1">
                                        <a
                                            href={video.repoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg text-white hover:bg-white/30 transition-all text-xs font-medium shadow-xl"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            Visit Repo
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ))
                )}
            </div>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    )
}

function VideoPlayer({ src, isActive }: { src: string; isActive: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    // Handle Active State & Audio Sync
    useEffect(() => {
        if (!videoRef.current) return;

        if (isActive) {
            // When becoming active, reset and attempt play
            videoRef.current.currentTime = 0;
            const playPromise = videoRef.current.play();

            playPromise
                .then(() => setIsPlaying(true))
                .catch(err => {
                    console.log("Autoplay blocked/failed:", err);
                    setIsPlaying(false);
                });
        } else {
            // When inactive, strictly pause
            videoRef.current.pause();
            setIsPlaying(false);
        }
    }, [isActive]);



    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent bubbling if needed
        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    }

    return (
        <div
            className="relative w-full h-full flex items-center justify-center cursor-pointer group"
            onClick={togglePlay}
        >
            <video
                ref={videoRef}
                src={src}
                loop
                muted={false}
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}
            />

            {/* Play/Pause Indicator (Middle of screen on pause, or flash on toggle) */}
            {!isPlaying && isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                        <PlayCircle className="w-8 h-8 text-white fill-white" />
                    </div>
                </div>
            )}

            {/* Visual background for vertical videos that don't cover everything */}
            <div
                className="absolute inset-0 -z-10 bg-cover bg-center blur-3xl opacity-30 scale-110"
                style={{ backgroundImage: `url(${src})` }}
            />
        </div>
    )
}
