// root.jsx
import { useEffect } from "react";
import { AppProvider } from "@shopify/shopify-app-remix/react"; // ✅ Correct import
import { Outlet } from "@remix-run/react";

export default function App() {
  // Read host param from query string
  const host = new URLSearchParams(window.location.search).get("host");

  useEffect(() => {
    if (!host) console.warn("No host param — App Bridge may fail.");
  }, [host]);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </head>
      <body>
        <AppProvider
          config={{
            apiKey: process.env.SHOPIFY_API_KEY,
            host: host,
            forceRedirect: true, // redirects outside Shopify
          }}
        >
          <Outlet />
        </AppProvider>
      </body>
    </html>
  );
  return ( 
    <AppProvider>
      <Outlet />
    </AppProvider>
    );
  <h1>Bliss Stock Manager Dashboard</h1>;
}