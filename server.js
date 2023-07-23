import { createServer } from "node:http";
import ComputeCode from "./compute-code-entry.js";

const headers = {
  "Content-Type": "application/json",
};

const port = process.env.PORT || 5000;

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method !== "POST" && url.pathname !== "/compute") {
    res.writeHead(404, headers);
    return res.end(JSON.stringify({ message: "Path not found" }));
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const errors = [];
      const parsedBody = JSON.parse(body);
      const func = parsedBody.func;

      if (!func || typeof func !== "string") {
        errors.push(new Error("Invalid func property"));
      }

      let args = parsedBody.args;
      if (typeof args === "string") {
        args = [args];
      }

      if (!Array.isArray(args)) {
        errors.push("args must either be a string or an array");
      }

      if (errors.length > 0) {
        res.writeHead(400, headers);
        return res.end(JSON.stringify({ message: errors }));
      }

      const computeCode = new ComputeCode(func, args);
      try {
        const result = await computeCode.compute();
        res.writeHead(200, headers);
        res.end(JSON.stringify({ message: result }));
      } catch (error) {
        res.writeHead(400, headers);
        res.end(JSON.stringify(error));
      }
    } catch (error) {
      res.writeHead(500, headers);
      res.end(JSON.stringify({ message: "Invalid body" }));
    }
  });
});

server.listen(port, () => {
    console.log('Server running on port %d', port);
})
