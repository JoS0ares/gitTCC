const { application } = require("express");
const { ObjectID } = require("mongodb");

module.exports.criarTrecho = (application,req,res)=>{
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);

    bancoModel.criarTrecho(ObjectID(req.params.id_tabela) ,req.body, (err,result)=>{
        if (err) return err;
        res.redirect('back');
    });
}
module.exports.updateTrecho = (application,req,res)=>{
    if(req.body.trechos==null) return
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);

    bancoModel.updateTrecho(ObjectID(req.body.id_tabela), req.body.trechos, (err,result)=>{
        if (err) return err
        res.redirect('back');
    });
}
module.exports.deleteTrecho = (application,req,res)=>{
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);

    bancoModel.deleteTrecho(ObjectID(req.params.id_tabela), req.params.nome_trecho, (err,result)=>{
        if (err) return err;
        res.redirect('back');
    });
}