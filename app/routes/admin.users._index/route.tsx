// app/routes/admin/users.tsx
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  // Placeholder for actual data loading
  return json({ message: "Users page loaded successfully" });
};

export default function Users() {
  const data = useLoaderData<{ message: string }>();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Users</h1>
      <p>{data.message}</p>
    </div>
  );
}
