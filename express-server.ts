import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import express from "express";
import cors from "cors";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(express.json());

app.use(cors({origin:"http://localhost:5173"}))


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

app.get("/users",async (req, res,next) => {
  try{
    const users=await prisma.users.findMany();
    res.json(users)
  }catch(error){
    next(error)
  }
});

app.get("/users/:id", async(req,res, next )=>{
  const id=Number(req.params.id);

  if(!Number.isInteger(id) || id<=0){
    res.status(400).json({message:"Invaild user ID"});
    return;
  }

  try{
    const user=await prisma.users.findUnique({
      where:{id}
    });
    if(!user){
      res.status(404).json({message:"User not found"});
      return;
    }

    res.json(user);
  }catch(error){
    next(error)
  }
})



app.post("/users", async(req, res,next) => {
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

  try{
    const newUser=await prisma.users.create({
      data:{
        name:name.trim(),
        email:email.trim()
      }
    });
    res.status(201).json({
      message:"User created successfully",
      user:newUser,
    });
  }catch(error){
    next(error)
  }
});




app.patch("/users/:id", async(req, res,next) => {
  const id = Number(req.params.id);
  const {name,email}=req.body;

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }
  

  if (name===undefined && email===undefined) {
    res.status(404).json({ message: "Invalid user ID" });
    return;
  }

  

  if(name !== undefined && 
    (typeof name !== "string"|| !name.trim())){
      res.status(400).json({message:"Invalid name "})
    }

  if (email !== undefined) {
    if (typeof email !== "string" || !email.trim()) {
      res.status(400).json({ message: "Invalid email" });
      return;
    }

    
  }

 try{
  const updateUser=await prisma.users.update({
    where:{id},
    data:{
      ...(name !== undefined && {name:name.trim()}),
      ...(email !== undefined && {email: email.trim()})
    }
  })
  res.json({
    message:"User successful",
    user: updateUser
  })
 }catch(error){
  next(error)
 }
});




app.delete("/users/:id", async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  try {
    const deletedUser = await prisma.users.delete({
      where: { id },
    });

    res.json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    next(error);
  }
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

const PORT=Number(process.env.PORT)||4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
