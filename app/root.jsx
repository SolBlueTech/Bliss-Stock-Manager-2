// root.jsx
import { useEffect, useState } from "react";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { Outlet } from "@remix-run/react";

export default function App() {
  const [host, setHost] = useState(null);

  // Only access window in the browser
  useEffect(() => {
    const searchHost = new URLSearchParams(window.location.search).get("host");
    if (!searchHost) {
      console.warn("No host param — App Bridge may fail.");
    }
    setHost(searchHost);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Bliss Stock Manager Dashboard</title>
      </head>
      <body>
        {/* Render AppProvider only after host is set */}
        {host ? (
          <AppProvider
            config={{
              apiKey: process.env.SHOPIFY_API_KEY,
              host: host,
              forceRedirect: true,
            }}
          >
            <Outlet />
          </AppProvider>
        ) : (
          <Outlet />
        )}
      </body>
    </html>
  );
}