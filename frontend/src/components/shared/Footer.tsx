import { Terminal, ShieldCheck } from "lucide-react"

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white py-12 lg:py-16 text-base text-[#64748B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          
          {/* Brand Col (2 spans on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F172A] text-white">
                <Terminal className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-[#0F172A]">
                  DevIntel
                </span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-base font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  Platform
                </span>
              </div>
            </div>
            
            <p className="max-w-sm text-base leading-relaxed text-[#64748B]">
              Developer Intelligence platform powered by public GitHub repositories and AI-driven portfolio analysis. Transforming raw code into actionable career insight.
            </p>

            <div className="flex items-center gap-2 pt-1 text-sm text-emerald-600 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>All AI Intelligence Systems Operational</span>
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#0F172A]">
              Platform
            </h4>
            <ul className="space-y-2 text-base">
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-[#0F172A]">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#for-developers" className="transition-colors hover:text-[#0F172A]">
                  Developer Identity
                </a>
              </li>
              <li>
                <a href="#for-recruiters" className="transition-colors hover:text-[#0F172A]">
                  Recruiter Intelligence
                </a>
              </li>
              <li>
                <a href="#features" className="transition-colors hover:text-[#0F172A]">
                  Career Scoring
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Col */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#0F172A]">
              Resources
            </h4>
            <ul className="space-y-2 text-base">
              <li>
                <a
                  href="https://docs.github.com/en/rest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#0F172A]"
                >
                  GitHub REST & GraphQL API
                </a>
              </li>
              <li>
                <a
                  href="https://ai.google.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#0F172A]"
                >
                  Gemini AI Models
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-[#64748B]">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                  <span>Evidence Engine v3</span>
                </span>
              </li>
              <li>
                <span className="text-[#64748B]">Public Repositories Only</span>
              </li>
            </ul>
          </div>

          {/* Legal / Social Col */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#0F172A]">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-base">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-[#0F172A]"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a href="#privacy" className="transition-colors hover:text-[#0F172A]">
                  Privacy & Data Security
                </a>
              </li>
              <li>
                <a href="#contact" className="transition-colors hover:text-[#0F172A]">
                  Engineering Contact
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#E2E8F0] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#94A3B8]">
          <p>© {new Date().getFullYear()} DevIntel Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Engineered with precision for modern software teams</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
