// /routes/search._index/getBooks.server.ts
import { getSupabase } from "~/db/supabase.server";

export interface SearchParams {
  title?: string;
  author?: string;
  category?: string;
  created_at?: string;
}

export async function getBooks(request: Request, params: SearchParams) {
  const { supabase } = getSupabase(request);

  let query = supabase.from("books").select("*");

  if (params.title) {
    query = query.ilike("title", `%${params.title}%`);
  }
  if (params.author) {
    query = query.ilike("author", `%${params.author}%`);
  }
  if (params.category) {
    query = query.ilike("category", `%${params.category}%`);
  }
  if (params.created_at) {
    query = query.gte("created_at", params.created_at);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Error fetching books: ${error.message}`);
  }

  return data || [];
}
