const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://JoS0ares:esfigmomanometro@tcc.sd9zw.gcp.mongodb.net/TCC?retryWrites=true&w=majority";
const ejs = require('ejs');
const { json } = require('body-parser');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const testPass = '123456';
const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(testPass,salt);
console.dir(salt);
console.dir(hash);


var db;

app.use(bodyParser.urlencoded());

app.set('view engine', 'ejs');

MongoClient.connect(uri, (err, client)=>{
    if (err) return console.log('deu erro: ' + err);
    db = client.db('TCC');

    app.listen(3000, '192.168.100.8', function(){
        console.log("server rodando em http://192.168.100.8:3000/espec_publicacao");
        console.log("http://192.168.100.8:3000/criar_publicacao/rudimentos/5f970755f6bbb519fcfff560");
        console.log("http://192.168.100.8:3000/view_publicacao/rudimentos/5f970755f6bbb519fcfff560");
        console.log("http://192.168.100.8:3000/home");
    });
});

// GET

app.get('/home', (req,res) => {
    db.collection('publicacao').find({public: true}).toArray((err,results)=>{
        res.render('index.ejs', {dados: results});
    });
});
app.get('/view_publicacao/:name/:id', (req,res)=>{
    db.collection('publicacao').find({_id: ObjectId(req.params.id)}).toArray((err,results)=>{
        let dado = results[0];

        db.collection('tablatura').find({_id: ObjectId(dado.tablatura_id)}).toArray((errs,result)=>{
            let tab = result[0];
            res.render('publicacao.ejs', {document: dado,tablatura: tab});
        });
    });
});
app.get('/espec_publicacao', (req,res)=>{
    res.render('espec_publicacao.ejs');
});
app.get('/criar_publicacao/:name/:id', (req,res)=>{
    db.collection('publicacao').find({_id: ObjectId(req.params.id)}).toArray((err,results)=>{
        let dado = results[0];

        db.collection('tablatura').find({_id: ObjectId(dado.tablatura_id)}).toArray((errs,result)=>{
            let tab = result[0];
            res.render('criar_publicacao.ejs', {document: dado,tablatura: tab});
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
        });

        let dados = req.body;
        dados.data_public = new Date();
        dados.tablatura_id = tablatura._id;
        dados.public = false;
        
        db.collection('publicacao').save(dados, (err,result)=>{
            if (err) {
                res.redirect('back');
                console.log(err);
            }
            res.redirect('/criar_publicacao/' + dados.nome_public + '/' + dados._id);
        });
});

app.post('/novo_trecho/:id_tabela', (req,res) => {
    if(req.body.quant_compass <= 12 || req.body.num_row <= 12){
        let nome = req.body.detalhe_nome;
        
        for(var i = 0;i < nome.length;i++) {
            if(nome[i] == " ") {
                console.dir('espaço nao e permitido')
                res.redirect('back')
                return
            }
        }
        
        db.collection('tablatura').find({_id: ObjectId(req.params.id_tabela)}).toArray((err,results)=>{
            let trechos = results[0]._trechos;
            let dados = req.body;
            let compassos = new Array(+dados.quant_compass);
            let linhas = new Array(+dados.num_row);
            
            for(var i = 0;i < linhas.length;i+=1){
                let obj = {
                    id_linha: i,
                    colunas: new Array(+dados.beat_temp*+dados.tipo_compass)
                };

                for(var k = 0;k < obj.colunas.length;k++) {
                    obj.colunas[k] = "-";
                }

                linhas[i] = obj;
            }

            for(var i = 0;i < compassos.length;i+=1) {
                let obj = {
                    id_compasso: i,
                    linhas: linhas
                }
                compassos[i] = obj;
            }

            trechos.push({
                nome: dados.detalhe_nome,
                compass: +dados.tipo_compass,
                quant_compass: +dados.quant_compass,
                beat_temp: +dados.beat_temp,
                compassos: compassos
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
    }
    else {
        res.redirect('back');
    }
});

app.post('/update_trecho', (req,res) => {
    if(trechos!=null){
        trechos = req.body.trechos;
        db.collection('tablatura').updateOne({_id: ObjectId(req.body.id_tabela)},
            {
                $set: {
                    _trechos: trechos
                }
            }, (err, result) => {
                if (err) return res.send(err);
                res.redirect('back');
                console.dir(trechos);
            }
        );
    }
    console.log(trechos);
    
});

app.get('/delete_trecho/:id_tabela/:nome_trecho', (req,res)=>{
    console.dir('//delete_trecho');
    let dados_pag = req.params;

    db.collection('tablatura').find({_id: ObjectId(dados_pag.id_tabela)}).toArray((err, result)=>{
        let valores = result[0];
        let cont = 0;

        valores._trechos.forEach(element => {
            if(element.nome == dados_pag.nome_trecho) {
                valores._trechos.splice(cont,1);
            }
            cont++
        });

        db.collection('tablatura').updateOne({_id: ObjectId(req.params.id_tabela)},
            {
                $set: {
                    _trechos: valores._trechos
                }
            }, (err, result) => {
                if (err) return res.send(err);
                res.redirect('back');
            }
        );
    });
});

app.post('/update_publicacao/:id_public', (req,res) => {
    public = JSON.parse(req.body.public);

    db.collection('publicacao').updateOne({_id: ObjectId(req.params.id_public)},
        {
            $set: {
                nome_public: req.body.nome_public,
                nome_banda: req.body.nome_banda,
                bpm_table: req.body.bpm_table,
                desc_adicional: req.body.desc_adicional,
                public: public
            }
        }, (err, result) => {
            if (err) return res.send(err);
            res.redirect('back');
        }
    );
});


