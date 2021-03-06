const { application } = require("express");
const passport = require("passport");
const banco = require("../models/banco");

module.exports.novoUsuario = (application,passport,req,res) => {
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);
    console.log(req.body);

    bancoModel.criarUsuario(req.body,(result,err)=>{
        if(err) console.log(err);
        
        console.log(result);
        return res.redirect('back');
    });
}

module.exports.signup = (application,passport,req,res) => {
    return res.render('login.ejs');
}

module.exports.login = (application,passport,req,res) => {
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);
    console.log(req.body);
    return res.redirect('back');
}