import { useLoaderData, redirect } from "@remix-run/react";
import { useState } from "react";
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { supabaseClient } from "~/utils/auth.server";
import { getSession, destroySession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const redirectTo = new URL(request.url).pathname;
    const session = await getSession(request.headers.get("Cookie"));

    // Redirect to login if not authenticated
    if (!session.has("access_token")) {
      const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/auth/login?${searchParams}`);
    }

    // Retrieve logged-in user
    const { data: user, error: sessionErr } = await supabaseClient.auth.getUser(
      session.get("access_token")
    );

    if (sessionErr || !user) {
      console.error("Error fetching user:", sessionErr);
      throw new Response("User not found or authentication error", { status: 500 });
    }

    // Log the user ID for debugging purposes
    console.log("Logged-in User ID:", user.user.id);

    // Retrieve the user's location_id from the users table
    const { data: profile, error: profileError } = await supabaseClient
      .from("users")
      .select("location_id")
      .eq("id", user.user.id)

    console.log("Profile:", profile);

    if (profileError || !profile) {
      console.error("Error fetching profile:", profileError);

      // If no profile found, return an empty books list for the UI to render an empty table
      if (profileError.code === 'PGRST116') {
        console.error("No profile found for this user.");
        return json({ books: [], location_id: null });
      }

      throw new Response("Profile not found or error fetching location_id", { status: 500 });
    }

    // Fetch the books based on the user's location_id
    const { data: books, error: booksError } = await supabaseClient
      .from("Books")
      .select("*")
      .eq("location_id", profile[0].location_id);

    if (booksError) {
      console.error("Error fetching books:", booksError);
      throw new Response("Error fetching books", { status: 500 });
    }

    // Return the books and location_id
    return json({ books, location_id: profile[0].location_id });

  } catch (error) {
    console.error("Loader Error:", error);
    throw new Response("Internal Server Error", { status: 500 });
  }
};



export default function AdminBooksPage() {
  const { books, location_id } = useLoaderData();
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Books in Your Location</h1>

      {/* Table of Books */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4">Author</th>
            <th className="py-2 px-4">Stock</th>
            <th className="py-2 px-4">Borrowable</th>
            <th className="py-2 px-4">Buyable</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books && books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id} className="border-t">
                <td className="py-2 px-4">{book.title}</td>
                <td className="py-2 px-4">{book.author}</td>
                <td className="py-2 px-4">{book.stock}</td>
                <td className="py-2 px-4">{book.to_borrow ? "Yes" : "No"}</td>
                <td className="py-2 px-4">{book.to_buy ? "Yes" : "No"}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setShowModal(true);
                      setSelectedBook(book);
                    }}
                  >
                    Edit
                  </button>
                  <form method="post">
                    <input type="hidden" name="id" value={book.id} />
                    <button
                      type="submit"
                      name="intent"
                      value="delete"
                      className="bg-red-500 text-white px-3 py-1 rounded ml-2"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-4 px-4 text-center">
                No books found for your location.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Book Button */}
      <div className="mt-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setShowModal(true);
            setSelectedBook(null);
          }}
        >
          Add Book
        </button>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-2xl font-bold mb-4">
              {selectedBook ? "Edit" : "Add"} Book
            </h2>
            <form method="post">
              <input type="hidden" name="id" value={selectedBook?.id || ""} />
              <div>
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedBook?.title || ""}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div className="mt-2">
                <label>Author</label>
                <input
                  type="text"
                  name="author"
                  defaultValue={selectedBook?.author || ""}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div className="mt-2">
                <label>Description</label>
                <input
                  type="text"
                  name="author"
                  defaultValue={selectedBook?.description || ""}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div className="mt-2">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  defaultValue={selectedBook?.stock || ""}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div className="mt-2">
                <label>To Borrow</label>
                <select
                  name="to_borrow"
                  defaultValue={selectedBook?.to_borrow || "false"}
                  required
                  className="border p-2 w-full"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="mt-2">
                <label>To Buy</label>
                <select
                  name="to_borrow"
                  defaultValue={selectedBook?.to_buy || "false"}
                  required
                  className="border p-2 w-full"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              {/* price */}
              <div className="mt-2">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  defaultValue={selectedBook?.price || ""}
                  required
                  className="border p-2 w-full"
                />
              </div>


              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-3 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  name="intent"
                  value={selectedBook ? "edit" : "add"}
                  className="bg-blue-500 text-white px-3 py-2 rounded"
                >
                  {selectedBook ? "Update" : "Add"} Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
