import {
  AlertTriangle,
  ArrowRight,
  Clock,
  GitBranch,
  Link2,
  MousePointer2,
  PlayCircle,
  Star,
  Video,
} from 'lucide-react';
import Link from 'next/link';

import { VideoGenerator } from '@/components/video-generator';

const popularRepos = [
  {
    name: 'facebook/react',
    description:
      'Declarative UIs for web and native. Build user interfaces from small, isolated pieces of code called components.',
    stars: '206k',
    stats: [
      { label: 'Forks', value: '3k' },
      { label: 'Open issues', value: '52' },
      { label: 'Updated', value: '10d' },
    ],
    topics: ['JavaScript', 'Library'],
    href: 'https://github.com/facebook/react',
    image:
      'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'tensorflow/tensorflow',
    description:
      'End-to-end open source platform for machine learning, used across research and production.',
    stars: '182k',
    stats: [
      { label: 'Forks', value: '8k' },
      { label: 'Open issues', value: '120' },
      { label: 'Updated', value: '5d' },
    ],
    topics: ['Python', 'Machine Learning'],
    href: 'https://github.com/tensorflow/tensorflow',
    image:
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'vuejs/vue',
    description:
      'Progressive framework for building user interfaces. Approachable, versatile, and performant.',
    stars: '204k',
    stats: [
      { label: 'Forks', value: '4k' },
      { label: 'Open issues', value: '38' },
      { label: 'Updated', value: '6d' },
    ],
    topics: ['JavaScript', 'Framework'],
    href: 'https://github.com/vuejs/vue',
    image:
      'https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'vinta/awesome-python',
    description:
      'A curated list of awesome Python frameworks, libraries, software, and resources.',
    stars: '202k',
    stats: [
      { label: 'Forks', value: '3k' },
      { label: 'Open issues', value: '5' },
      { label: 'Updated', value: '2d' },
    ],
    topics: ['Python', 'Resources'],
    href: 'https://github.com/vinta/awesome-python',
    image:
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
  },
];

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

export default async function DashboardPage() {
  return (
    <main className="relative overflow-hidden bg-[#070f1d] text-slate-50 min-h-screen">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute right-[-10%] top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute bottom-[-5%] left-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="container relative z-10 flex flex-col gap-6 px-4 pb-12 pt-10 sm:gap-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
        <header className="space-y-3 text-center sm:space-y-4">
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            <span>Meme Video Dashboard</span>
          </div>
          <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl uppercase tracking-tighter">
            REPOROT DASHBOARD
          </h1>
          <p className="mx-auto max-w-xl text-sm text-slate-300 sm:text-base">
            Turn your GitHub repos into viral content. The dashboard is now fully synced with your premium look.
          </p>
        </header>

        <div className="flex justify-center gap-4">
          <Link
            href="/tiktok"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-400 text-slate-900 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            🔥 View Global Feed
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all"
          >
            Landing Page
          </Link>
        </div>

        <section className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-1.5 text-emerald-200">
            <Video className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-sm font-semibold sm:text-base uppercase tracking-widest text-emerald-400/80">Generator Engine</span>
          </div>

          <div className="rounded-2xl border border-emerald-400/25 bg-gradient-to-b from-[#0d1629] to-[#080f1d] p-6 shadow-[0_0_50px_rgba(16,185,129,0.15)] sm:p-10">
            <VideoGenerator />
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-sm font-semibold sm:text-base">
                Popular Repositories
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {popularRepos.map((repo) => (
              <div
                key={repo.name}
                className="group overflow-hidden rounded-xl border border-emerald-400/25 bg-[#0d1626] shadow-[0_0_30px_rgba(16,185,129,0.18)] transition duration-300 hover:border-emerald-300/40 sm:rounded-2xl"
              >
                <div className="relative h-32 w-full overflow-hidden sm:h-36">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${repo.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-emerald-400/40 bg-black/50 px-2 py-0.5 text-xs font-semibold text-emerald-200 backdrop-blur sm:right-3 sm:top-3 sm:px-2.5 sm:py-1">
                    <Star className="h-3.5 w-3.5 fill-emerald-300 text-emerald-300 sm:h-4 sm:w-4" />
                    {repo.stars}
                  </div>
                </div>

                <div className="space-y-2 p-3 sm:p-4">
                  <h3 className="text-base font-semibold text-white group-hover:text-emerald-200 transition sm:text-lg">
                    {repo.name}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                    {repo.description}
                  </p>
                </div>
              </div>
            ))}
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
