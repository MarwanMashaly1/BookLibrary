// // src/utils/session.server.ts

// import { createCookieSessionStorage } from "@remix-run/node";

// // Session storage configuration
// export const sessionStorage = createCookieSessionStorage({
//   cookie: {
//     name: "__session",
//     sameSite: "strict",
//     path: "/",
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // Only secure in production
//     secrets: [process.env.SESSION_SECRET!], // Use a strong secret
//     maxAge: 60 * 60 * 24 * 7, // 1 week
//   },
// });

// export const { getSession, commitSession, destroySession } = sessionStorage;

import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "sb:token",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET || "default_secret"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
