import { createProxyMiddleware } from "http-proxy-middleware";

export default function (req, res) {
  // Create a proxy middleware for all paths under /api/proxy
  let proxy = createProxyMiddleware({
    target: process.env.NEXT_PUBLIC_PROXY_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/proxy": "/", // Rewrite '/api/proxy' to '/'
    },
  });
  // s
  return proxy(req, res, (result) => {
    if (result instanceof Error) {
      throw result;
    }
    throw new Error(`Request '${req.url}' is not proxied! We should never reach here!`);
  });
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
