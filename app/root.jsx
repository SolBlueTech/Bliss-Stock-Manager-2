// root.jsx
import { useEffect, useState } from "react";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { Outlet } from "@remix-run/react";

export default function App() {
  const [host, setHost] = useState(null);

  useEffect(() => {
    // Only run in the browser
    const urlParams = new URLSearchParams(window.location.search);
    const hostParam = urlParams.get("host");
    if (!hostParam) console.warn("No host param — App Bridge may fail.");
    setHost(hostParam);
  }, []);

  // Show a loading placeholder until host is available
  if (!host) {
    return <div>Loading Shopify App...</div>;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Bliss Stock Manager Dashboard</title>
      </head>
      <body>
        <AppProvider
          config={{
            apiKey: process.env.SHOPIFY_API_KEY,
            host,
            forceRedirect: true,
          }}
        >
          <Outlet />
        </AppProvider>
      </body>
    </html>
  );
}