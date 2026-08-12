export const ROUTES = {
  home: "/",
  developer: (username = ":username") => `/${username}`,
  network: (username = ":username") => `/${username}/network`,
  connections: "/connections",
} as const
