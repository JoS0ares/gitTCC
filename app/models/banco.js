const { ObjectID } = require("mongodb");
const bcrypt = require('bcrypt');

class Banco {
    constructor(connection) {
        this._connection = connection;
    }
    getAllPublicTrue(callback) {
        this._connection.collection('publicacao').find({public: true}).sort({views:-1}).toArray(callback);
    }
    getAllPublic(callback) {
        this._connection.collection('publicacao').find().toArray(callback);
    }
    getPublic(id,callback) {
        this._connection.collection('publicacao').find({_id: id}).toArray(callback);
    }
    getTab(id,callback) {
        this._connection.collection('tablatura').find({_id: id}).toArray(callback);
    }
    criarPublic(dados,callback) {
        this._connection.collection('publicacao').save(dados, callback);
    }
    criarTab(dados,callback) {
        this._connection.collection('tablatura').save(dados, callback);
    }
    updatePublic(id,dados,callback) {
        this._connection.collection('publicacao').updateOne({_id: id},{
            $set: {
                nome_public:dados.nome_public,
                nome_banda: dados.nome_banda,
                bpm_table: dados.bpm_table,
                desc_adicional: dados.desc_adicional,
                public: dados.public
            }
        },callback);
    }
    updateUnicParam(id,data,callback) {
        this._connection.collection('publicacao').updateOne({_id: id},{
            $set: {
                public: data
            }
        },callback);
    }
    likeOpt(id,param,callback) {
        this.getPublic(id,(err,result)=>{
            if (err) console.log(err);
            console.log(result);
            let like = (param) ? result[0].up + 1 : result[0].up - 1;
            console.log(like);
            this._connection.collection('publicacao').updateOne({_id: id},{
                $set: {
                    up: like
                }
            },callback);
        });
    }
    view(id,callback) {
        this.getPublic(id,(err,result)=>{
            if(err) console.log(err);
            let view = JSON.parse(result[0].views);
            view += 1;
            this._connection.collection('publicacao').updateOne({_id: id},{
                $set: {
                    views: view
                }
            },callback(view));
        });
    }
    deletePublic(id,callback) {
        this.getPublic(id,(err,result)=>{
            if(err) console.log(err);
            let id_tab = result[0].tab_id;

            this._connection.collection('tablatura').deleteOne({_id: id_tab},(err,result)=>{
                if(err) console.log(err);
                this._connection.collection('publicacao').deleteOne({_id: id},callback);
            });    
        });
    }
    criarTrecho(id,dados,callback) {
        this._connection.collection('tablatura').find({_id: id}).toArray((err,results)=>{
            let trechos = results[0]._trechos;
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

            this._connection.collection('tablatura').updateOne({_id: id},
                {
                    $set: {
                        _trechos: trechos
                    }
                }, 
                callback
            );
        });
    }
    updateTrecho(id,trechos,callback) {
        this._connection.collection('tablatura').updateOne({_id: id},
            {
                $set: {
                    _trechos: trechos
                }
            },
            callback
        );
    }
    deleteTrecho(id,nome,callback) {
    
        this._connection.collection('tablatura').find({_id: id}).toArray((err, result)=>{
            let valores = result[0];
            let cont = 0;
    
            valores._trechos.forEach(element => {
                if(element.nome == nome) {
                    valores._trechos.splice(cont,1);
                }
                cont++
            });
    
            this._connection.collection('tablatura').updateOne({_id: id},
                {
                    $set: {
                        _trechos: valores._trechos
                    }
                },
                callback
            );
        });
    }
    criarTags(dados,callback) {
        const regex = /[\s,\.;:\(\)\-']/;
        let tags = new Array();

        tags.push(...dados.nome_public.toUpperCase().split(regex));
        tags.push(dados.bpm_table);

        if(dados.nome_banda) tags = tags.concat(...dados.nome_banda.toUpperCase().split(regex));

        return callback(tags);
    }
    pesquisarTags(tag,callback) {
        var regex = new Array();

        console.log(tag);
        tag.forEach(e=>{
            regex.push(new RegExp("("+e+")"));
        })

        console.log(regex);
        this._connection.collection('publicacao').find({tags: {$all: regex},public: true}).toArray(callback);
    }
    criarUsuario(dados,callback) {
        if(dados.senha[0] != dados.senha[1]) {
            return callback(dados,'bagulhos errados')
        }
        let obj = {
            username: dados.username,
            password: dados.password,
            email: dados.email
        }
        this._connection.collection('user').save(obj,callback(undefined,obj));
    }
    getUsuario(nome_usuario,callback) {
        this._connection.collection('user').find({username: nome_usuario}).toArray(callback);
    }
    getUsuarioId(id,callback) {
        this._connection.collection('user').find({_id: id}).toArray(callback);
    }
}

module.exports = () => {
    return Banco;
}