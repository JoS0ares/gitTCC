const { application } = require("express");
const banco = require("../models/banco");

module.exports.admin = (application,req,res)=>{
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);

    bancoModel.getAllPublic((err,result)=>{
        if (err) console.log(err);
        res.render('admin_home.ejs', {dados: result});
    });
}