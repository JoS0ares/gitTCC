const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://JoS0ares:esfigmomanometro@tcc.sd9zw.gcp.mongodb.net/TCC?retryWrites=true&w=majority";
const ejs = require('ejs');
var db;

app.use(bodyParser.urlencoded());

app.set('view engine', 'ejs');

MongoClient.connect(uri, (err, client)=>{
    if (err) return console.log('deu erro: ' + err);
    db = client.db('TCC');

    app.listen(3000, '192.168.100.8', function(){
        console.log("server rodando em http://192.168.100.8:3000/espec_publicacao");
    });
});

// GET

app.get('/home', (req,res) => {
    res.render('index.ejs');
});
app.get('/espec_publicacao', (req,res)=>{
    res.render('espec_publicacao.ejs');
});
app.get('/criar_publicacao', (req,res)=>{
    res.render('criar_publicacao.ejs');
});

// POST

app.post('/criar_public', (req,res) => {

    let tablatura = {};

    db.collection('tablatura').save(tablatura, (err,result)=>{
        if (err) {
            res.redirect('back');
            console.log(err);
        }
        console.log(tablatura);
    });

    let dados = req.body;
    dados.data_public = new Date();
    dados.tablatura_id = tablatura._id;
    
    db.collection('publicacao').save(dados, (err,result)=>{
        if (err) {
            res.redirect('back');
            console.log(err);
        }
        res.redirect('back');
        console.log(dados);
    });
});