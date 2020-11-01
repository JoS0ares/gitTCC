const { application } = require("express");
const { ObjectID } = require("mongodb");
const banco = require("../models/banco");

module.exports.home = (application,req,res)=>{
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);

    bancoModel.getAllPublicTrue((err,result)=>{
        if (err) return err;
        res.render('index.ejs', {dados: result});
    });
}