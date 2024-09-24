import { Links, Meta, Outlet, Scripts, useLoaderData } from "@remix-run/react";
import "./tailwind.css";
import { AuthProvider } from "~/context/AuthContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import { json, LoaderFunction } from "@remix-run/node";
import { getAuthSession } from "./utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getAuthSession();
  return json({ session });
};


export default function App() {
  // const { env, session } = useLoaderData<typeof loader>();
  // const [supabase] = useState(() =>
  //   createBrowserClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  // );
  const { session } = useLoaderData<{ session: any }>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider initialSession={session}>
          <Navbar />
          <main className="flex-grow">
            {/* <Outlet context={{ supabase }} /> */}
            <Outlet />
          </main>
          <Footer />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
