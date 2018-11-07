// Helper Libraries
const path = require("path");

// Express
const express = require('express');
const app = express();

// // Body Parser - For POST
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// EJS (Templating Engine)
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

// // Express Session
// const session = require('express-session');
// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true }
// }))

// Flash
// const flash = require("express-flash");
// app.use(flash());



const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/animals_db")

const AnimalSchema = mongoose.Schema({
    nickname: String,
    age: Number
})
mongoose.model("Animal", AnimalSchema);
const Animal = mongoose.model("Animal");


// Routing Rules & Logic
app.get("/", function (request, response) {
    console.log("GET /");
    Animal.find(function(err, animals){
        console.log(animals);
        response.render("dashboard", { animals: animals });
    })
})

app.post("/animals", function(request, response){
    console.log("POST /animals");
    console.log("POST DATA:", request.body);
    const animalInstance = new Animal();
    animalInstance.nickname = request.body.nickname;
    animalInstance.age = request.body.age;
    animalInstance.save(function(err){
        if(err) { }
        else { response.redirect("/"); }
    })
})

app.get("/animals/:id/delete", function(request, response){
    console.log("GET /animals/:id/delete");
    console.log("PARAM of ID: ", request.params.id)
    Animal.deleteOne({ _id:  request.params.id }, function(err){
        if(err){ console.log(err); }
        else { response.redirect("/"); }
    })
})

app.get("/animals/:id/edit", function(request, response){
    console.log("GET /animals/:id/edit");
    console.log("PARAM of ID: ", request.params.id)
    Animal.findOne({ _id: request.params.id }, function(err, animal) {
        response.render("edit", { animal: animal })
    });
})

app.post("/animals/:id/update", function(request, response) {
    console.log("POST /animals/:id/update");
    console.log("PARAM of ID: ", request.params.id)
    console.log("POST DATA:", request.body);
    Animal.findOne({ _id: request.params.id }, function(err, animal){
        if (err) { }
        else {
            animal.nickname = request.body.nickname;
            animal.age = request.body.age;
            animal.save(function(err){
                if(err){ }
                else {
                    response.redirect("/");
                }
            })
        }
    })
})

// Listening to port 1337
app.listen(8001);
