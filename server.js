const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://JoS0ares:esfigmomanometro@tcc.sd9zw.gcp.mongodb.net/TCC?retryWrites=true&w=majority";
const ejs = require('ejs');
const { json } = require('body-parser');
const { ObjectId } = require('mongodb');
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
app.get('/criar_publicacao/:name/:id', (req,res)=>{
    console.dir(req.params);
    db.collection('publicacao').find().toArray((err,results)=>{
        let dados = results,dado;

        dados.forEach(element => {
            if(element._id == req.params.id) {
                dado = element;
            }
        });
        res.render('criar_publicacao.ejs', {document: dado});
    });
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
        res.redirect('/criar_publicacao/' + dados.nome_public + '/' + dados._id);
        console.log(dados);
    });
});

app.post('/novo_trecho/:id_tabela', (req,res) => {
    console.dir(req.body);
    console.dir(req.params);

    let trechos;

    db.collection('tablatura').find({_id: ObjectId(req.params.id_tabela)}).toArray((err,results)=>{
        console.dir(results);
        trechos = results[0].trechos;
        console.dir(trechos);
    });
    
    // db.collection('tablatura').updateOne({_id: ObjectId(req.params.id_tabela)},
    //     {
    //         $set: {
    //             trechos: trechos
    //         }
    //     }, (err, result) => {
    //         if (err) return res.send(err);
    //         res.redirect('back');
    //         db.collection('tablatura').find({_id: ObjectId(req.params.id_tabela)}).toArray((err,results)=>{
    //             console.dir(results);
    //         })
    //     }
    // );
});