import {
  AlertTriangle,
  ArrowRight,
  Clock,
  GitBranch,
  Link2,
  MousePointer2,
  PlayCircle,
  Star,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    title: 'Choose Character',
    description:
      'Pick the narrator style to match the vibe of your project breakdown.',
    icon: MousePointer2,
  },
  {
    title: 'Get Video',
    description:
      'Generate a short, punchy video summary of the repo in about 10 seconds.',
    icon: PlayCircle,
  },
];

export default function IndexPage() {
  return (
    <main className="relative overflow-hidden bg-[#070f1d] text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute right-[-10%] top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute bottom-[-5%] left-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="container relative z-10 flex flex-col gap-16 pb-24 pt-14 md:pt-20">
        <header className="space-y-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
            <span>Step 1: Repository Input</span>
          </div>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
            Drop That <span className="text-emerald-400">GitHub</span> URL!{' '}
            <span className="text-amber-400">{'\u{1F525}'}</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-300 sm:text-xl">
            Paste any public GitHub repository and watch us turn that code into
            pure brainrot entertainment. No cap!
          </p>
        </header>

        <section className="mx-auto w-full max-w-5xl rounded-3xl border border-emerald-400/40 bg-gradient-to-b from-[#0c1627] to-[#0a1322] p-8 shadow-[0_0_45px_rgba(16,185,129,0.25)]">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.7)]" />
            Repository URL
          </div>
          <p className="mt-2 text-sm text-slate-300">
            Enter a public GitHub repository link
          </p>
          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <Input
              placeholder="https://github.com/awesome/repository"
              className="h-12 rounded-full border-emerald-500/30 bg-white/5 text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-400 focus-visible:ring-offset-0"
            />
            <Button className="h-12 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-400 px-6 text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-400/40">
              Analyze Repository
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
            <AlertTriangle className="h-4 w-4" />
            <span>
              Heads up! Only public repositories can be analyzed. Private repos
              need to be made public first.
            </span>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-emerald-200">
              <Star className="h-5 w-5" />
              <span className="text-lg font-semibold">
                Popular Repositories
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Try these trending projects.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {popularRepos.map((repo) => (
              <Link
                key={repo.name}
                href={repo.href}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-emerald-400/25 bg-[#0d1626] shadow-[0_0_35px_rgba(16,185,129,0.18)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300/40 hover:shadow-[0_0_45px_rgba(16,185,129,0.25)]"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${repo.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-emerald-400/40 bg-black/50 px-3 py-1 text-xs font-semibold text-emerald-200 backdrop-blur">
                    <Star className="h-4 w-4 fill-emerald-300 text-emerald-300" />
                    {repo.stars}
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-emerald-200">
                    <GitBranch className="h-4 w-4" />
                    Popular Repository
                  </div>
                  <h3 className="text-xl font-semibold text-white transition group-hover:text-emerald-200">
                    {repo.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {repo.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {repo.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-emerald-100"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                    {repo.stats.map((stat) => (
                      <span
                        key={`${repo.name}-${stat.label}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1"
                      >
                        {stat.label === 'Updated' ? (
                          <Clock className="h-3.5 w-3.5 text-emerald-200" />
                        ) : (
                          <GitBranch className="h-3.5 w-3.5 text-emerald-200" />
                        )}
                        <span className="font-semibold text-emerald-100">
                          {stat.value}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide text-slate-400">
                          {stat.label}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-200">
            <MousePointer2 className="h-5 w-5" />
            <span className="text-lg font-semibold">How It Works</span>
          </div>
          <div className="rounded-3xl border border-emerald-400/25 bg-gradient-to-r from-[#0d1629] via-[#0c1323] to-[#0b111f] p-6 shadow-[0_0_35px_rgba(16,185,129,0.2)]">
            <div className="grid gap-6 md:grid-cols-3">
              {howItWorks.map((step, index) => (
                <div
                  key={step.title}
                  className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-lg font-bold text-emerald-200">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <step.icon className="h-4 w-4 text-emerald-200" />
                        {step.title}
                      </div>
                      <p className="text-sm text-slate-300">
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
