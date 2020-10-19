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
        console.log("server rodando em http://192.168.100.8:3000/espec_publicacao ou http://192.168.100.8:3000/criar_publicacao/rudimentos%20importantes/5f8b4c11228e5926704ef031 para realizar testes");
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
    db.collection('publicacao').find({_id: ObjectId(req.params.id)}).toArray((err,results)=>{
        let dado = results[0];

        db.collection('tablatura').find({_id: ObjectId(dado.tablatura_id)}).toArray((errs,result)=>{
            let tab = result[0];
            res.render('criar_publicacao.ejs', {document: dado,tablatura: tab});
            console.dir(dado);
            console.dir(tab);
            console.dir(tab._trechos);
        });
    });
});

// POST

app.post('/criar_public', (req,res) => {

    let tablatura = {};
    tablatura._trechos = new Array();

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
    console.dir(req.params);
    console.dir(req.body);



    db.collection('tablatura').find({_id: ObjectId(req.params.id_tabela)}).toArray((err,results)=>{
        console.dir(results);
        let trechos = results[0]._trechos;
        let dados = req.body;
        console.dir(trechos);

        let linhas = new Array(+dados.num_row);
        
        for(var i = 0;i < linhas.length;i+=1){
            let obj = {
                nome_linha: String("linha " + i),
                colunas: new Array(+dados.beat_temp*+dados.tipo_compass)
            };
            linhas[i] = obj;
            console.dir(linhas[i]);
        };

        trechos.push({
            nome: dados.detalhe_nome,
            compass: +dados.tipo_compass,
            quant_compass: +dados.quant_compass,
            beat_temp: +dados.beat_temp,
            linhas: linhas
        });

        db.collection('tablatura').updateOne({_id: ObjectId(req.params.id_tabela)},
            {
                $set: {
                    _trechos: trechos
                }
            }, (err, result) => {
                if (err) return res.send(err);
                res.redirect('back');
            }
        );
    });
});