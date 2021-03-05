const { application } = require("express");
const banco = require("../models/banco");

module.exports.novoUsuario = (application,req,res) => {
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);
    console.log(req.body);

    bancoModel.criarUsuario(req.body,(result,err)=>{
        if(err) console.log(err);
        
        console.log(result);
        return res.redirect('back');
    });
}

module.exports.login = (application,req,res) => {
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);
    console.log(req.body);

    bancoModel.login(req.body,(result,msg)=>{
        if (!msg) console.log('num deu')
        console.log(result);

        return res.redirect('back');
    });
}