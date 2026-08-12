import { useState } from "react"
import { Link } from "react-router-dom"
import { ROUTES } from "../../routes/paths"
import { Terminal, ArrowRight, Menu, X, Sparkles } from "lucide-react"

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleAnalyzeClick = () => {
    setMobileMenuOpen(false)
    const searchInput = document.getElementById("github-username-input")
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" })
      setTimeout(() => {
        searchInput.focus()
      }, 300)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md transition-all">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8"
      >
        {/* Left: Brand + Subtitle Badge */}
        <div className="flex items-center gap-3.5">
          <Link
            to={ROUTES.home}
            className="group flex items-center gap-2.5 text-[#0F172A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
          >
            {/* GitHub-inspired Terminal Icon */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F172A] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Terminal className="h-4.5 w-4.5 text-blue-400" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-[#0F172A]">
                  DevIntel
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-base font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  v3.0
                </span>
              </div>
              <span className="hidden text-base font-normal text-[#64748B] lg:inline-block leading-none mt-0.5">
                Developer Intelligence Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex md:items-center md:gap-1 lg:gap-2 text-base font-medium text-[#64748B]">
          <a
            href="#how-it-works"
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-slate-100 hover:text-[#0F172A]"
          >
            How it Works
          </a>
          <a
            href="#features"
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-slate-100 hover:text-[#0F172A]"
          >
            Features
          </a>
          <a
            href="#for-developers"
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-slate-100 hover:text-[#0F172A]"
          >
            Developer View
          </a>
          <a
            href="#for-recruiters"
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-slate-100 hover:text-[#0F172A]"
          >
            Recruiter View
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors hover:bg-slate-100 hover:text-[#0F172A]"
          >
            <GithubIcon className="h-4 w-4 text-[#64748B]" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Right: Primary Call to Action */}
        <div className="hidden sm:flex sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={handleAnalyzeClick}
            className="group inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-base font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#1D4ED8] hover:shadow active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-blue-200 transition-transform group-hover:rotate-12" />
            <span>Analyze Profile</span>
            <ArrowRight className="h-4 w-4 text-blue-200 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-[#E2E8F0] bg-white px-4 pt-2 pb-4 md:hidden shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-2 py-2">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              How it Works
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Features
            </a>
            <a
              href="#for-developers"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Developer View
            </a>
            <a
              href="#for-recruiters"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Recruiter View
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <GithubIcon className="h-4 w-4 text-slate-700" />
              <span>GitHub</span>
            </a>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAnalyzeClick}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-[#1D4ED8]"
              >
                <Sparkles className="h-4 w-4 text-blue-200" />
                <span>Analyze Profile</span>
                <ArrowRight className="h-4 w-4 text-blue-200" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
