// apps/Books/books.tsx
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import SidebarFilters from "./sidebarFilters";
import BookList from "./bookList";

// Mock data for books
const books = [
  {
    id: 1,
    title: "Book 1",
    author: "Author 1",
    coverImage: "/path/to/cover1.jpg",
    description: "Description of Book 1",
  },
  {
    id: 2,
    title: "Book 2",
    author: "Author 2",
    coverImage: "/path/to/cover2.jpg",
    description: "Description of Book 2",
  },
];

// Loader function to fetch data for the books page
export const loader: LoaderFunction = async () => {
  return json({ books });
};

export default function Books() {
  const { books } = useLoaderData<typeof loader>();

  return (
    <div className="font-sans">
      <main className="flex">
        <aside className="w-1/4 p-4">
          <SidebarFilters />
        </aside>
        <section className="w-3/4 p-4">
          <BookList books={books} />
        </section>
      </main>
    </div>
  );
}
