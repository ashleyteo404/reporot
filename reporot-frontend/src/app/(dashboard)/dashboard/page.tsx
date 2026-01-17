import {
  AlertTriangle,
  ArrowRight,
  Clock,
  GitBranch,
  Github,
  Link2,
  MousePointer2,
  PlayCircle,
  Star,
  Video,
} from 'lucide-react';
import Link from 'next/link';

import { VideoGenerator } from '@/components/video-generator';
import { getVideos } from '@/app/actions/video';

const howItWorks = [
  {
    title: 'Paste URL',
    description:
      'Drop in any public GitHub link and we fetch the repository details instantly.',
    icon: Link2,
  },
  {
    title: 'Choose Style',
    description:
      'Pick between Brainrot or Standard subtitle styles to match your vibe.',
    icon: MousePointer2,
  },
  {
    title: 'Get Video',
    description:
      'Generate a short, punchy video summary of the repo with AI narration.',
    icon: PlayCircle,
  },
];

const REPO_IMAGES = [
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
];

export default async function DashboardPage() {
  const allVideos = await getVideos();
  const videos = allVideos.slice(0, 4);

  return (
    <main className="relative overflow-hidden bg-[#070f1d] text-slate-50 min-h-screen">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute right-[-10%] top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute bottom-[-5%] left-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="container max-w-[1600px] relative z-10 flex flex-col gap-6 px-4 pb-12 pt-10 sm:gap-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
        <header className="space-y-3 text-center sm:space-y-4">
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            <span>Meme Video Dashboard</span>
          </div>
          <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter">
            REPOROT DASHBOARD
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-lg">
            Turn your GitHub repos into viral content. The dashboard is now fully synced with your premium look.
          </p>
        </header>

        <div className="flex justify-center gap-4">
          <Link
            href="/tiktok"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-400 text-slate-900 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.5)]"
          >
            🔥 View Global Feed
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all"
          >
            Landing Page
          </Link>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-1.5 text-emerald-200">
            <Video className="h-4 w-4" />
            <span className="text-base font-semibold uppercase tracking-widest text-emerald-400/80">Generator Engine</span>
          </div>

          <div className="rounded-3xl border border-emerald-400/25 bg-gradient-to-b from-[#0d1629] to-[#080f1d] p-6 shadow-[0_0_60px_rgba(16,185,129,0.2)] sm:p-12">
            <VideoGenerator />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Star className="h-5 w-5" />
              <span className="text-xl font-bold text-white uppercase tracking-tight">
                Your Brainrot Collection
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {videos.length === 0 ? (
              <div className="col-span-full py-32 text-center border-2 border-dashed border-emerald-500/20 rounded-3xl bg-white/5">
                <p className="text-slate-400 italic text-lg">No videos generated yet. Drop a URL above to start cooking!</p>
              </div>
            ) : (
              videos.map((video, index) => (
                <Link
                  key={video.id}
                  href={`/tiktok?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-3xl border border-emerald-400/25 bg-[#0d1626] shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all duration-500 hover:border-emerald-300/40 hover:-translate-y-2"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${REPO_IMAGES[index % REPO_IMAGES.length]})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1626] via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-emerald-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-emerald-400/40 opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100 duration-500">
                        <PlayCircle className="w-8 h-8 text-emerald-400 fill-emerald-400/20" />
                      </div>
                    </div>

                    <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-black/60 px-3 py-1 text-[10px] font-black text-emerald-200 backdrop-blur-lg uppercase tracking-widest shadow-xl">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {video.subtitleStyle}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-black">
                      <Github className="h-3 w-3" />
                      Repository Found
                    </div>
                    <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition truncate tracking-tight">
                      {video.repoName}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-400 line-clamp-2">
                      {video.repoDescription || `Mind-blowing brainrot summary of the ${video.repoName} repository. Witness the power of automated content creation.`}
                    </p>

                    <div className="pt-4 flex items-center justify-between border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs border border-emerald-400/20">
                          {(video.repoName?.[0] || '?').toUpperCase()}
                        </div>
                        <span className="text-xs text-slate-500 font-mono">
                          {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-black flex items-center gap-1.5 transition-all group-hover:gap-2.5">
                        WATCH NOW <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-1.5 text-emerald-200">
            <MousePointer2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-sm font-semibold sm:text-base">How It Works</span>
          </div>
          <div className="rounded-xl border border-emerald-400/25 bg-[#0d1629] p-3 shadow-[0_0_30px_rgba(16,185,129,0.2)] sm:rounded-2xl sm:p-4">
            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              {howItWorks.map((step, index) => (
                <div
                  key={step.title}
                  className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/5 p-3 sm:p-3.5"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-sm font-bold text-emerald-200 sm:h-9 sm:w-9 sm:text-base">
                      {index + 1}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white sm:text-sm">
                        <step.icon className="h-3.5 w-3.5 shrink-0 text-emerald-200 sm:h-4 sm:w-4" />
                        {step.title}
                      </div>
                      <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
