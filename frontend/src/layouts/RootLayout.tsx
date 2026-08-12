import { Outlet } from "react-router-dom"

/**
 * Wraps every route. Deliberately minimal — the Landing Page needs full
 * control of its own chrome (custom navbar, full-bleed hero), so we don't
 * force a shared header here. Username-scoped views get their own
 * DashboardLayout nested below instead.
 */
export function RootLayout() {
  return <Outlet />
}
