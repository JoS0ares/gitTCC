const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://JoS0ares:<esfigmomanometro>@cluster0.7t44c.mongodb.net/test";

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs')

app.get('/', (req,res) => {
    res.render('index.ejs');
});

app.post('/show', (req,res) => {
    console.log(req.body);
});

app.listen(3000, function(){
    console.log("server rodando na porta 3000");
});
