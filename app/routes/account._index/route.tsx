// import { redirect, LoaderFunction } from "@remix-run/node";
// import { useLoaderData, Form, Link } from "@remix-run/react";
// import { supabaseClient } from "~/utils/auth.server";
// import { getSession, destroySession } from "~/utils/session.server";

// export const loader: LoaderFunction = async ({ request }) => {
//   const redirectTo = new URL(request.url).pathname;

//   console.log(request.headers.get("Cookie"));

//   const session = await getSession(request.headers.get("Cookie"));
//   console.log(session.has("access_token"));

//   // if there is no access token in the header then
//   // the user is not authenticated, go to login
//   if (!session.has("access_token")) {
//     const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
//     throw redirect(`/login?${searchParams}`);
//   } else {
//     // otherwise execute the query for the page, but first get token
//     const { data, error: sessionErr } = await supabaseClient.auth.getUser(
//       session.get("access_token")
//     );

//     // if no error then get then set authenticated session
//     // to match the user associated with the access_token
//     if (!sessionErr) {
//       // activate the session with the auth_token
//       // supabaseClient.auth.setAuth(session.get("access_token"));

//       // return data and any potential errors alont with user
//       return { data };
//     } else {
//       return { error: sessionErr };
//     }
//   }
// };

// export default function Account() {
//   const { user, profile } = useLoaderData<typeof loader>();

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
//       <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-8 mt-8">
//         <h1 className="text-2xl font-bold mb-4">Account Overview</h1>
//         <div className="space-y-6">
//           <div>
//             <h2 className="text-xl font-semibold">Welcome, {user.email}</h2>
//             <p className="text-gray-600">User ID: {user.id}</p>
//           </div>

//           {/* Display additional user data */}
//           <div className="space-y-2">
//             <h3 className="text-lg font-semibold">Profile Information</h3>
//             <p className="text-gray-600">Name: {profile?.name || "N/A"}</p>
//             <p className="text-gray-600">Phone: {profile?.phone || "N/A"}</p>
//             {/* Add more profile fields as needed */}
//           </div>

//           {/* Logout Button */}
//           <Form action="/logout" method="post" className="mt-6">
//             <button
//               type="submit"
//               className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
//             >
//               Logout
//             </button>
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// }

import { redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { supabaseClient } from "~/utils/auth.server";
import { getSession, destroySession } from "~/utils/session.server";

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const redirectTo = new URL(request.url).pathname;

  console.log(request.headers.get("Cookie"));

  const session = await getSession(request.headers.get("Cookie"));
  console.log(session.has("access_token"));

  // if there is no access token in the header then
  // the user is not authenticated, go to login
  if (!session.has("access_token")) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  } else {
    // otherwise execute the query for the page, but first get token
    const { user, error: sessionErr } = await supabaseClient.auth.api.getUser(
      session.get("access_token")
    );

    // if no error then get then set authenticated session
    // to match the user associated with the access_token
    if (!sessionErr) {
      // activate the session with the auth_token
      supabaseClient.auth.setAuth(session.get("access_token"));

      // now query the data you want from supabase
      // const { data: chargers, error } = await supabaseClient
      //   .from("chargers")
      //   .select("*");

      // return data and any potential errors alont with user
      return { user };
    } else {
      return { error: sessionErr };
    }
  }
};

/**
 * this handles the form submit which destroys the user session
 * and by default logs the user out of application
 * @param {*} param0
 * @returns
 */
export const action: ActionFunction = async ({ request }) => {
  // get session
  const session = await getSession(request.headers.get("Cookie"));

  // destroy session and redirect to login page
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};

// https://remix.run/api/conventions#meta
export const meta = () => {
  return {
    title: "Remix Supabase Starter",
    description: "Welcome to remix!",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const { error, user } = useLoaderData();

  return (
    <div className="remix__page">
      <main>
        <div className="flex flex-1 items-center flex-col my-4 ">
          <h2 className="font-bold text-2xl">Welcome to Remix Supabase App</h2>
          <h4> {user?.email}</h4>
        </div>
        <div className="flex flex-1 items-center flex-row my-4 ">
          <Form method="post">
            <button className="bg-slate-700 rounded-sm w-fit px-8 mr-4 text-white">
              LOGOUT
            </button>
          </Form>
        </div>

        {/* if there is an error, display it */}
        <div>{error ? error?.message : null}</div>
      </main>
    </div>
  );
}
