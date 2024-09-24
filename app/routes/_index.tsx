import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import hero from "../resources/pictures/hero_drk.jpg";
import cover1 from "../resources/pictures/book1.jpg";
import cover2 from "../resources/pictures/book2.jpg";

// Mock data for featured books and testimonials
const featuredBooks = [
  {
    id: 1,
    title: "Riyad As-Saliheen",
    author: "Imam An-Nawawi",
    coverImage: cover1,
  },
  {
    id: 2,
    title: "The Sealed Nectar",
    author: "",
    coverImage: cover2,
  },
  {
    id: 3,
    title: "Riyad As-Saliheen",
    author: "Imam An-Nawawi",
    coverImage: cover1,
  },
];

// Loader function to fetch data for the home page
export const loader: LoaderFunction = async () => {
  return json({ featuredBooks });
};

export default function Index() {
  const { featuredBooks } = useLoaderData<typeof loader>();

  return (
    <div className="font-sans">
      <main>
        {/* Hero Section */}
        <section
          className="hero-section bg-cover bg-center text-white py-64"
          style={{ backgroundImage: `url(${hero})` }}
        >
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to Our Library</h1>
            <p className="text-xl mb-8">
              Discover a vast collection of Islamic and Arabic books
            </p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Explore Now
            </button>
          </div>
        </section>

        {/* Search Bar */}
        <section className="py-8 bg-gray-100">
          <div className="container mx-auto flex justify-center">
            <input
              type="text"
              placeholder="Search for books..."
              className="border p-2 w-full max-w-md rounded-l"
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-r">
              Search
            </button>
          </div>
        </section>

        {/* Featured Books */}
        {/* Featured Books */}
        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Featured Books
            </h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl w-full">
                {featuredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="border p-4 rounded-lg shadow-lg w-full"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="mb-4 w-full h-64 object-cover rounded"
                    />
                    <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                    <p className="text-gray-700">{book.author}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Categories</h2>
            <ul className="flex flex-wrap justify-center gap-4">
              <li>
                <Link
                  to="/category/quran"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Quran
                </Link>
              </li>
              <li>
                <Link
                  to="/category/hadith"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Hadith
                </Link>
              </li>
              <li>
                <Link
                  to="/category/fiqh"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Fiqh
                </Link>
              </li>
              <li>
                <Link
                  to="/category/history"
                  className="text-blue-500 hover:text-blue-700"
                >
                  History
                </Link>
              </li>
              <li>
                <Link
                  to="/category/literature"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Literature
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
