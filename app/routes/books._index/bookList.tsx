// apps/Books/bookList.tsx
import { Link } from "@remix-run/react";

const bookList = ({
  books,
}: {
  books: Array<{
    id: number;
    title: string;
    author: string;
    coverImage: string;
    description: string;
  }>;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {books.map((book) => (
        <div key={book.id} className="border p-4 rounded-lg shadow-lg">
          <img
            src={book.coverImage}
            alt={book.title}
            className="mb-4 w-full h-64 object-cover rounded"
          />
          <h3 className="text-xl font-bold mb-2">{book.title}</h3>
          <p className="text-gray-700 mb-2">{book.author}</p>
          <p className="text-gray-600 mb-4">{book.description}</p>
          <Link
            to={`/books/${book.id}`}
            className="text-blue-500 hover:text-blue-700"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default bookList;
