/*
import { createServer } from "node:http";

const server = createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Welcome to my backend!");
  } else if (req.method === "GET" && req.url === "/users") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");

    const users = [
      { id: 1, name: "Fortune" },
      { id: 2, name: "Daniel" }
    ];

    res.end(JSON.stringify(users));
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Route not found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
*/



import { createServer } from "node:http";

interface User {
  id: number;
  name: string;
  email: string;
}

// Runtime check for an object parsed from JSON.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

let users: User[] = [
  { id: 1, name: "Fortune", email: "fortune@example.com" },
  { id: 2, name: "Daniel", email: "daniel@example.com" }
];

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost:3000");
  const parts = url.pathname.split("/").filter(Boolean);

  function sendJson(statusCode: number, data: unknown): void {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  }

  async function readJsonBody(): Promise<unknown> {
    let body = "";

    for await (const chunk of req) {
      body += chunk.toString();

      if (body.length > 1_000_000) {
        throw new Error("Request body too large");
      }
    }

    return JSON.parse(body);
  }

  // GET /users — retrieve all users
  if (req.method === "GET" && url.pathname === "/users") {
    sendJson(200, users);
    return;
  }

  // GET /users/:id — retrieve one user
  if (
    req.method === "GET" &&
    parts.length === 2 &&
    parts[0] === "users"
  ) {
    const id = Number(parts[1]);

    if (!Number.isInteger(id) || id <= 0) {
      sendJson(400, { message: "Invalid user ID" });
      return;
    }

    const user = users.find((item) => item.id === id);

    if (!user) {
      sendJson(404, { message: "User not found" });
      return;
    }

    sendJson(200, user);
    return;
  }

  // POST /users — create a user
  if (req.method === "POST" && url.pathname === "/users") {
    try {
      const data: unknown = await readJsonBody();

      if (
        !isRecord(data) ||
        typeof data.name !== "string" ||
        typeof data.email !== "string" ||
        !data.name.trim() ||
        !data.email.trim()
      ) {
        sendJson(400, {
          message: "Name and email must be non-empty strings"
        });
        return;
      }

      const newUser: User = {
        id: Math.max(0, ...users.map((item) => item.id)) + 1,
        name: data.name.trim(),
        email: data.email.trim()
      };

      users.push(newUser);

      sendJson(201, {
        message: "User created successfully",
        user: newUser
      });
    } catch {
      sendJson(400, {
        message: "Invalid JSON body or request body too large"
      });
    }

    return;
  }

  // PATCH /users/:id — update a user's name and/or email
  if (
    req.method === "PATCH" &&
    parts.length === 2 &&
    parts[0] === "users"
  ) {
    const id = Number(parts[1]);

    if (!Number.isInteger(id) || id <= 0) {
      sendJson(400, { message: "Invalid user ID" });
      return;
    }

    const current = users.find((item) => item.id === id);

    if (!current) {
      sendJson(404, { message: "User not found" });
      return;
    }

    try {
      const data: unknown = await readJsonBody();

      if (!isRecord(data)) {
        sendJson(400, { message: "A JSON object is required" });
        return;
      }

      const hasName = Object.hasOwn(data, "name");
      const hasEmail = Object.hasOwn(data, "email");

      if (!hasName && !hasEmail) {
        sendJson(400, {
          message: "Provide a name or email to update"
        });
        return;
      }

      const name = data.name;
      const email = data.email;

      if (
        hasName &&
        (typeof name !== "string" || !name.trim())
      ) {
        sendJson(400, {
          message: "Name must be a non-empty string"
        });
        return;
      }

      if (
        hasEmail &&
        (typeof email !== "string" || !email.trim())
      ) {
        sendJson(400, {
          message: "Email must be a non-empty string"
        });
        return;
      }

      if (hasName && typeof name === "string") {
        current.name = name.trim();
      }

      if (hasEmail && typeof email === "string") {
        current.email = email.trim();
      }

      sendJson(200, {
        message: "User updated successfully",
        user: current
      });
    } catch {
      sendJson(400, {
        message: "Invalid JSON body or request body too large"
      });
    }

    return;
  }

  // DELETE /users/:id — delete a user
  if (
    req.method === "DELETE" &&
    parts.length === 2 &&
    parts[0] === "users"
  ) {
    const id = Number(parts[1]);

    if (!Number.isInteger(id) || id <= 0) {
      sendJson(400, { message: "Invalid user ID" });
      return;
    }

    const index = users.findIndex((item) => item.id === id);

    if (index === -1) {
      sendJson(404, { message: "User not found" });
      return;
    }

    const deletedUser = users.splice(index, 1)[0];

    sendJson(200, {
      message: "User deleted successfully",
      user: deletedUser
    });
    return;
  }

  // Any request that doesn't match a route
  sendJson(404, { message: "Route not found" });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
