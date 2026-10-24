import { ArrowUpRight } from 'lucide-react'
import { blogs, profile } from '../data/profile'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { MediumIcon } from '../components/icons'
import { useSpotlight } from '../lib/useSpotlight'

type Post = (typeof blogs)[number]

function PostCard({ post, i, featured }: { post: Post; i: number; featured?: boolean }) {
  const onMove = useSpotlight<HTMLAnchorElement>()
  return (
    <Reveal delay={i % 2} className={featured ? 'lg:col-span-7 lg:row-span-2' : 'lg:col-span-5'}>
      <a
        href={post.url}
        target="_blank"
        rel="noreferrer"
        onPointerMove={onMove}
        className={`spot group flex h-full flex-col rounded-3xl border border-line bg-gradient-to-b from-surface/85 to-surface2/80 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-line-strong ${
          featured ? 'p-7 sm:p-10' : 'p-6 sm:p-7'
        }`}
      >
        <div className="flex items-center justify-between gap-4 font-mono text-[0.7rem] text-dim">
          <span className="flex items-center gap-2">
            {featured && (
              <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.16em] text-cyan">Latest</span>
            )}
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <MediumIcon size={13} /> Medium
          </span>
        </div>

        <h3
          className={`mt-5 text-balance font-medium leading-snug tracking-[-0.025em] transition-colors group-hover:text-white ${
            featured ? 'text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.12]' : 'text-[1.2rem]'
          }`}
        >
          {post.title}
        </h3>
        <p className={`mt-3 leading-relaxed text-muted ${featured ? 'max-w-xl text-[1.02rem]' : 'text-[0.92rem]'}`}>{post.summary}</p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-1.5 text-[0.86rem] font-medium text-fg">
            Read article
            <ArrowUpRight size={16} className="text-cyan transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </a>
    </Reveal>
  )
}

export function Blog() {
  return (
    <section id="blog" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="08"
          label="Blog"
          title={
            <>
              Notes from <span className="text-gradient">production</span>
            </>
          }
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-12">
          {blogs.map((post, i) => (
            <PostCard key={post.url} post={post} i={i} featured={i === 0} />
          ))}
        </div>

        <Reveal className="mt-8 flex justify-center">
          <a href={profile.links.medium} target="_blank" rel="noreferrer" className="btn btn-ghost !h-11">
            <MediumIcon size={16} /> All articles on Medium <ArrowUpRight size={14} className="text-dim" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
