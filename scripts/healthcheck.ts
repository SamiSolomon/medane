// scripts/healthcheck.ts
import http, { IncomingMessage } from "http";

const port: number = Number(process.env.PORT) || 5000;

const req = http.request(
  {
    host: "localhost",
    port,
    path: "/", // root; just needs to return 200-ish
    method: "GET",
    timeout: 5000,
  },
  (res: IncomingMessage) => {
    const status = res.statusCode ?? 500;

    // Consider anything < 500 as "healthy" (200–499)
    if (status < 500) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
);

req.on("error", () => {
  process.exit(1);
});

req.end();
