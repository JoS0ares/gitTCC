class Banco {
    constructor(connection) {
        this._connection = connection;
    }
    getAllPublicTrue(callback) {
        this._connection.collection('publicacao').find({public: true}).toArray(callback);
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
}

module.exports = () => {
    return Banco;
}