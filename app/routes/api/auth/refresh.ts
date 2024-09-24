// src/routes/api/auth/refresh.ts
import { json } from "@remix-run/node";
import { getSupabase } from "~/db/supabase.server";

export const action = async ({ request }: { request: Request }) => {
  const { supabase, headers } = await getSupabase(request);
  const { session } = await request.json();

  // Set new session
  await supabase.auth.setSession(session);

  return json({ message: "Session refreshed" }, { headers });
};
