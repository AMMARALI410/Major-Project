require("dotenv").config();

const apiRoutes = require("./routes/apiRoutes");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const session = require("express-session");

const express = require("express");

const mongoose = require("mongoose");

const dotenv = require("dotenv");

const userRoutes = require("./routes/userRoutes");

const app = express();


// CONFIG DOTENV
dotenv.config();


// EJS
app.set("view engine", "ejs");


// MIDDLEWARE
app.use(express.urlencoded({ extended:true }));
app.use(express.json());

// SESSION MIDDLEWARE
app.use(session({

    secret:"mysecretkey",

    resave:false,

    saveUninitialized:false

}));

// CUSTOM MIDDLEWARE
app.use((req, res, next) => {

    console.log("Middleware Running");

    console.log("Method:", req.method);

    console.log("URL:", req.url);

    next();

});

// DATABASE
mongoose.connect(process.env.MONGO_URL);

console.log("MongoDB Connected");

// LOGIN PAGE
app.get("/login", (req, res) => {

    res.send(`

        <html>

        <head>

            <title>Login</title>

            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                rel="stylesheet"
            >

        </head>

        <body class="bg-light">

            <div class="container mt-5">

                <div class="card shadow p-4">

                    <h1 class="mb-4">
                        Login
                    </h1>

                    <form action="/login" method="POST">

                        <input
                            type="text"
                            name="username"
                            class="form-control mb-3"
                            placeholder="Enter Username"
                        >

                        <input
                            type="password"
                            name="password"
                            class="form-control mb-3"
                            placeholder="Enter Password"
                        >

                        <button class="btn btn-primary w-100">

                            Login

                        </button>

                    </form>

                </div>

            </div>

        </body>

        </html>

    `);

});

// LOGIN POST
app.post("/login", async (req, res) => {

    const {

        username,

        password

    } = req.body;


    // FIND USER
    const user = users.find((u) => {

        return u.username === username;

    });


    if(!user){

        return res.send("User Not Found");

    }


    // PASSWORD CHECK
    const isMatch = await bcrypt.compare(

        password,

        user.password

    );


    if(isMatch){

        // CREATE TOKEN
        const token = jwt.sign(

            {

                username:user.username

            },

            process.env.JWT_SECRET,

            {

                expiresIn:"1h"

            }

        );


        res.send(`

            <h1>Login Successful</h1>

            <p>Your Token:</p>

            <textarea rows="10" cols="80">

${token}

            </textarea>

        `);

    }

    else{

        res.send("Invalid Password");

    }

});

// DASHBOARD
app.get("/dashboard", (req, res) => {

    if(req.session.user){

        res.send(`

            <h1>

                Welcome ${req.session.user}

            </h1>

            <a href="/logout">

                Logout

            </a>

        `);

    }

    else{

        res.redirect("/login");

    }

});

// LOGOUT
app.get("/logout", (req, res) => {

    req.session.destroy();

    res.redirect("/login");

});

// REGISTER PAGE
app.get("/register", (req, res) => {

    res.send(`

        <html>

        <head>

            <title>Register</title>

            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                rel="stylesheet"
            >

        </head>

        <body class="bg-light">

            <div class="container mt-5">

                <div class="card shadow p-4">

                    <h1 class="mb-4">
                        Register
                    </h1>

                    <form action="/register" method="POST">

                        <input
                            type="text"
                            name="username"
                            class="form-control mb-3"
                            placeholder="Enter Username"
                        >

                        <input
                            type="password"
                            name="password"
                            class="form-control mb-3"
                            placeholder="Enter Password"
                        >

                        <button class="btn btn-success w-100">

                            Register

                        </button>

                    </form>

                </div>

            </div>

        </body>

        </html>

    `);

});

// FAKE DATABASE
const users = [];


// REGISTER POST
app.post("/register", async (req, res) => {

    const {

        username,

        password

    } = req.body;


    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);


    users.push({

        username,

        password: hashedPassword

    });


    console.log(users);

    res.send("User Registered");

});

// PROTECTED ROUTE
app.get("/profile", (req, res) => {

    const authHeader = req.headers.authorization;


    if(!authHeader){

        return res.send("Token Missing");

    }


    const token = authHeader.split(" ")[1];


    try{

        const verified = jwt.verify(

            token,

            process.env.JWT_SECRET

        );


        res.send(`

            <h1>

                Welcome ${verified.username}

            </h1>

        `);

    }

    catch(error){

        res.send("Invalid Token");

    }

});

// ROUTES
app.use("/uploads", express.static("uploads"));
app.use("/", userRoutes);
app.use("/api", apiRoutes);

// CHAT PAGE
app.get("/chat", (req, res) => {

    res.sendFile(

        __dirname + "/views/chat.html"

    );

});

// 404 PAGE
app.use((req, res) => {

    res.status(404).send(`

        <h1>404 - Page Not Found</h1>

    `);

});

const http = require("http");

const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server);



// SOCKET CONNECTION
io.on("connection", (socket) => {

    console.log("User Connected");



    // RECEIVE MESSAGE
    socket.on("chat message", (msg) => {

        io.emit(

            "chat message",

            msg

        );

    });

});



// SERVER
server.listen(process.env.PORT, () => {

    console.log("Server Running");

});