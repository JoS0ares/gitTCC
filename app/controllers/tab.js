const { application } = require("express");
const { ObjectID } = require("mongodb");

module.exports.criarTrecho = (application,req,res)=>{

    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);
    console.log(req.body);

    bancoModel.criarTrecho(ObjectID(req.params.id) ,req.body, (err,result)=>{
        if (err) return err;
        res.redirect('back');
    });
}
module.exports.especTab = (application,req,res) => {
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);

    bancoModel.getPublic(ObjectID(req.params.id), (err,result)=>{
        if (err) return err;
        dado = result[0];
        console.dir(dado);

        bancoModel.getTab(ObjectID(dado.tab_id),(err,result)=>{
            if (err) return err;
            let tab = result[0];

            res.render('espec_tablatura.ejs', {document: dado,tablatura: tab});
        });
    });
}
module.exports.updateTrecho = (application,req,res)=>{
    if(req.body.trechos==null) return
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);

    bancoModel.updateTrecho(ObjectID(req.body.id_tabela), req.body.trechos, (err,result)=>{
        if (err) return err
        return res.redirect('back');
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