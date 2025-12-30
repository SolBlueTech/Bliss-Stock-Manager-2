var _a;
import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer, Meta, Links, Outlet, ScrollRestoration, Scripts, useLoaderData, useActionData, Form, Link, useRouteError, useSearchParams, useNavigate, useRevalidator, useFetcher } from "@remix-run/react";
import { createReadableStreamFromReadable, json } from "@remix-run/node";
import { isbot } from "isbot";
import "@shopify/shopify-app-remix/adapters/node";
import { shopifyApp, AppDistribution, ApiVersion, DeliveryMethod, boundary } from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { PrismaClient, Prisma } from "@prisma/client";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu, useAppBridge, TitleBar } from "@shopify/app-bridge-react";
import { Page, Card, BlockStack, Text, DataTable, InlineStack, TextField, Button, Layout, Badge, Select, Pagination } from "@shopify/polaris";
import { useRef, useEffect, useState, useMemo } from "react";
if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient();
  }
}
const prisma = global.prismaGlobal ?? new PrismaClient();
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: (_a = process.env.SCOPES) == null ? void 0 : _a.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true
  },
  ...process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}
});
({
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http
  },
  PRODUCTS_CREATE: {
    deliveryMethod: DeliveryMethod.Http
  },
  PRODUCTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http
  },
  PRODUCTS_DELETE: {
    deliveryMethod: DeliveryMethod.Http
  },
  INVENTORY_LEVELS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http
  }
});
ApiVersion.January25;
const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
const authenticate = shopify.authenticate;
shopify.unauthenticated;
const login = shopify.login;
shopify.registerWebhooks;
shopify.sessionStorage;
const streamTimeout = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  addDocumentResponseHeaders(request, responseHeaders);
  const userAgent = request.headers.get("user-agent");
  const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url }),
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function App$1() {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://cdn.shopify.com/" }),
      /* @__PURE__ */ jsx(
        "link",
        {
          rel: "stylesheet",
          href: "https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        }
      ),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App$1
}, Symbol.toStringTag, { value: "Module" }));
const loader$9 = async ({ request }) => {
  return authenticate.admin(request);
};
const action$8 = loader$9;
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
const loader$8 = async ({ request }) => {
  if (request.method === "HEAD") {
    return new Response(null, { status: 200 });
  }
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || "";
  return json({ shop });
};
const action$7 = async ({ request }) => {
  if (request.method === "HEAD") {
    return new Response(null, { status: 200 });
  }
  return login(request);
};
function AuthLogin() {
  const { shop } = useLoaderData();
  const actionData = useActionData();
  const errors = (actionData == null ? void 0 : actionData.errors) || {};
  return /* @__PURE__ */ jsxs("div", { style: { padding: 16, fontFamily: "system-ui, -apple-system, Inter, sans-serif" }, children: [
    /* @__PURE__ */ jsx("h1", { children: "Log in" }),
    /* @__PURE__ */ jsxs(Form, { method: "post", children: [
      /* @__PURE__ */ jsx("label", { style: { display: "block", marginBottom: 8 }, children: "Shop domain" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          name: "shop",
          defaultValue: shop,
          placeholder: "example.myshopify.com",
          style: { padding: 8, width: 320, maxWidth: "100%" }
        }
      ),
      errors.shop ? /* @__PURE__ */ jsx("div", { style: { marginTop: 8 }, children: /* @__PURE__ */ jsx("small", { style: { color: "crimson" }, children: errors.shop }) }) : null,
      /* @__PURE__ */ jsx("div", { style: { marginTop: 12 }, children: /* @__PURE__ */ jsx("button", { type: "submit", children: "Log in" }) })
    ] })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  default: AuthLogin,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
const action$6 = async ({ request }) => {
  try {
    return authenticate.webhook(request);
  } catch (e) {
    console.error("Webhook error", e);
    return new Response("Webhook error", { status: 500 });
  }
};
const loader$7 = () => new Response("OK");
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
const action$5 = async ({ request }) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);
  const current = payload.current;
  if (session) {
    await prisma.session.update({
      where: {
        id: session.id
      },
      data: {
        scope: current.toString()
      }
    });
  }
  return new Response();
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5
}, Symbol.toStringTag, { value: "Module" }));
const action$4 = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);
  if (session) {
    await prisma.session.deleteMany({ where: { shop } });
  }
  return new Response();
};
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4
}, Symbol.toStringTag, { value: "Module" }));
const loader$6 = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const polarisStyles = "/assets/styles-BeiPL2RV.css";
const links = () => [
  { rel: "stylesheet", href: polarisStyles },
  // optional prefetch:
  { rel: "prefetch", as: "document", href: "/app/admin" },
  { rel: "prefetch", as: "document", href: "/app/additional" }
];
const loader$5 = async ({ request }) => {
  await authenticate.admin(request);
  console.log("[APP] loader OK:", request.method, request.url);
  return { apiKey: process.env.SHOPIFY_API_KEY ?? "" };
};
function App() {
  const { apiKey } = useLoaderData();
  return /* @__PURE__ */ jsxs(AppProvider, { isEmbeddedApp: true, apiKey, children: [
    /* @__PURE__ */ jsxs(NavMenu, { children: [
      /* @__PURE__ */ jsx(Link, { to: "/app", rel: "home", children: "Home" }),
      /* @__PURE__ */ jsx(Link, { to: "/app/additional", children: "Logs" }),
      /* @__PURE__ */ jsx(Link, { to: "/app/admin", children: "Admin" })
    ] }),
    /* @__PURE__ */ jsx(Outlet, {})
  ] });
}
function ErrorBoundary() {
  return boundary.error(useRouteError());
}
const headers = (args) => boundary.headers(args);
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: App,
  headers,
  links,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const action$3 = async () => {
  var _a2, _b, _c, _d, _e, _f, _g;
  const { admin } = await authenticate.admin();
  const locResp = await admin.graphql(`
    query {
      locations(first: 1, includeInactive: false) {
        nodes { id name }
      }
    }
  `);
  const loc = (_d = (_c = (_b = (_a2 = await locResp.json()) == null ? void 0 : _a2.data) == null ? void 0 : _b.locations) == null ? void 0 : _c.nodes) == null ? void 0 : _d[0];
  if (!loc) return json({ ok: false, error: "No active locations" }, { status: 400 });
  const varsResp = await admin.graphql(`
    query {
      productVariants(first: 250) {
        nodes { id, inventoryItem { id, tracked } }
      }
    }
  `);
  const variants = ((_g = (_f = (_e = await varsResp.json()) == null ? void 0 : _e.data) == null ? void 0 : _f.productVariants) == null ? void 0 : _g.nodes) ?? [];
  const items = variants.map((v) => ({
    inventoryItemId: v.inventoryItem.id,
    locationId: loc.id,
    onHand: 25,
    // seed value; change as you like
    reason: "correction"
  }));
  const mutation = `
    mutation Seed($trackIds: [ID!]!, $input: [InventorySetOnHandQuantitiesInput!]!) {
      inventoryBulkToggleTracking(inventoryItemIds: $trackIds, tracked: true) {
        userErrors { field message }
      }
      inventorySetOnHandQuantities(input: $input) {
        userErrors { field message }
      }
    }
  `;
  const m = await admin.graphql(mutation, {
    variables: { trackIds: variants.map((v) => v.inventoryItem.id), input: items }
  });
  const jsonOut = await m.json();
  return json({ ok: true, location: loc, result: jsonOut });
};
function Seed() {
  return null;
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: Seed
}, Symbol.toStringTag, { value: "Module" }));
const VARIANTS_QUERY$1 = (
  /* GraphQL */
  `
  query Variants($cursor: String) {
    productVariants(first: 100, after: $cursor, sortKey: ID) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        legacyResourceId
        title
        sku
        price
        compareAtPrice
        position
        availableForSale
        createdAt
        updatedAt
        inventoryQuantity  # fallback total if no per-location data

        product {
          id
          handle
          title
          vendor
          productType
          status
          tags
          createdAt
          updatedAt
          publishedAt
        }

        inventoryItem {
          id
          tracked
          inventoryLevels(first: 50) {
            nodes {
              location { id name }
              quantities(names: ["on_hand","committed","reserved","available"]) {
                name
                quantity
              }
            }
          }
        }
      }
    }
  }
`
);
const dec = (v) => v == null ? null : new Prisma.Decimal(v);
const qtyByName = (lvl, name) => {
  var _a2;
  return Array.isArray(lvl == null ? void 0 : lvl.quantities) ? (_a2 = lvl.quantities.find((q) => (q == null ? void 0 : q.name) === name)) == null ? void 0 : _a2.quantity : void 0;
};
const computeAvailable = (lvl) => {
  const qAvail = qtyByName(lvl, "available");
  if (typeof qAvail === "number") return qAvail;
  const onHand = qtyByName(lvl, "on_hand") ?? 0;
  const committed = qtyByName(lvl, "committed") ?? 0;
  const reserved = qtyByName(lvl, "reserved") ?? 0;
  return Math.max(0, onHand - committed - reserved);
};
const action$2 = async ({ request }) => {
  var _a2, _b, _c, _d, _e, _f;
  const { admin } = await authenticate.admin(request);
  let cursor = null;
  let pages = 0;
  let variantUpserts = 0;
  const syncedProducts = /* @__PURE__ */ new Set();
  while (true) {
    const resp = await admin.graphql(VARIANTS_QUERY$1, { variables: { cursor } });
    const data = await resp.json();
    const nodes = ((_b = (_a2 = data == null ? void 0 : data.data) == null ? void 0 : _a2.productVariants) == null ? void 0 : _b.nodes) ?? [];
    const pageInfo = ((_d = (_c = data == null ? void 0 : data.data) == null ? void 0 : _c.productVariants) == null ? void 0 : _d.pageInfo) ?? { hasNextPage: false };
    for (const v of nodes) {
      const p = v.product;
      syncedProducts.add(p.id);
      const product = await prisma.product.upsert({
        where: { shopifyGid: p.id },
        create: {
          shopifyGid: p.id,
          handle: p.handle,
          title: p.title,
          vendor: p.vendor ?? null,
          productType: p.productType ?? null,
          status: p.status ?? null,
          tagsCsv: (p.tags ?? []).join(","),
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          publishedAt: p.publishedAt ? new Date(p.publishedAt) : null
        },
        update: {
          handle: p.handle,
          title: p.title,
          vendor: p.vendor ?? null,
          productType: p.productType ?? null,
          status: p.status ?? null,
          tagsCsv: (p.tags ?? []).join(","),
          updatedAt: new Date(p.updatedAt),
          publishedAt: p.publishedAt ? new Date(p.publishedAt) : null
        },
        select: { id: true }
      });
      const variant = await prisma.productVariant.upsert({
        where: { shopifyGid: v.id },
        create: {
          productId: product.id,
          shopifyGid: v.id,
          legacyId: v.legacyResourceId ? BigInt(v.legacyResourceId) : null,
          title: v.title ?? null,
          sku: v.sku ?? null,
          price: dec(v.price) ?? new Prisma.Decimal(0),
          compareAtPrice: dec(v.compareAtPrice),
          position: v.position ?? null,
          availableForSale: v.availableForSale ?? null,
          createdAt: new Date(v.createdAt),
          updatedAt: new Date(v.updatedAt)
        },
        update: {
          productId: product.id,
          title: v.title ?? null,
          sku: v.sku ?? null,
          price: dec(v.price) ?? new Prisma.Decimal(0),
          compareAtPrice: dec(v.compareAtPrice),
          position: v.position ?? null,
          availableForSale: v.availableForSale ?? null,
          updatedAt: new Date(v.updatedAt)
        },
        select: { id: true }
      });
      variantUpserts += 1;
      await prisma.variantInventoryLevel.deleteMany({ where: { variantId: variant.id } });
      const levels = ((_f = (_e = v.inventoryItem) == null ? void 0 : _e.inventoryLevels) == null ? void 0 : _f.nodes) ?? [];
      if (levels.length) {
        await prisma.variantInventoryLevel.createMany({
          data: levels.map((lvl) => ({
            variantId: variant.id,
            locationGid: lvl.location.id,
            locationName: lvl.location.name,
            available: computeAvailable(lvl)
          }))
        });
      } else {
        const total = typeof v.inventoryQuantity === "number" ? v.inventoryQuantity : 0;
        await prisma.variantInventoryLevel.create({
          data: {
            variantId: variant.id,
            locationGid: "gid://shopify/Location/unknown",
            locationName: "All Locations",
            available: total
          }
        });
      }
    }
    if (!pageInfo.hasNextPage) break;
    cursor = pageInfo.endCursor ?? null;
    pages += 1;
    await new Promise((r) => setTimeout(r, 150));
  }
  await prisma.product.deleteMany({
    where: { shopifyGid: { notIn: Array.from(syncedProducts) } }
  });
  const message = `Synced ${variantUpserts} variants from ${syncedProducts.size} products (${pages + 1} page${pages ? "s" : ""}).`;
  return json({ ok: true, synced: variantUpserts, productsSeen: syncedProducts.size, pages: pages + 1, message });
};
function SyncProducts() {
  return null;
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: SyncProducts
}, Symbol.toStringTag, { value: "Module" }));
const action$1 = async ({ request }) => {
  await authenticate.admin(request);
  await prisma.physicalCount.deleteMany({});
  return json({ ok: true, message: "All counts cleared" });
};
const loader$4 = () => json({ ok: true });
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const loader$3 = async ({ request }) => {
  await authenticate.admin(request);
  const logs = await prisma.physicalCount.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      counted: true,
      createdAt: true,
      user: { select: { email: true } },
      variant: {
        select: {
          title: true,
          product: { select: { title: true } }
        }
      }
    }
  });
  return json({ logs });
};
function LogsPage() {
  const { logs } = useLoaderData();
  const rows = logs.map((log) => {
    var _a2;
    return [
      log.variant.product.title,
      log.variant.title,
      ((_a2 = log.user) == null ? void 0 : _a2.email) || "—",
      String(log.counted),
      new Date(log.createdAt).toLocaleString()
    ];
  });
  return /* @__PURE__ */ jsx(Page, { title: "Logs", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
    /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", children: "Recent inventory count activity" }),
    /* @__PURE__ */ jsx(
      DataTable,
      {
        columnContentTypes: ["text", "text", "text", "numeric", "text"],
        headings: [
          "Product",
          "Variant",
          "User",
          "Counted",
          "Last Edited"
        ],
        rows
      }
    )
  ] }) }) });
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: LogsPage,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const action = async ({ request }) => {
  await authenticate.admin(request);
  const form = await request.formData();
  const variantId = String(form.get("variantId") || "");
  const raw = String(form.get("counted") || "");
  const note = form.get("note") ? String(form.get("note")) : null;
  if (!variantId) {
    return json({ ok: false, error: "Missing variantId" }, { status: 400 });
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) {
    return json({ ok: false, error: "Invalid count" }, { status: 400 });
  }
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    select: { id: true }
  });
  if (!variant) {
    return json({ ok: false, error: "Variant not found" }, { status: 404 });
  }
  await prisma.physicalCount.create({
    data: {
      variantId,
      counted: Math.floor(n),
      note
      // userId: you can add this later when you wire real roles
    }
  });
  return json({ ok: true, message: "Count saved" });
};
function AddCount() {
  return null;
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: AddCount
}, Symbol.toStringTag, { value: "Module" }));
async function loader$2({ request }) {
  await authenticate.admin(request);
  return json({ ok: true });
}
function ProductsPage() {
  return /* @__PURE__ */ jsxs("div", { style: { padding: 24 }, children: [
    /* @__PURE__ */ jsx("h1", { children: "Products" }),
    /* @__PURE__ */ jsx("p", { children: "Click to sync all products from your store into the app database." }),
    /* @__PURE__ */ jsx(Link, { to: "/app/products/sync", children: "Run sync now" })
  ] });
}
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProductsPage,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const VARIANTS_QUERY = (
  /* GraphQL */
  `
  query Variants($cursor: String) {
    productVariants(first: 100, after: $cursor, sortKey: ID) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        legacyResourceId
        title
        sku
        price
        compareAtPrice
        position
        availableForSale
        createdAt
        updatedAt
        inventoryQuantity  # fallback total if no per-location levels

        product {
          id
          handle
          title
          vendor
          productType
          status
          tags
          createdAt
          updatedAt
          publishedAt
        }

        inventoryItem {
          id
          tracked
          inventoryLevels(first: 50) {   # keep this modest; we paginate variants anyway
            nodes {
              location { id name }
              quantities(names: ["on_hand","committed","reserved","available"]) {
                name
                quantity
              }
            }
          }
        }
      }
    }
  }
`
);
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  VARIANTS_QUERY
}, Symbol.toStringTag, { value: "Module" }));
function serialize(data) {
  return JSON.parse(
    JSON.stringify(
      data,
      (_key, value) => typeof value === "bigint" ? value.toString() : value
    )
  );
}
const DEFAULT_PAGE_SIZE = 25;
const loader$1 = async ({ request }) => {
  await authenticate.admin(request);
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const pageSize = Math.max(
    5,
    Math.min(100, Number(url.searchParams.get("pageSize") || DEFAULT_PAGE_SIZE))
  );
  const titleFilter = url.searchParams.get("title") || "";
  const totalVariants = await prisma.productVariant.count({
    where: {
      product: titleFilter ? { title: { equals: titleFilter } } : void 0
    }
  });
  const variants = await prisma.productVariant.findMany({
    where: {
      product: titleFilter ? { title: { equals: titleFilter } } : void 0
    },
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: {
      id: true,
      title: true,
      product: { select: { title: true } },
      counts: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { counted: true, createdAt: true, userId: true }
      }
    }
  });
  const items = variants.map((v) => {
    var _a2;
    return {
      variantId: v.id,
      productTitle: v.product.title,
      variantTitle: v.title ?? "—",
      latestCount: ((_a2 = v.counts[0]) == null ? void 0 : _a2.counted) ?? null
    };
  });
  const titles = await prisma.product.findMany({
    select: { title: true },
    orderBy: { updatedAt: "desc" },
    take: 200
  });
  return json(
    serialize({
      items,
      totalVariants,
      page,
      pageSize,
      titles: Array.from(new Set(titles.map((t) => t.title))).slice(0, 200)
    })
  );
};
function toastText(data) {
  if (!data) return "Saved";
  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  return "Saved";
}
function StaffHome() {
  const {
    items = [],
    totalVariants = 0,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    titles = []
  } = useLoaderData() ?? {};
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const shopify2 = useAppBridge();
  const countFetcher = useFetcher();
  const didToastRef = useRef(false);
  const submitting = ["loading", "submitting"].includes(countFetcher.state) && countFetcher.formMethod === "POST";
  useEffect(() => {
    if (submitting) didToastRef.current = false;
  }, [submitting]);
  useEffect(() => {
    var _a2;
    const finished = countFetcher.state === "idle" && ((_a2 = countFetcher.data) == null ? void 0 : _a2.ok);
    if (finished && !didToastRef.current) {
      didToastRef.current = true;
      try {
        shopify2.toast.show(toastText(countFetcher.data));
      } catch {
      }
      revalidator.revalidate();
    }
  }, [countFetcher.state, countFetcher.data, revalidator, shopify2]);
  const urlTitle = searchParams.get("title") || "";
  const [selectedTitle, setSelectedTitle] = useState(urlTitle);
  const applyTitleFilter = (value) => {
    setSelectedTitle(value);
    const params = new URLSearchParams(searchParams);
    if (value) params.set("title", value);
    else params.delete("title");
    params.set("page", "1");
    navigate(`?${params.toString()}`, { preventScrollReset: true, replace: true });
  };
  const titleOptions = [
    { label: "All products", value: "" },
    ...titles.map((t) => ({ label: t, value: t }))
  ];
  const hasPrevious = page > 1;
  const hasNext = totalVariants > page * pageSize;
  const gotoPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    navigate(`?${params.toString()}`, { preventScrollReset: true });
  };
  const [countedByVariant, setCountedByVariant] = useState({});
  const setCounted = (variantId, value) => setCountedByVariant((prev) => ({ ...prev, [variantId]: value }));
  const saveCount = (variantId) => {
    const form = new FormData();
    form.set("variantId", variantId);
    form.set("counted", countedByVariant[variantId] ?? "");
    countFetcher.submit(form, { method: "POST", action: "/app/counts/add" });
  };
  const HEADINGS = ["Title", "Variant", "Last Saved", "Add Count"];
  const columnContentTypes = ["text", "text", "text", "text"];
  const rows = useMemo(
    () => items.map((i) => {
      const countedValue = countedByVariant[i.variantId] ?? "";
      const last = i.latestCount == null ? "—" : String(i.latestCount);
      return [
        i.productTitle,
        i.variantTitle,
        last,
        /* @__PURE__ */ jsxs(InlineStack, { gap: "100", children: [
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Count",
              labelHidden: true,
              autoComplete: "off",
              type: "number",
              min: 0,
              value: countedValue,
              onChange: (v) => setCounted(i.variantId, v),
              placeholder: "Enter count"
            }
          ),
          /* @__PURE__ */ jsx(Button, { onClick: () => saveCount(i.variantId), children: "Save" })
        ] }, `add-${i.variantId}`)
      ];
    }),
    [items, countedByVariant]
  );
  const summary = useMemo(() => {
    let withCount = 0;
    for (const i of items) if (i.latestCount != null) withCount++;
    return { total: items.length, withCount };
  }, [items]);
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Inventory — Staff" }),
    /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsxs(Layout.Section, { children: [
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
        /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingSm", children: "Summary (this page)" }),
        /* @__PURE__ */ jsxs(InlineStack, { gap: "300", children: [
          /* @__PURE__ */ jsxs(Badge, { tone: "new", children: [
            "Total variants: ",
            summary.total
          ] }),
          /* @__PURE__ */ jsxs(Badge, { tone: "success", children: [
            "With saved count: ",
            summary.withCount
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
        /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingSm", children: "Filter" }),
        /* @__PURE__ */ jsxs(InlineStack, { gap: "200", align: "start", blockAlign: "center", children: [
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Product title",
              labelHidden: true,
              options: titleOptions,
              value: selectedTitle,
              onChange: applyTitleFilter
            }
          ),
          selectedTitle !== "" && /* @__PURE__ */ jsx(Button, { onClick: () => applyTitleFilter(""), variant: "plain", children: "Clear" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
        /* @__PURE__ */ jsx(
          DataTable,
          {
            columnContentTypes,
            headings: HEADINGS,
            rows,
            stickyHeader: true
          }
        ),
        /* @__PURE__ */ jsxs(InlineStack, { align: "center", blockAlign: "center", gap: "300", children: [
          /* @__PURE__ */ jsx(
            Pagination,
            {
              hasPrevious,
              onPrevious: () => gotoPage(page - 1),
              hasNext,
              onNext: () => gotoPage(page + 1)
            }
          ),
          /* @__PURE__ */ jsxs(Text, { as: "span", variant: "bodySm", children: [
            "Page ",
            page,
            " · ",
            Math.min(page * pageSize, totalVariants),
            " of ",
            totalVariants,
            " variants"
          ] })
        ] })
      ] }) })
    ] }) })
  ] });
}
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: StaffHome,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const loader = async ({ request }) => {
  await authenticate.admin(request);
  const variants = await prisma.productVariant.findMany({
    take: 200,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      product: { select: { title: true } },
      inventoryLevels: { select: { available: true } },
      counts: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { counted: true }
      }
    }
  });
  const items = variants.map((v) => {
    var _a2;
    const inv = v.inventoryLevels.reduce((sum, lvl) => sum + lvl.available, 0);
    const latest = ((_a2 = v.counts[0]) == null ? void 0 : _a2.counted) ?? null;
    return {
      product: v.product.title,
      variant: v.title,
      inventory: inv,
      latestCount: latest
    };
  });
  return json({ items });
};
function AdminPage() {
  const { items } = useLoaderData();
  const rows = items.map((i) => [
    i.product,
    i.variant,
    String(i.inventory),
    i.latestCount == null ? "—" : String(i.latestCount),
    i.latestCount == null ? /* @__PURE__ */ jsx(Badge, { children: "—" }) : i.latestCount === i.inventory ? /* @__PURE__ */ jsx(Badge, { tone: "success", children: "Match" }) : /* @__PURE__ */ jsx(Badge, { tone: "attention", children: "Mismatch" })
  ]);
  return /* @__PURE__ */ jsx(Page, { title: "Admin Inventory", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
    /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", children: "Admin-only inventory view" }),
    /* @__PURE__ */ jsx(
      DataTable,
      {
        columnContentTypes: ["text", "text", "numeric", "numeric", "text"],
        headings: [
          "Product",
          "Variant",
          "Inventory",
          "Latest Count",
          "Match?"
        ],
        rows
      }
    ),
    /* @__PURE__ */ jsx(Button, { variant: "primary", children: "Clear All Counts" })
  ] }) }) });
}
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminPage,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-Cd_PLIC-.js", "imports": ["/assets/components-TJrgxJd3.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-C1ap2jOS.js", "imports": ["/assets/components-TJrgxJd3.js"], "css": [] }, "routes/auth.callback": { "id": "routes/auth.callback", "parentId": "root", "path": "auth/callback", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/auth.login": { "id": "routes/auth.login", "parentId": "root", "path": "auth/login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-Dre3IR4t.js", "imports": ["/assets/components-TJrgxJd3.js"], "css": [] }, "routes/webhooks": { "id": "routes/webhooks", "parentId": "root", "path": "webhooks", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/webhooks.app.scopes_update": { "id": "routes/webhooks.app.scopes_update", "parentId": "routes/webhooks", "path": "app/scopes_update", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks.app.scopes_update-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/webhooks.app.uninstalled": { "id": "routes/webhooks.app.uninstalled", "parentId": "routes/webhooks", "path": "app/uninstalled", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks.app.uninstalled-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/auth.$": { "id": "routes/auth.$", "parentId": "root", "path": "auth/*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/auth._-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/app": { "id": "routes/app", "parentId": "root", "path": "app", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/app-CkSCHsUp.js", "imports": ["/assets/components-TJrgxJd3.js", "/assets/context-BrouWIlE.js"], "css": [] }, "routes/app.dev.seed-inventory": { "id": "routes/app.dev.seed-inventory", "parentId": "routes/app", "path": "dev/seed-inventory", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.dev.seed-inventory-ChG-6rmU.js", "imports": [], "css": [] }, "routes/app.sync.products": { "id": "routes/app.sync.products", "parentId": "routes/app", "path": "sync/products", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.sync.products-C6d-v1ok.js", "imports": [], "css": [] }, "routes/app.counts.clear": { "id": "routes/app.counts.clear", "parentId": "routes/app", "path": "counts/clear", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.counts.clear-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/app.additional": { "id": "routes/app.additional", "parentId": "routes/app", "path": "additional", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.additional-DG65QUzM.js", "imports": ["/assets/components-TJrgxJd3.js", "/assets/Page-DCVyfzQs.js", "/assets/context-BrouWIlE.js"], "css": [] }, "routes/app.counts.add": { "id": "routes/app.counts.add", "parentId": "routes/app", "path": "counts/add", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.counts.add-C6d-v1ok.js", "imports": [], "css": [] }, "routes/app.products": { "id": "routes/app.products", "parentId": "routes/app", "path": "products", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.products-7TCj2YdX.js", "imports": ["/assets/components-TJrgxJd3.js"], "css": [] }, "routes/app.products.sync": { "id": "routes/app.products.sync", "parentId": "routes/app.products", "path": "sync", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.products.sync-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/app._index": { "id": "routes/app._index", "parentId": "routes/app", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app._index-BivqofL3.js", "imports": ["/assets/components-TJrgxJd3.js", "/assets/Page-DCVyfzQs.js", "/assets/context-BrouWIlE.js"], "css": [] }, "routes/app.admin": { "id": "routes/app.admin", "parentId": "routes/app", "path": "admin", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.admin-DOVNgC4A.js", "imports": ["/assets/components-TJrgxJd3.js", "/assets/Page-DCVyfzQs.js", "/assets/context-BrouWIlE.js"], "css": [] } }, "url": "/assets/manifest-f4076c0d.js", "version": "f4076c0d" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": true, "v3_singleFetch": false, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/auth.callback": {
    id: "routes/auth.callback",
    parentId: "root",
    path: "auth/callback",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/auth.login": {
    id: "routes/auth.login",
    parentId: "root",
    path: "auth/login",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/webhooks": {
    id: "routes/webhooks",
    parentId: "root",
    path: "webhooks",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/webhooks.app.scopes_update": {
    id: "routes/webhooks.app.scopes_update",
    parentId: "routes/webhooks",
    path: "app/scopes_update",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/webhooks.app.uninstalled": {
    id: "routes/webhooks.app.uninstalled",
    parentId: "routes/webhooks",
    path: "app/uninstalled",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/auth.$": {
    id: "routes/auth.$",
    parentId: "root",
    path: "auth/*",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/app.dev.seed-inventory": {
    id: "routes/app.dev.seed-inventory",
    parentId: "routes/app",
    path: "dev/seed-inventory",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/app.sync.products": {
    id: "routes/app.sync.products",
    parentId: "routes/app",
    path: "sync/products",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/app.counts.clear": {
    id: "routes/app.counts.clear",
    parentId: "routes/app",
    path: "counts/clear",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/app.additional": {
    id: "routes/app.additional",
    parentId: "routes/app",
    path: "additional",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/app.counts.add": {
    id: "routes/app.counts.add",
    parentId: "routes/app",
    path: "counts/add",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/app.products": {
    id: "routes/app.products",
    parentId: "routes/app",
    path: "products",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/app.products.sync": {
    id: "routes/app.products.sync",
    parentId: "routes/app.products",
    path: "sync",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/app._index": {
    id: "routes/app._index",
    parentId: "routes/app",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route15
  },
  "routes/app.admin": {
    id: "routes/app.admin",
    parentId: "routes/app",
    path: "admin",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
