import { ActionFunction, json, redirect } from "@remix-run/node";
import { getSupabase } from "~/db/supabase.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title") as string | undefined;
  const author = formData.get("author") as string | undefined;
  const category = formData.get("category") as string | undefined;
  const created_at = formData.get("created_at") as string | undefined;

  const queryParams = new URLSearchParams();

  if (title) queryParams.append("title", title);
  if (author) queryParams.append("author", author);
  if (category) queryParams.append("category", category);
  if (created_at) queryParams.append("created_at", created_at);

  return redirect(`/search?${queryParams.toString()}`);
};
