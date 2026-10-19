
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());

app.use(cors({
  origin:"http://localhost:5173"
}))


app.use((req, res,next)=>{
  console.log(`${req.method}${req.url}`);
  next();
})
const users = [
  {
    id: 1,
    name: "Fortune",
    email: "fortune@example.com"
  },
  {
    id: 2,
    name: "Daniel",
    email: "daniel@example.com"
  },
  {
    id: 3,
    name: "Job",
    email: "job@example.com"
  }
];

app.get("/", (req, res) => {
  res.send("Welcome to my first Express API!");
});

app.get("/about", (req, res) => {
  res.send("This is my first backend API!");
});

app.get("/products", (req, res) => {
  res.send("Here are all my products");
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((item) => item.id === id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(user);
});



app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    !name.trim() ||
    !email.trim()
  ) {
    res.status(400).json({
      message: "Name and email are required"
    });
    return;
  }

  const newUser = {
    id: Math.max(0, ...users.map((user) => user.id)) + 1,
    name: name.trim(),
    email: email.trim()
  };

  users.push(newUser);

  res.status(201).json({
    message: "User created successfully",
    user: newUser
  });
});




app.patch("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((item) => item.id === id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const { name, email } = req.body;

  if (name === undefined && email === undefined) {
    res.status(400).json({
      message: "Provide a name or email to update"
    });
    return;
  }

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      res.status(400).json({ message: "Invalid name" });
      return;
    }

    user.name = name.trim();
  }

  if (email !== undefined) {
    if (typeof email !== "string" || !email.trim()) {
      res.status(400).json({ message: "Invalid email" });
      return;
    }

    user.email = email.trim();
  }

  res.json({
    message: "User updated successfully",
    user
  });
});



app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      message: "Invalid user ID"
    });
    return;
  }

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    res.status(404).json({
      message: "User not found"
    });
    return;
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.json({
    message: "User deleted successfully",
    user: deletedUser
  });
});

app.get("/test-error", (req, res, next) => {
  next(new Error("Something failed during processing"));
});

app.use((err:Error,req:express.Request,res:express.Response,next:express.NextFunction)=>{
  console.error(err);
  res.status(500).json({
    message:"Something went wrong on the server"
  })
})

const PORT=Number(process.env.PORT)||3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
