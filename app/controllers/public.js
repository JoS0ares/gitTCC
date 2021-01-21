const { application } = require("express");
const { ObjectID } = require("mongodb");

module.exports.viewPublic = (application,req,res)=>{
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);

    bancoModel.getPublic(ObjectID(req.params.id), (err,result)=>{
        if (err) return err;
        let dado = result[0];

        bancoModel.getTab(ObjectID(dado.tab_id),(err,result)=>{
            if (err) return err;
            let tab = result[0];

            res.render('publicacao.ejs', {document: dado,tablatura: tab});
        });
    });
}
module.exports.especPublic = (application,req,res)=>{
    res.render('espec_publicacao.ejs');
}
module.exports.criarPublic = (application,req,res)=>{
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);

    let tab = {};
    tab._trechos = new Array();

    bancoModel.criarTab(tab,(err,result)=>{
        if (err) {
            res.redirect('back');
            return err;
        }
        console.log(tab);

        let dados = req.body;
        dados.data_public = new Date();
        dados.tab_id = tab._id;
        dados.public = false;
        
        bancoModel.criarPublic(dados,(err,result)=>{
            if (err) {
                res.redirect('back');
                return err;
            }
            res.redirect('/espec_tablatura/' + dados.nome_public + '/' + dados._id);
        });
    });
}
module.exports.updatePublic = (application,req,res)=>{
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);
    let public = JSON.parse(req.body.public);
    let dados = req.body;
    dados.public = public;


    bancoModel.updatePublic(ObjectID(req.params.id_public), dados, (err,result)=>{
        if (err) return err;

        res.redirect('back');
    });
}