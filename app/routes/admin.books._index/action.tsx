import { redirect } from "@remix-run/node";
import { getSupabase } from "~/db/supabase.server";

// export const action = async ({ request }) => {
//   const { supabase } = getSupabase(request); // Destructure supabase
//   const formData = await request.formData();
//   const intent = formData.get("intent");

//   // Fetch the authenticated user
//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();
//   if (userError || !user) {
//     throw new Response("User not authenticated", { status: 401 });
//   }

//   // Retrieve user's location_id
//   const { data: location, error: locationError } = await supabase
//     .from("locations")
//     .select("id")
//     .eq("user_email", user.email) // Assuming you associate users and locations by email or other attribute
//     .single();

//   if (locationError || !location) {
//     throw new Response("Location not found", { status: 404 });
//   }

//   const location_id = location.id;

//   if (intent === "add") {
//     const { title, author, stock } = Object.fromEntries(formData);
//     const { error } = await supabase
//       .from("books")
//       .insert({ title, author, stock, location_id }); // Insert book with location_id

//     if (error) throw new Response("Error adding book", { status: 500 });
//   } else if (intent === "edit") {
//     const id = formData.get("id");
//     const { title, author, stock } = Object.fromEntries(formData);

//     const { error } = await supabase
//       .from("books")
//       .update({ title, author, stock })
//       .eq("id", id)
//       .eq("location_id", location_id); // Ensure the update is scoped to the correct location

//     if (error) throw new Response("Error updating book", { status: 500 });
//   } else if (intent === "delete") {
//     const id = formData.get("id");

//     const { error } = await supabase
//       .from("books")
//       .delete()
//       .eq("id", id)
//       .eq("location_id", location_id); // Ensure the delete is scoped to the correct location

//     if (error) throw new Response("Error deleting book", { status: 500 });
//   }

//   return redirect("/admin/books");
// };

export const action = async ({ request }) => {
  const { supabase } = getSupabase(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get admin's location_id from the profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("location_id")
    .eq("id", user.id)
    .single();

  if (!profile || profileError) {
    throw new Response("Error fetching profile", { status: 500 });
  }

  const location_id = profile.location_id;

  if (intent === "add") {
    const { title, author, stock } = Object.fromEntries(formData);
    const { error } = await supabase
      .from("books")
      .insert({ title, author, stock, location_id });

    if (error) throw new Response("Error adding book", { status: 500 });
  }

  if (intent === "edit") {
    const id = formData.get("id");
    const { title, author, stock } = Object.fromEntries(formData);
    const { error } = await supabase
      .from("books")
      .update({ title, author, stock })
      .eq("id", id)
      .eq("location_id", location_id); // Ensure it belongs to the right location

    if (error) throw new Response("Error editing book", { status: 500 });
  }

  if (intent === "delete") {
    const id = formData.get("id");
    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", id)
      .eq("location_id", location_id);

    if (error) throw new Response("Error deleting book", { status: 500 });
  }

  return null;
};
