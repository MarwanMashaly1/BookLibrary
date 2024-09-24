// import { useState } from "react";
// import { useLoaderData, Form } from "@remix-run/react";
// import { json } from "@remix-run/node";
// import { getSupabase } from "~/db/supabase.server";

// export const loader = async ({ request }) => {
//   const { supabase } = getSupabase(request);

//   // Fetch user details and books
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   const { data: books, error } = await supabase
//     .from("Books")
//     .select("*")
//     .eq("location_id", user.location_id);

//   if (error) throw new Response("Error fetching books", { status: 500 });
//   return json({ books });
// };

// export default function AdminBooksPage() {
//   const { books } = useLoaderData();
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [editingBook, setEditingBook] = useState(null);

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-3xl font-semibold mb-6">Manage Books</h1>

//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => {
//             setModalOpen(true);
//             setEditingBook(null);
//           }}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Add Book
//         </button>
//       </div>

//       {/* Books Table */}
//       <div className="overflow-x-auto">
//         <table className="table-auto w-full bg-white shadow-md rounded">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2">ID</th>
//               <th className="px-4 py-2">Title</th>
//               <th className="px-4 py-2">Author</th>
//               <th className="px-4 py-2">Stock</th>
//               <th className="px-4 py-2">To Borrow</th>
//               <th className="px-4 py-2">To Buy</th>
//               <th className="px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {books.map((book) => (
//               <tr key={book.id} className="border-t">
//                 <td className="px-4 py-2">{book.id}</td>
//                 <td className="px-4 py-2">{book.title}</td>
//                 <td className="px-4 py-2">{book.author}</td>
//                 <td className="px-4 py-2">{book.stock}</td>
//                 <td className="px-4 py-2">{book.to_borrow ? "Yes" : "No"}</td>
//                 <td className="px-4 py-2">{book.to_buy ? "Yes" : "No"}</td>
//                 <td className="px-4 py-2 flex space-x-2">
//                   <button
//                     onClick={() => {
//                       setEditingBook(book);
//                       setModalOpen(true);
//                     }}
//                     className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
//                   >
//                     Edit
//                   </button>
//                   <Form method="post" action="/admin/books/delete">
//                     <input type="hidden" name="id" value={book.id} />
//                     <button
//                       type="submit"
//                       className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
//                     >
//                       Delete
//                     </button>
//                   </Form>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add/Edit Modal */}
//       {isModalOpen && (
//         <AddEditBookModal
//           book={editingBook}
//           closeModal={() => setModalOpen(false)}
//         />
//       )}
//     </div>
//   );
// }

// function AddEditBookModal({ book, closeModal }) {
//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
//       <div className="bg-white p-8 rounded shadow-lg w-1/3">
//         <h2 className="text-xl font-semibold mb-4">
//           {book ? "Edit Book" : "Add Book"}
//         </h2>
//         <Form method="post">
//           {book && <input type="hidden" name="id" value={book.id} />}
//           <div className="mb-4">
//             <label className="block text-sm font-bold mb-2">Title</label>
//             <input
//               type="text"
//               name="title"
//               defaultValue={book?.title}
//               className="w-full border px-3 py-2 rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-bold mb-2">Author</label>
//             <input
//               type="text"
//               name="author"
//               defaultValue={book?.author}
//               className="w-full border px-3 py-2 rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-bold mb-2">Stock</label>
//             <input
//               type="number"
//               name="stock"
//               defaultValue={book?.stock}
//               className="w-full border px-3 py-2 rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-bold mb-2">To Borrow</label>
//             <input
//               type="checkbox"
//               name="to_borrow"
//               defaultChecked={book?.to_borrow}
//               className="mr-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-bold mb-2">To Buy</label>
//             <input
//               type="checkbox"
//               name="to_buy"
//               defaultChecked={book?.to_buy}
//               className="mr-2"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-bold mb-2">Description</label>
//             <textarea
//               name="description"
//               defaultValue={book?.description}
//               className="w-full border px-3 py-2 rounded"
//               rows={4}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-bold mb-2">Category</label>
//             <input
//               type="text"
//               name="category"
//               defaultValue={book?.category}
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-bold mb-2">Image URL</label>
//             <input
//               type="url"
//               name="image"
//               defaultValue={book?.image}
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               name="intent"
//               value={book ? "edit" : "add"}
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//             >
//               {book ? "Update" : "Add"}
//             </button>
//             <button
//               type="button"
//               onClick={closeModal}
//               className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </Form>
//       </div>
//     </div>
//   );
// }

import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

export default function AdminBooksPage() {
  const { books } = useLoaderData();

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
          {books.length > 0 ? (
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
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  defaultValue={selectedBook?.stock || ""}
                  required
                  className="border p-2 w-full"
                />
              </div>

              {/* Other form fields as needed for the book */}

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
