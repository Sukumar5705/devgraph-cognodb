import { Link } from "react-router-dom"
import { ROUTES } from "../routes/paths"
import { Compass, ArrowLeft } from "lucide-react"

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAF7F2]">
      <div className="glass-card shadow-soft p-12 text-center max-w-md w-full space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#036AFF] border border-blue-100 shadow-sm">
          <Compass className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold text-[#141414]">Page Not Found</h1>
          <p className="text-sm sm:text-base text-[#64748B]">
            The requested intelligence report or view could not be located.
          </p>
        </div>
        <div>
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#036AFF] to-[#6366F1] px-5 py-2.5 text-sm font-bold text-white shadow-md hover:opacity-95 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to DevIntel Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
