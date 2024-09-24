// app/routes/admin/_index.tsx
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSupabase } from "~/db/supabase.server";

type LoaderData = {
  borrowedLastMonth: number;
  totalUsers: number;
  availableBooks: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { supabase, headers } = getSupabase(request);

  try {
    const [borrowedBooks, totalUsers, availableBooks] = await Promise.all([
      supabase
        .from("borrowed_books")
        .select("id", { count: "exact" })
        .gte(
          "borrowed_date",
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        ),
      supabase.from("users").select("id", { count: "exact" }),
      supabase
        .from("books")
        .select("id", { count: "exact" })
        .eq("is_available", true),
    ]);

    const data: LoaderData = {
      borrowedLastMonth: borrowedBooks.count || 0,
      totalUsers: totalUsers.count || 0,
      availableBooks: availableBooks.count || 0,
    };

    return json(data, { headers });
  } catch (error) {
    console.error("Error fetching data:", error);
    return json(
      { borrowedLastMonth: 0, totalUsers: 0, availableBooks: 0 },
      { headers }
    );
  }
};

export default function Dashboard() {
  const { borrowedLastMonth, totalUsers, availableBooks } =
    useLoaderData<LoaderData>();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Books Borrowed (Last 30 Days)"
          value={borrowedLastMonth}
        />
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Available Books" value={availableBooks} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="mt-2 text-3xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}
