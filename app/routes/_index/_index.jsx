// app/routes/index.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const auth = await authenticate.admin(request);

  if (!auth?.admin?.session?.host) {
    // Not authenticated → go to Shopify OAuth
    return redirect("/api/auth");
  }

  const host = auth.admin.session.host;

  // Redirect into embedded app with host query param
  return redirect(`/app?host=${encodeURIComponent(host)}`);
};

export const action = loader;

export default function Index() {
  return null; // No UI needed
}