//signup page
import { Form, Link, useActionData } from "@remix-run/react";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { supabaseClient } from "~/utils/auth.server";
import { commitSession, getSession } from "~/utils/session.server";

export const loader = () => {
  const data = {};

  // https://remix.run/api/remix#json
  return json(data);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  const firstName = form.get("firstName") as string;
  const lastName = form.get("lastName") as string;

  await supabaseClient.auth.signOut();

  const { data, error: signUpError } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.REMIX_URL}/auth/callback`,
    },
  });

  const { session: sessionData, user } = data;

  // const { data, error } = await supabase.auth.signUp({
  //   email,
  //   password,
  //   options: {
  //     emailRedirectTo: `${process.env.REMIX_URL}/auth/callback`,
  //   },
  // });

  if (!signUpError) {
    // create the user in profiles table
    const { data, error: profileError } = await supabaseClient
      .from("users")
      .insert([{ email, firstName, lastName, id: user?.id }]);

    // if error return
    if (profileError) return { error: profileError };

    // all good, set session and move on
    const session = await getSession(request.headers.get("Cookie"));
    if (sessionData) {
      session.set("access_token", sessionData.access_token);
    } else {
      return json({ error: "Session data is null" });
    }
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  console.log(data);

  return json({ user: data?.user, error: signUpError });
};

interface ActionData {
  error?: string;
  user?: any;
}

export default function SignUp() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <Form method="post" className="space-y-4" acceptCharset="UTF-8">
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="John"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Doe"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@example.com"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Sign Up
          </button>
        </Form>
        {actionData?.error && (
          <p className="mt-4 text-red-500">{actionData.error}</p>
        )}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
