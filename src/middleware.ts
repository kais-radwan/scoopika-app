export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/agents",
    "/boxes",
    "/new-box",
    "/new-agent",
    "/usage",
    "/playground",
  ],
};
