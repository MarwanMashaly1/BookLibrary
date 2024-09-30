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

  // if there is no access token in the header then
  // the user is not authenticated, go to login
  if (!session.has("access_token")) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/auth/login?${searchParams}`);
  } else {
    // otherwise execute the query for the page, but first get token
    const { data: user, error: sessionErr } = await supabaseClient.auth.getUser(
      session.get("access_token")
    );

    // if no error then get then set authenticated session
    // to match the user associated with the access_token
    if (!sessionErr) {
      // activate the session with the auth_token
      await supabaseClient.auth.setSession({ access_token: session.get("access_token"), refresh_token: session.get("refresh_token") });

      // now query the data you want from supabase
      // const { data: chargers, error } = await supabaseClient
      //   .from("chargers")
      //   .select("*");

      // return data and any potential errors alont with user
      console.log("THIS IS THE USER: ", user);
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

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const { error, user } = useLoaderData<{ error?: { message: string }, user?: { user } }>();

  return (
    <div className="remix__page">
      <main>
        <div className="flex flex-1 items-center flex-col my-4 ">
          <h3 className="font-bold text-xl">Account Overview</h3>
          <h4> {user?.user?.email}</h4>
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


