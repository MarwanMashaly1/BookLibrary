// /app/routes/books/$id.tsx
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

// Mock data - Replace this with actual data fetching
const booksData = [
  {
    id: 1,
    title: "Book 1",
    author: "Author 1",
    description: "This is a detailed description of Book 1.",
    coverImage: "/path/to/cover1.jpg",
    reviews: ["Great book!", "Loved it!"],
    isAvailableForPurchase: true,
    isAvailableForBorrow: true,
  },
  {
    id: 2,
    title: "Book 2",
    author: "Author 2",
    description: "This is a detailed description of Book 2.",
    coverImage: "/path/to/cover2.jpg",
    reviews: ["Amazing read!", "Highly recommend!"],
    isAvailableForPurchase: true,
    isAvailableForBorrow: false,
  },
];

export const loader: LoaderFunction = async ({ params }) => {
  console.log(params);
  const bookId = parseInt(params.id ?? "0", 10);
  console.log(bookId);
  const book = booksData.find((b) => b.id === bookId);
  console.log(book);
  if (!book) {
    throw new Response("Not Found", { status: 404 });
  }
  return json(book);
};

export default function BookDetails() {
  const book = useLoaderData<typeof loader>();

  return (
    <div className="font-sans">
      <main className="container mx-auto py-16 px-4">
        <div className="flex flex-col md:flex-row">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full md:w-1/3 h-auto object-cover rounded-lg shadow-md mb-8 md:mb-0"
          />
          <div className="md:ml-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {book.title}
            </h1>
            <h2 className="text-2xl text-gray-600 mb-4">{book.author}</h2>
            <p className="text-lg text-gray-700 mb-8">{book.description}</p>

            <div className="space-y-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={!book.isAvailableForPurchase}
              >
                {book.isAvailableForPurchase
                  ? "Buy Now"
                  : "Not Available for Purchase"}
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                disabled={!book.isAvailableForBorrow}
              >
                {book.isAvailableForBorrow
                  ? "Borrow"
                  : "Not Available for Borrowing"}
              </button>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Reviews</h3>
              <ul className="list-disc list-inside">
                {book.reviews.map((review, index) => (
                  <li key={index} className="text-gray-700">
                    {review}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
