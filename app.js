var mysql = require("mysql");
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gluaymunchkin",
});
  
connection.connect((error) => {
    if (error) console.log(error);
    else console.log("MYSQL Connected...");
});

var app = express();
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const publicDirectory = path.join(__dirname + "/css");
app.use(express.static(publicDirectory));

app.set("view engine", "ejs");

app.get("/", function (request, response) {
    response.render("index");
});
app.get("/card", function (request, response) {
    response.render("card");
});
app.get("/raffle-entered", function (request, response) {
    response.render("submit");
});
app.get("/raffle-failed", function (request, response) {
    response.render("submit-failed");
});
app.post("/raffle", function (request, response){
    let igname = request.body.igname;
    console.log(request.body)
    connection.query("SELECT name FROM user WHERE name = ?",[igname],(error, results) => {
        console.log(results.length)
        if(results.length == 0){
            connection.query("INSERT INTO user SET ?",{name: igname,},(error, results) => {
                response.redirect('/raffle-entered');
            })
        }else{
            response.redirect('/raffle-failed');
        }
    })
})

app.listen(3000, function(){
    console.log("Listening at Port 3000");
  });