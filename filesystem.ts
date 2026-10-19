/*import {readFile} from "node:fs/promises";

async function main():Promise<void> {

    try{
        const message=await readFile("message.txt","utf8");
        console.log(message);
    }catch(error){
        console.error("Failed to read a file",error)
    }
}
main()

import{writeFile} from "node:fs/promises";

async function mains():Promise<void> {
    try{
        await writeFile("Output.txt","Hello forune !");
        console.log("File written successfully!");
    }catch(error){
        console.error("Failed to write a file", error)
    }
    
}
mains()

import { appendFile } from "node:fs/promises";

async function mainss():Promise<void> {
    try{
        await appendFile("Output.txt", "\nGood evening");
        console.log("Content appended successfully")
    }catch(error){
        console.error("failed to append",error)
    }
    
}
mainss()

import { unlink } from "node:fs/promises";

async function man():Promise<void> {
    try{
        await unlink("output.txt");
        console.log("file delete successfully")
    }catch(error){
        console.error("failed to delete",error)
    }
}
man()*/

interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Fortune",
  email: "fortune@example.com"
};

function getUserName(user: User): string {
  return user.name;
}

console.log(getUserName(user));

interface Product {
  name: string;
  price: number;
}

function getProductPrice(product: Product): number {
  return product.price;
}

const phone: Product = {
  name: "Samsung",
  price: 250000
};

console.log(getProductPrice(phone));


async function getMessage(): Promise<string> {
  return "Hello Fortune";
}

async function main(): Promise<void> {
  const message = await getMessage();
  console.log(message);
}

main();

async function getPrice(): Promise<number> {
  return 5000;
}

async function mainn(): Promise<void> {
  const price = getPrice();
  console.log(price);
}

mainn();


async function getUser(): Promise<string> {
  throw new Error("User not found");
}

async function mainnn(): Promise<void> {
  try {
    const user = await getUser();
    console.log(user);
  } catch (error) {
    console.log("Something went wrong");
  }
}

mainnn();

import { writeFile, appendFile } from "node:fs/promises";

async function mains(): Promise<void> {
  await writeFile("notes.txt", "Hello");
  await appendFile("notes.txt", " Fortune");
}

mains();