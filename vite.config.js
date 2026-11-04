import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Serves the serverless functions in /api during `npm run dev`, so the
 * quote form works locally exactly as it does on Vercel. Each file in /api
 * exports Web-standard handlers named after HTTP methods (e.g. POST).
 */
function apiRoutes() {
  return {
    name: "local-api-routes",
    configureServer(server) {
      // Make non-VITE_ variables from .env (e.g. RESEND_API_KEY) visible to the handlers.
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ""));

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, "http://localhost");
        const match = url.pathname.match(/^\/api\/([\w-]+)$/);
        if (!match) return next();

        try {
          const mod = await server.ssrLoadModule(`/api/${match[1]}.js`);
          const handler = mod[req.method];
          if (!handler) {
            res.statusCode = 405;
            return res.end("Method Not Allowed");
          }

          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const body = chunks.length ? Buffer.concat(chunks) : undefined;

          const response = await handler(
            new Request(url, { method: req.method, headers: req.headers, body })
          );
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          if (err?.code === "ERR_LOAD_URL") return next();
          console.error(err);
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      });
    },
  };
}

export default defineConfig({ plugins: [react(), apiRoutes()] });
