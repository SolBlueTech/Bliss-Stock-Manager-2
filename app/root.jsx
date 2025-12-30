import { useSearchParams } from "@remix-run/react";

export default function App() {
  const [searchParams] = useSearchParams();
  const host = searchParams.get("host");

  console.log("host:", host); // ✅ log here inside the component

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