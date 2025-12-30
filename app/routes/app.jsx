// app/routes/app.jsx
import { Outlet, useSearchParams } from "@remix-run/react";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export default function App() {
  const [searchParams] = useSearchParams();
  const host = searchParams.get("host");

  if (!host) return <div>Loading Shopify App...</div>;

  return (
    <AppProvider apiKey={process.env.SHOPIFY_API_KEY} host={host} forceRedirect>
      <NavMenu>
        <a href="/app">Home</a>
        <a href="/app/additional">Logs</a>
        <a href="/app/admin">Admin</a>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}