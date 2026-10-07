import Link from 'next/link'

const steps = [
  {
    n: '1',
    title: 'Make a profile',
    text: 'Add your skills, your experience and a link to your resume. You do it once.',
  },
  {
    n: '2',
    title: 'Find something good',
    text: 'Search by title or keyword, read the details, and apply with one click.',
  },
  {
    n: '3',
    title: 'Know where you stand',
    text: 'Every application shows its status, from pending to interview, in your dashboard.',
  },
]

const popular = ['Frontend', 'Designer', 'DevOps', 'Remote', 'Intern']

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-800">
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-zinc-900">
            Careera<span className="text-red-600">.</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/jobs" className="hover:text-red-600">
              Browse jobs
            </Link>
            <Link href="/register?role=recruiter" className="hidden hover:text-red-600 sm:inline">
              Post a job
            </Link>
            <Link href="/login" className="hover:text-red-600">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
            >
              Join free
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-20 pt-20 md:pt-28">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-red-600">
          A simple job board
        </p>
        <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-zinc-900 md:text-6xl">
          Find work you&apos;d actually look forward to.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-600">
          Careera keeps things straightforward. Build one profile, apply in a click, and keep track
          of every application in one place.
        </p>

        <form action="/jobs" method="get" className="mt-10 flex max-w-xl gap-2">
          <input
            name="search"
            placeholder="Job title or keyword"
            className="w-full rounded border border-zinc-300 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
          />
          <button className="rounded bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700">
            Search
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-500">
          Popular:{' '}
          {popular.map((p, i) => (
            <span key={p}>
              <Link
                href={`/jobs?search=${encodeURIComponent(p)}`}
                className="underline decoration-zinc-300 underline-offset-4 hover:text-red-600"
              >
                {p}
              </Link>
              {i < popular.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-serif text-3xl font-bold text-zinc-900">How it works</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <div className="font-serif text-5xl font-bold text-red-600">{s.n}</div>
                <h3 className="mt-3 text-lg font-semibold text-zinc-900">{s.title}</h3>
                <p className="mt-2 text-zinc-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2">
        <div className="border-t-4 border-red-600 pt-6">
          <h2 className="font-serif text-2xl font-bold text-zinc-900">If you&apos;re looking</h2>
          <ul className="mt-4 space-y-2 text-zinc-600">
            <li>Browse open roles without creating an account.</li>
            <li>Apply with the resume link saved in your profile.</li>
            <li>See which roles fit your skills best.</li>
          </ul>
          <Link
            href="/register?role=seeker"
            className="mt-6 inline-block font-medium text-red-600 underline underline-offset-4 hover:text-red-700"
          >
            Create a profile
          </Link>
        </div>
        <div className="border-t-4 border-zinc-900 pt-6">
          <h2 className="font-serif text-2xl font-bold text-zinc-900">If you&apos;re hiring</h2>
          <ul className="mt-4 space-y-2 text-zinc-600">
            <li>Post a role in a few minutes.</li>
            <li>See every applicant and their match with your requirements.</li>
            <li>Move people through review, interview and offer.</li>
          </ul>
          <Link
            href="/register?role=recruiter"
            className="mt-6 inline-block font-medium text-zinc-900 underline underline-offset-4 hover:text-red-600"
          >
            Post a job
          </Link>
        </div>
      </section>

      <section className="bg-red-600">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <h2 className="font-serif text-3xl font-bold text-white">Ready when you are.</h2>
          <p className="mx-auto mt-3 max-w-lg text-red-50">
            Free to join. It takes a minute to set up.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded bg-white px-8 py-3 font-semibold text-red-700 hover:bg-red-50"
          >
            Create an account
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-zinc-500 sm:flex-row">
          <span className="font-serif text-lg font-bold text-zinc-900">
            Careera<span className="text-red-600">.</span>
          </span>
          <div className="flex gap-6">
            <Link href="/jobs" className="hover:text-red-600">Jobs</Link>
            <Link href="/register?role=recruiter" className="hover:text-red-600">Employers</Link>
            <Link href="/login" className="hover:text-red-600">Sign in</Link>
          </div>
          <span>© {new Date().getFullYear()} Careera</span>
        </div>
      </footer>
    </div>
  )
}