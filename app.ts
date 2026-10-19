/*
const username :string="Fortune"
let age:number=19
age=23
const isLearningBackend:boolean=true;
console.log(username,age)
console.log(age);
console.log(isLearningBackend)

function greet(name:string):string{
    return `Hello ${name}!`;
}

const message:string=greet("Fortune");
console.log(message)


function getFullName(
    firstname:string,
    lastName:string,
):string{
    return `${firstname} ${lastName}`
}

const fullName=getFullName("Forune", "Adeyemi");
console.log(fullName);

function add(a:number,b:number):number{
    return a+b
}

function displayTotal(total:number):void{
    console.log(total)
}

function greet(name:string,title?:string):string{
    if(title){
        return `Hello ${title} ${name}`
    }
    return `Hell ${name}!`
}

console.log(greet("Fortune"));
console.log(greet("Fortune , Mr"))

function sharrrp(name:string,title:string="friend"):string{
    return `Hello ${name} ${title}!`;
}

console.log(sharrrp("Fortune"));
console.log(sharrrp("Mr", "Fortune"))

function getUsers(limit:number=20):string{
    return `Fetching ${limit} users`;
}
console.log(getUsers());
console.log(getUsers(22))


const skill:string[]=[
    "flutter",
    "Dart",
    "firebase"
]
skill.push("node.js")
console.log(skill[0])
console.log(skill[1])
console.log(skill[2])
console.log(skill[3])

const price:number[]=[
    200,
    400,
    333,
]
console.log(price[1])

const prices:number[]=[2000,5858,49494]

const updatePrices=prices.filter(p=> p +5000)

console.log(updatePrices)

type User={
    name: string
    email:string
    age:number
};

const user:User={
    name:"Fortune",
    email:"fortund@gmail.com",
    age:20
};
console.log(user.age)*/

const user={
    name:"fortune",
    email:"f0rtune@gmail.com",
    age:20,
};
const updateUser={...user,age:10}
console.log(updateUser)

const skill =["fortunw","dart"];
const updateSkill=[...skill,"flutter"]
console.log(updateSkill)

function fetchUser():Promise<string>{
    return Promise.resolve("ff")
}

fetchUser().then((username) =>{
    console.log(username)
})

async function getUsername():Promise<string> {
    throw new Error("Database unavailable")
    
}
async function main(): Promise<void> {
  try {
    const username = await getUsername();
    console.log(username);
  } catch (error) {
    console.log("Something went wrong");
  }
}

interface Userss{
    name:string
    email:string
    age?:number
}

const userss:Userss={
    name:"forunt",
    email:"krkrktk",
    
};

console.log(userss)

function identify<s>(value:s):s{
    return value;
}

const numberResult= identify<number>(25)
const nameResuult=identify<string>("Fortune");

console.log(numberResult)
console.log(nameResuult)

function createpair<T,U>(first:T, second:U):[T, U]{
    return [first,second]
}

const userInfo=createpair("foro",22)

console.log(userInfo)

function getLength<T extends {lenght:number}>(value:T):number{
    return value.lenght
}

class Product{
    name:string;
    price:number;

    constructor( name:string,price:number){
        this.name=name;
        this.price=price;
    }
    getDetails():string{
        return `${this.name} costs £${this.price}` 
    }
}
const phone= new Product("Phone",200);

console.log(phone.getDetails())
console.log(phone.name)

class Products{
    constructor(
         public name:string,
        public price:number
    ){}

    getDefff():string{
        return `${this.name} is £${this.price}`
    }
}

class Ative extends Products{
    worldcode():string{
        return `${this.name} is writing code`
    }
}

const give= new Ative("active",22);

console.log(give.getDefff())
console.log(give.worldcode())

interface PaymentProcessor{
    pay(amount: number):boolean
}

class CardPayment implements PaymentProcessor{
    pay(amount:number):boolean{
        console.log(`Processing card payment of £${amount}`)
        return true
    }
}

const payment=new CardPayment()
payment.pay(299)