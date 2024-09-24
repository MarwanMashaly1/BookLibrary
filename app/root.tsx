import { Links, Meta, Outlet, Scripts } from "@remix-run/react";
import "./tailwind.css";
import { AuthProvider } from "~/context/AuthContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
// import { supabase } from "~/utils/auth.server";
// export const loader = async () => {
//   const env = {
//     SUPABASE_URL: process.env.SUPABASE_URL!,
//     SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
//   };

//   // const response = new Response();
//   // const { supabase, headers } = getSupabase(request);

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   return json({ env, session });
// };

export default function App() {
  // const { env, session } = useLoaderData<typeof loader>();
  // const [supabase] = useState(() =>
  //   createBrowserClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  // );

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
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
