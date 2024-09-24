// auth.server.ts
import { createClient } from "@supabase/supabase-js";
import { getSession } from "./session.server";

// see documention about using .env variables
// https://remix.run/docs/en/v1/guides/envvars#server-environment-variables
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

export const supabaseClient = createClient(supabaseUrl, supabaseKey);
/**
 *
 * @param {*} request
 * @returns
 */

export const hasAuthSession = async (request) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("access_token")) {
    throw Error("No session");
  }

  // Set the session's access token to the Supabase client
  const token = session.get("access_token");
  await supabaseClient.auth.setSession({ access_token: token, refresh_token: "" });

  // Optionally return the session if you need user data elsewhere
  return session;
};

export const getAuthSession = async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session;
};