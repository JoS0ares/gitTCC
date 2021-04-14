const { application } = require("express");
const passport = require("passport");
const banco = require("../models/banco");

module.exports.cadastrar = (application,req,res) => {
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);

    bancoModel.criarUsuario(req.body,(err,result)=>{
        if (err) return err;
        console.log(result);
        return res.redirect('back');
    });
}