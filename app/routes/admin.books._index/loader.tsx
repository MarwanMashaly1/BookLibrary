// import { json } from "@remix-run/node";
// import { getSupabase } from "~/db/supabase.server";

// export const loader = async ({ request }) => {
//   const { supabase } = getSupabase(request);

//   // Fetch authenticated user
//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();
//   if (userError || !user) {
//     throw new Response("User not authenticated", { status: 401 });
//   }

//   // Assume user belongs to a location by email or another attribute
//   const { data: location, error: locationError } = await supabase
//     .from("locations")
//     .select("id")
//     .eq("user_email", user.email) // Adjust based on how you associate users and locations
//     .single();

//   if (locationError || !location) {
//     throw new Response("Location not found", { status: 404 });
//   }

//   // Fetch books based on location_id
//   const { data: books, error: booksError } = await supabase
//     .from("books")
//     .select("*")
//     .eq("location_id", location.id);

//   if (booksError) {
//     throw new Response("Error fetching books", { status: 500 });
//   }

//   return json({ books });
// };

import { json } from "@remix-run/node";
import { getSupabase } from "~/db/supabase.server";

export const loader = async ({ request }) => {
  const { supabase } = getSupabase(request);

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  // Fetch the user's profile to get location_id (assuming the profiles table stores this information)
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("location_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Response("Profile not found", { status: 404 });
  }

  // Fetch books for the user's location
  const { data: books, error: booksError } = await supabase
    .from("books")
    .select("*")
    .eq("location_id", profile.location_id);

  if (booksError) {
    throw new Response("Error fetching books", { status: 500 });
  }

  return json({ books });
};
