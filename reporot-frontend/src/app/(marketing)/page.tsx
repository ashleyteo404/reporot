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

export default async function IndexPage() {
  const allVideos = await getVideos();
  const videos = allVideos.slice(0, 4);

  return (
    <main className="relative overflow-hidden bg-[#070f1d] text-slate-50 min-h-screen">
      {/* Immersive Background Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute right-[-10%] top-32 h-[600px] w-[600px] rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute bottom-[-5%] left-10 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="container max-w-[1600px] relative z-10 flex flex-col gap-12 px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        {/* Massive Hero Header */}
        <header className="space-y-6 text-center">
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.4)] uppercase tracking-widest">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,1)]" />
            <span>AI Brainrot Engine v2.0</span>
          </div>
          <h1 className="text-5xl font-black leading-[0.9] text-white sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter">
            REPOROT
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300 sm:text-xl md:text-2xl font-medium leading-relaxed">
            Stop reading READMEs. Start watching heat. Fast-paced AI video walkthroughs for any GitHub repository in seconds.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-400 text-slate-900 rounded-full font-black text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(16,185,129,0.5)] active:scale-95"
            >
              🚀 LAUNCH ENGINE
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="/tiktok"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-black text-xl hover:bg-white/10 transition-all active:scale-95 backdrop-blur-md"
            >
              🔥 EXPLORE FEED
            </Link>
          </div>
        </header>

        {/* Dynamic Showcase (Mirror of Dashboard) */}
        <section className="space-y-8 py-10">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <div className="flex items-center gap-2 text-emerald-200">
              <Star className="h-6 w-6 fill-emerald-400 text-emerald-400" />
              <span className="text-2xl font-black text-white uppercase tracking-tight">Recent Heat</span>
            </div>
            <Link href="/tiktok" className="text-xs font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest transition-colors flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {videos.length === 0 ? (
              <div className="col-span-full py-32 text-center border-2 border-dashed border-emerald-500/20 rounded-3xl bg-white/5">
                <p className="text-slate-400 italic text-xl">The feed is currently empty. Be the first to cook some brainrot!</p>
              </div>
            ) : (
              videos.map((video, index) => (
                <Link
                  key={video.id}
                  href={`/tiktok?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-[40px] border border-emerald-400/25 bg-[#0d1626] shadow-[0_0_60px_rgba(16,185,129,0.1)] transition-all duration-700 hover:border-emerald-300/40 hover:-translate-y-3"
                >
                  <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-1000 group-hover:scale-110"
                      style={{ backgroundImage: `url(${REPO_IMAGES[index % REPO_IMAGES.length]})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1626] via-[#0d1626]/20 to-transparent" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-emerald-500/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-emerald-400/40 shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100 duration-500">
                        <PlayCircle className="w-10 h-10 text-emerald-400 fill-emerald-400/20" />
                      </div>
                    </div>

                    <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-emerald-400/30 bg-black/60 px-4 py-1.5 text-xs font-black text-emerald-200 backdrop-blur-xl uppercase tracking-widest shadow-2xl">
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      {video.subtitleStyle}
                    </div>
                  </div>

                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-emerald-400/80 font-black">
                      <Github className="h-4 w-4" />
                      Community Favorite
                    </div>
                    <h3 className="text-3xl font-black text-white group-hover:text-emerald-400 transition tracking-tighter sm:text-4xl truncate">
                      {video.repoName}
                    </h3>
                    <p className="text-base leading-relaxed text-slate-400 line-clamp-2 font-medium">
                      {video.repoDescription || `Mind-blowing brainrot summary of the ${video.repoName} repository. Experience the future of dev docs.`}
                    </p>

                    <div className="pt-6 flex items-center justify-between border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-sm border border-emerald-400/30">
                          {(video.repoName?.[0] || '?').toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-sm tracking-tight">{video.repoName.split('/')[0]}</span>
                          <span className="text-xs text-slate-500 font-mono">
                            {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Active now'}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-emerald-400 font-black flex items-center gap-2 transition-all group-hover:gap-4 uppercase tracking-[0.2em]">
                        Watch Now <ArrowRight className="h-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* How It Works (Premium Refresh) */}
        <section className="space-y-8 py-10">
          <div className="flex items-center gap-1.5 text-emerald-200">
            <MousePointer2 className="h-5 w-5" />
            <span className="text-lg font-bold uppercase tracking-widest text-emerald-400/60">System Protocol</span>
          </div>
          <div className="rounded-[40px] border border-emerald-400/25 bg-gradient-to-r from-[#0d1629] via-[#0c1323] to-[#0b111f] p-4 shadow-[0_0_60px_rgba(16,185,129,0.15)] sm:p-6 lg:p-8">
            <div className="grid gap-6 md:grid-cols-3">
              {howItWorks.map((step, index) => (
                <div
                  key={step.title}
                  className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-500/10 text-xl font-black text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      {index + 1}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-widest">
                        <step.icon className="h-5 w-5 text-emerald-200" />
                        {step.title}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-400 font-medium">
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

      <footer className="container max-w-[1600px] relative z-10 px-4 py-20 text-center border-t border-white/5">
        <p className="text-slate-500 font-mono text-sm tracking-tighter">
          © 2026 REPOROT AI // BUILT FOR THE CULTURE // NO CAP
        </p>
      </footer>
    </main>
  );
}
