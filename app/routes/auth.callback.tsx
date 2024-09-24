import { redirect } from "@remix-run/node";
import { getSupabase } from "../db/supabase.server";

export const loader = async ({ request }: { request: Request }) => {
  const { supabase, headers } = getSupabase(request);
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return redirect("/auth/login"); // Redirect to login if there's an error
    }

    // Get the authenticated user after exchanging the code
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      console.error("Error retrieving user after code exchange:", userError);
      return redirect("/auth/login"); // Redirect to login if there's an error
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ authenticated: true })
      .eq("auth_id", userData.user.id);

    if (updateError) {
      console.error("Error updating is_confirmed field:", updateError);
      return redirect("/auth/login"); // Redirect to login if there's an error
    }
  }

  // update a token in the

  return redirect("/", { headers }); // Redirect to the homepage after successful confirmation
};
