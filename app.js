const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
   
const app = express();
const jsonParser = express.json();
 
//var db;
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
 
let dbFilms;

 
app.use(express.static(__dirname + "/public"));
 
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbFilms = client;
    app.locals.collection = client.db("filmsDb").collection("films");
    app.listen(3000, function(){
        console.log("Сервер создан!");
    });
});
 
app.get("/api/films", function(req, res){
        
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function(err, films){
         
        if(err) return console.log(err);
        res.send(films)
    });
     
});
app.get("/api/films/:id", function(req, res){
        
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({_id: id}, function(err, film){
               
        if(err) return console.log(err);
        res.send(film);
    });
});
   
app.post("/api/films", jsonParser, function (req, res) {
       
    if(!req.body) return res.sendStatus(400);
       
    const filmTitle = req.body.title;
    const filmDate = req.body.date;
    const filmFormat = req.body.format;
    const filmStars  = req.body.stars;
    const film = {title: filmTitle, date: filmDate, format: filmFormat, stars: filmStars};
       
    const collection = req.app.locals.collection;
    collection.insertOne(film, function(err, result){
               
        if(err) return console.log(err);
        res.send(film);
    });
});
    
app.delete("/api/films/:id", function(req, res){
        
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({_id: id}, function(err, result){
               
        if(err) return console.log(err);    
        let film = result.value;
        res.send(film);
    });
});
   
app.put("/api/films", jsonParser, function(req, res){
        
    if(!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const filmTitle = req.body.title;
    const filmDate = req.body.date;
    const filmFormat = req.body.format;
    const filmStars = req.body.stars;
       
    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({_id: id}, { $set: {title: filmTitle, date: filmDate, format: filmFormat, stars: filmStars}},
         {returnOriginal: false },function(err, result){
               
        if(err) return console.log(err);     
        const film = result.value;
        res.send(film);
    });
});

