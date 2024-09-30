import { useLoaderData, Form, redirect } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { supabaseClient } from "~/utils/auth.server";
import { getSession, destroySession } from "~/utils/session.server";
import cover1 from "../resources/pictures/book1.jpg";
import LoginCard from "~/components/auth/LoginCard"; // Import the LoginCard component

const booksData = [
  {
    id: 1,
    title: "Book 1",
    author: "Author 1",
    description: "This is a detailed description of Book 1.",
    coverImage: cover1,
    reviews: ["Great book!", "Loved it!"],
    isAvailableForPurchase: true,
    isAvailableForBorrow: true,
  },
  {
    id: 2,
    title: "Book 2",
    author: "Author 2",
    description: "This is a detailed description of Book 2.",
    coverImage: cover1,
    reviews: ["Amazing read!", "Highly recommend!"],
    isAvailableForPurchase: true,
    isAvailableForBorrow: false,
  },
];

export const loader: LoaderFunction = async ({ request, params }) => {
  const redirectTo = new URL(request.url).pathname;
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("access_token")) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/auth/login?${searchParams}`);
  }

  const { data: user, error: sessionErr } = await supabaseClient.auth.getUser(
    session.get("access_token")
  );

  if (sessionErr || !user) {
    return json({ error: sessionErr });
  }

  const bookId = parseInt(params.id ?? "0", 10);
  const book = booksData.find((b) => b.id === bookId);
  if (!book) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ book, user });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const newReview = formData.get("review");

  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("access_token")) {
    throw redirect("/login");
  }

  const { data: user, error: sessionErr } = await supabaseClient.auth.getUser(
    session.get("access_token")
  );

  if (sessionErr || !user) {
    throw new Error("User not authenticated or session expired");
  }

  const bookId = parseInt(params.id ?? "0", 10);
  const book = booksData.find((b) => b.id === bookId);

  if (!book) {
    throw new Response("Not Found", { status: 404 });
  }

  if (newReview && typeof newReview === "string") {
    book.reviews.push(newReview);
  }

  return redirect(`/books/${bookId}`);
};

export default function BookDetails() {
  const { book, user, error } = useLoaderData<typeof loader>();

  // If the user is not logged in or there was an error, show the LoginCard
  if (!user || error) {
    return <LoginCard />;
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen py-16 px-6">
      <main className="container mx-auto">
        {/* Rest of the book details */}
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src={book.coverImage}
            className="w-full md:w-1/3 h-80 object-cover md:object-cover rounded-l-lg"
          />
          <div className="p-6 md:ml-8 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {book.title}
              </h1>
              <h2 className="text-xl text-gray-500 mb-3">{book.author}</h2>
              <p className="text-base text-gray-700 mb-5 leading-relaxed">
                {book.description}
              </p>
            </div>
            <div className="space-y-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded w-full md:w-auto"
                disabled={!book.isAvailableForPurchase}
              >
                {book.isAvailableForPurchase ? "Buy Now" : "Not Available for Purchase"}
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded w-full md:w-auto"
                disabled={!book.isAvailableForBorrow}
              >
                {book.isAvailableForBorrow ? "Borrow" : "Not Available for Borrowing"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Reviews
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {book.reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white p-5 shadow rounded-lg border border-gray-100"
              >
                <p className="text-gray-800 text-base">{review}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Add Review Section */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Add a Review
          </h3>
          <Form method="post" className="space-y-4">
            <textarea
              name="review"
              rows={3}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write your review here..."
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md"
            >
              Submit Review
            </button>
          </Form>
        </div>
      </main>
    </div>
  );
}
