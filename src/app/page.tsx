import Image from "next/image";
import BuilderDemo from "@/components/BuilderDemo";
import InterviewDemo from "@/components/InterviewDemo";
import LeadGenDemo from "@/components/LeadGenDemo";
import Nav from "@/components/Nav";
import Section from "@/components/Section";
import {
  type FeaturedProject,
  education,
  experience,
  featuredProjects,
  profile,
  projects,
  skills,
  stats,
} from "@/data/resume";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
      {children}
    </span>
  );
}

function Check() {
  return (
    <svg className="mt-1 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.58l7.3-7.3a1 1 0 011.4 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5a11.5 11.5 0 00-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 015.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0012 .5z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const socials = [
  { label: "LinkedIn", href: profile.linkedin, Icon: LinkedInIcon },
  { label: "GitHub", href: profile.github, Icon: GitHubIcon },
];

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(37,99,235,0.12),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(59,130,246,0.18),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(100,116,139,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.08)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent)]"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div className="relative w-fit lg:order-last">
          <div
            aria-hidden
            className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-transparent blur-2xl"
          />
          <Image
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            width={400}
            height={400}
            priority
            className="h-28 w-28 rounded-2xl object-cover shadow-xl ring-1 ring-slate-900/10 sm:h-36 sm:w-36 lg:h-80 lg:w-80 lg:rounded-3xl dark:ring-white/10"
          />
          <div className="absolute -bottom-4 -left-6 hidden rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur lg:block dark:border-slate-700 dark:bg-slate-900/90">
            <p className="text-2xl font-bold leading-none text-slate-900 dark:text-white">10+</p>
            <p className="mt-1 text-xs text-slate-500">years shipping software</p>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Open to senior & lead engineering roles
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white">
            {profile.name}
          </h1>
          <p className="mt-4 text-xl font-medium text-blue-600 sm:text-2xl dark:text-blue-400">{profile.role}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            I design and ship <span className="font-medium text-slate-900 dark:text-white">multi-tenant SaaS platforms</span>{" "}
            and <span className="font-medium text-slate-900 dark:text-white">high-concurrency systems</span> with React,
            Node.js, TypeScript and AWS — from system design to production.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Get in touch
            </a>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-slate-600"
            >
              Download Resume
            </a>
            <div className="flex gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="grid h-[46px] w-[46px] place-items-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <p className="mt-10 flex items-center gap-2 text-sm text-slate-500">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {profile.location}
          </p>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="About" title="Engineering with ownership">
      <div className="grid gap-12 lg:grid-cols-5">
        <div className="space-y-5 text-lg leading-relaxed text-slate-600 lg:col-span-3 dark:text-slate-400">
          <p>{profile.summary}</p>
          <p>
            Over the last decade I&apos;ve moved from building client websites to owning the architecture of enterprise
            SaaS products — translating PRDs into system design, leading small teams, and working directly with clients
            to validate direction.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-4 lg:col-span-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <dt className="text-sm text-slate-500">{s.label}</dt>
              <dd className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="Technical toolkit" className="bg-slate-50 dark:bg-slate-900/40">
      <div className="grid gap-6 sm:grid-cols-2">
        {skills.map((g) => (
          <div
            key={g.group}
            className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white">{g.group}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {g.items.map((i) => (
                <Tag key={i}>{i}</Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <ol className="relative space-y-12 border-l border-slate-200 pl-8 dark:border-slate-800">
        {experience.map((job, i) => (
          <li key={job.company} className="relative">
            <span
              className={`absolute -left-[37px] top-1.5 h-3 w-3 rounded-full ring-4 ring-white dark:ring-slate-950 ${
                i === 0 ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{job.title}</h3>
              <p className="font-mono text-sm text-slate-500">{job.period}</p>
            </div>
            <p className="mt-1 font-medium text-blue-600 dark:text-blue-400">
              {job.company} <span className="font-normal text-slate-500">· {job.location}</span>
            </p>
            <p className="mt-3 italic text-slate-600 dark:text-slate-400">{job.blurb}</p>
            <ul className="mt-4 space-y-2.5">
              {job.highlights.map((h) => (
                <li key={h} className="flex gap-3 leading-relaxed">
                  <Check />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}

const demos = { builder: BuilderDemo, interview: InterviewDemo, leadgen: LeadGenDemo };

function FeaturedCard({ p, flip }: { p: FeaturedProject; flip: boolean }) {
  const Demo = demos[p.demo];
  return (
    <article
      className={`grid items-center gap-10 overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 sm:p-10 dark:border-slate-800 dark:bg-slate-900 ${
        flip ? "lg:grid-cols-[1.15fr_1fr]" : "lg:grid-cols-[1fr_1.15fr]"
      }`}
    >
      <div className={flip ? "lg:order-2" : ""}>
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Featured project{p.period && <span className="normal-case tracking-normal"> · {p.period}</span>}
        </p>
        <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{p.title}</h3>
        <p className="mt-2 font-medium text-blue-600 dark:text-blue-400">{p.subtitle}</p>
        {p.metric && (
          <p className="mt-4 inline-flex w-fit rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            {p.metric}
          </p>
        )}
        <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-400">{p.summary}</p>
        <ul className="mt-5 space-y-2 text-sm">
          {p.highlights.map((h) => (
            <li key={h} className="flex gap-3 leading-relaxed">
              <Check />
              <span>{h}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      </div>
      <Demo />
    </article>
  );
}

function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title="Selected work" className="bg-slate-50 dark:bg-slate-900/40">
      <div className="mb-6 space-y-6">
        {featuredProjects.map((p, i) => (
          <FeaturedCard key={p.title} p={p} flip={i % 2 === 1} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.title}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 transition-shadow hover:shadow-lg hover:shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30"
          >
            {p.period && <p className="mb-2 font-mono text-xs text-slate-500">{p.period}</p>}
            <h3 className="text-lg font-semibold leading-snug text-slate-900 dark:text-white">{p.title}</h3>
            {p.metric && (
              <p className="mt-3 inline-flex w-fit rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                {p.metric}
              </p>
            )}
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">{p.summary}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 leading-relaxed">
                  <Check />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-2 pt-6">
              {p.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Academic background">
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-7 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{education.degree}</h3>
          <p className="mt-1 text-slate-600 dark:text-slate-400">{education.school}</p>
        </div>
        <p className="font-mono text-sm text-slate-500">{education.year}</p>
      </div>
    </Section>
  );
}

function Contact() {
  const items = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    { label: "LinkedIn", value: "in/rizwan-shaikh", href: profile.linkedin, external: true },
    { label: "GitHub", value: "@rizwan-js-dev", href: profile.github, external: true },
  ];
  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="rounded-3xl bg-slate-900 px-6 py-14 text-center sm:px-12 dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-blue-400">Contact</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Let&apos;s build something</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Looking for a senior engineer to own architecture, lead delivery, and scale your platform? I&apos;d love to
            hear about it.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="rounded-xl border border-slate-700 px-4 py-5 transition-colors hover:border-blue-500 hover:bg-slate-800"
              >
                <p className="text-xs uppercase tracking-wider text-slate-500">{c.label}</p>
                <p className="mt-1 break-all font-medium text-white">{c.value}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <footer className="border-t border-slate-200 py-8 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 text-sm text-slate-500 sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <div className="flex items-center gap-4">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
            <span>Built with Next.js & Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </>
  );
}
