const { application } = require("express");

module.exports = application => {
    application.get('/pesquisa', (req,res)=>{
        application.app.controllers.pesquisa.pesquisa(application,req,res);
    });
}