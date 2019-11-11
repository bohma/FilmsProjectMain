const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
const multer  = require("multer");
const mongoose = require("mongoose");
const cors = require('cors');
const Schema = mongoose.Schema;
   
const app = express();
const jsonParser = express.json();
let schemaName = new Schema({
    title: String,
    date: Number,
    format: String,
    stars: String
}, {
    collection: 'films'
});
//var db;
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
//let Model = mongoose.model('Model', schemaName);
//mongoose.connect('mongodb://localhost:27017/filmsDb');

let dbFilms;
//Для создания папки и для зугрзки текстовых фалов
var storage	=	multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '.txt');
    }
  });
  var upload = multer({ storage : storage}).single('filmList');

//Покдлючаем базу даннных
app.use(express.static(__dirname )); 
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbFilms = client;
    app.locals.collection = client.db("filmsDb").collection("films");
    app.listen(3000, function(){
        console.log("Сервер создан!");
    });
});
 //Вывод всей информации о фильмах  
app.get("/api/films", function(req, res){
        
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function(err, films){
         
        if(err) return console.log(err);
        res.send(films)
    });
     
});
//Вывод всей информации о фильме по Title
app.get("/api/films/:title", function(req, res){
        
    const title = req.params.title;
    const collection = req.app.locals.collection;
    collection.findOne({title: title}, function(err, film){
               
        if(err) return console.log(err);
        res.send(film);
    });
});   
//Вывод всей информации о фильме по id
app.get("/api/films/:id", function(req, res){
        
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({_id: id}, function(err, film){
               
        if(err) return console.log(err);
        res.send(film);
    });
});   
//Добавление фильма
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

//Удаление фильма
app.delete("/api/films/:id", function(req, res){
        
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({_id: id}, function(err, result){
               
        if(err) return console.log(err);    
        let film = result.value;
        res.send(film);
    });
});
   //Обновление данных о фильме
app.put("/api/films", jsonParser, function(req, res){
        
    if(!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const filmTitle = req.body.title;
    const filmDate = req.body.date;
    const filmFormat = req.body.format;
    const filmStars = req.body.stars;
       
    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({_id: id}, { $set: {title: filmTitle, date: filmDate, format: filmFormat, stars: filmStars }},
         {returnOriginal: false },function(err, result){
               
        if(err) return console.log(err);     
        const film = result.value;
        res.send(film);
    });
});
// Для загрузки текстогого файла  папку uploads
app.post('/api/download',function(req,res){
	upload(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file.");
		}
		res.end("File is uploaded");
	});
});




////////////
/*app.get('/api/films/searchTitle/:title', cors(), function(req, res) {
    var title = req.params.title;

    Model.find({
        'title': title
    }, function(err, film) {
        if (err) throw err;
        if (result) {
            res.json(result)
        } else {
            res.send(JSON.stringify({
                error : 'Error'
            })) 
        }
        if(err) return console.log(err);
        res.send(film);
    })
})*/

/*app.get("/api/films/searchTitle", function(req, res){
        
    const title = req.params.title;
    const collection = req.app.locals.collection;
    collection.findOne({title: title}, function(err, film){
               
        if(err) return console.log(err);
        res.send(film);
    });
});*/   

/*app.get("/api/films/search", function(req, res,film_title){
        
    const collection = req.app.locals.collection;
    collection.findOne({film_title},function(err, films){
         
        if(err) return console.log(err);
        res.send(films)
    });
     
});*/

/*app.get("/film/:", function(req, res){
      
    //const id = req.params.film_title;
    //const collection = req.app.locals.collection;
    dbFilms.findOne(req, function(err, film){
               
        if(err) return console.log(err);
        res.send(film);
    });
});*/
/*app.post("/api/films/:title", jsonParser, function (req, res) {
    console.log(req.body);
    if(!req.body) return res.sendStatus(400);
     
    res.json(req.body); // отправляем пришедший ответ обратно
});*/