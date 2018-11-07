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
const session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    cookie: { maxAge: 60000 }
}))

// Flash
const flash = require("express-flash");
app.use(flash());



const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/animals_db")

const AnimalSchema = mongoose.Schema({
    nickname: String,
    age: Number
})
mongoose.model("Animal", AnimalSchema);
const Animal = mongoose.model("Animal");

const UserSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
})
mongoose.model("User", UserSchema);
const User = mongoose.model("User");


// Bcrypt
const bcrypt = require('bcrypt');
// bcrypt.hash("password", 10, function(err, hash) {
//     // Store hash in your password DB.
// });


// Routing Rules & Logic

app.use(function(request, response, next){
    console.log(request.session)
    next();
})

app.get("/", function(request, response){
    response.render("logreg");
})

app.get('/logout', function(request, response){
    request.session.destroy(function(){
        response.redirect("/");
    })
})

app.post("/registration", function(request, response){
    console.log("POST /registration")
    console.log("POST DATA: ", request.body);
    const userInstance = new User(request.body);
    console.log(userInstance);

    bcrypt.hash(userInstance.password, 10, function(err, hash) {
        userInstance.password = hash;
        userInstance.save(function(err) {
            response.redirect("/");
        })
    });

})

app.post("/login", function(request, response){
    console.log("POST /login")
    console.log("POST DATA: ", request.body);
    User.findOne({email: request.body.email}, function(err, user){
        if(err) {
            console.log("ERROR IN RETRIEVEING USER FOR LOGIN")
        }
        else if (user) {
            console.log("USER FOUND FOR LOGIN");
            bcrypt.compare(request.body.password, user.password, function(err, result) {
                if (err){
                    response.redirect("/");
                }
                else if (result){
                    request.session.user_id = user._id;
                    response.redirect('/dashboard');
                } else {
                    response.redirect("/");
                }
            });

        } 
        else {
            console.log("USER -NOT FOUND- FOR LOGIN")
            response.redirect("/");
        }
        console.log("FOUND USER!", user);
    })
    
})

app.get("/dashboard", function (request, response) {
    if(!request.session.user_id){
        response.redirect("/");
    } else {    
        console.log("GET /dashboard");
        Animal.find(function(err, animals){
            console.log(animals);
            response.render("dashboard", { animals: animals });
        })
    }
})

app.post("/animals", function(request, response){
    console.log("POST /animals");
    console.log("POST DATA:", request.body);
    const animalInstance = new Animal();
    animalInstance.nickname = request.body.nickname;
    animalInstance.age = request.body.age;
    animalInstance.save(function(err){
        if(err) { }
        else { response.redirect("/dashboard"); }
    })
})

app.get("/animals/:id/delete", function(request, response){
    console.log("GET /animals/:id/delete");
    console.log("PARAM of ID: ", request.params.id)
    Animal.deleteOne({ _id:  request.params.id }, function(err){
        if(err){ console.log(err); }
        else { response.redirect("/dashboard"); }
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
                    response.redirect("/dashboard");
                }
            })
        }
    })
})

// Listening to port 1337
app.listen(8001);
