import { LoaderFunction, json } from "@remix-run/node";
import { getBooks, SearchParams } from "./getBooks.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  // Parse search parameters
  const searchParams: SearchParams = {
    title: url.searchParams.get("title") || undefined,
    author: url.searchParams.get("author") || undefined,
    category: url.searchParams.get("category") || undefined,
    created_at: url.searchParams.get("created_at") || undefined,
  };

  // Only search if at least one query parameter is provided
  if (Object.values(searchParams).some((value) => value !== undefined)) {
    const books = await getBooks(request, searchParams);
    return json({ books });
  }

  // Return empty books array if no search parameters are provided
  return json({ books: [] });
};
