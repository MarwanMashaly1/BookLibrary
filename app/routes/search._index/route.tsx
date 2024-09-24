import { Form, useLoaderData } from "@remix-run/react";

export default function AdvancedSearchPage() {
  const data = useLoaderData<typeof import("./loader").loader>();
  const books = data?.books || [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Advanced Book Search
      </h1>

      <Form
        method="get"
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Search by title"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700"
            >
              Author
            </label>
            <input
              type="text"
              name="author"
              id="author"
              placeholder="Search by author"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <input
              type="text"
              name="category"
              id="category"
              placeholder="Search by category"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="created_at"
              className="block text-sm font-medium text-gray-700"
            >
              Created At
            </label>
            <input
              type="date"
              name="created_at"
              id="created_at"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Search
        </button>
      </Form>

      {books.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
          <ul className="space-y-4">
            {books.map((book: any) => (
              <li
                key={book.id}
                className="bg-gray-100 p-4 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-bold">{book.title}</h3>
                <p className="text-sm">Author: {book.author}</p>
                <p className="text-sm">Category: {book.category}</p>
                <p className="text-sm">
                  Published: {new Date(book.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : data ? (
        <div className="mt-8 text-center text-gray-500">
          No books found. Please refine your search.
        </div>
      ) : null}
    </div>
  );
}
