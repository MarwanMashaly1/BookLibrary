// apps/routes/auth/login.tsx
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
  // get user credentials from form
  const form = await request.formData();
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const { data: user, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (user) {
    // get session and set access_token
    const session = await getSession(request.headers.get("Cookie"));
    if (user.session) {
      session.set("access_token", user.session.access_token);
    } else {
      return { user, error: "Session is null" };
    }

    // redirect to page with the cookie set in header
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  // else return the error
  return { user, error };
};

export default function Login() {
  const actionData = useActionData<{ error?: { message: string } }>();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <Form method="post" className="space-y-4">
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
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Log In
          </button>
        </Form>
        <div>{actionData?.error ? actionData?.error?.message : null}</div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/auth/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
