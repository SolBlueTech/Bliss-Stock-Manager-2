import { json, redirect } from "@remix-run/node";
import { authenticate } from "../../../shopify.server";

export const loader = async ({ request }) => {
  const auth = await authenticate.admin(request);

  if (!auth?.admin?.session?.host) {
    return redirect("/api/auth");
  }

  const host = auth.admin.session.host;
  return redirect(`/app?host=${encodeURIComponent(host)}`);
};

export const action = loader;
export default function Callback() {
  return null;
}