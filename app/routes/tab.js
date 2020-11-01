const { application } = require("express");

module.exports = (application)=>{
    application.get('/delete_trecho/:id_tabela/:nome_trecho', (req,res)=>{
        application.app.controllers.tab.deleteTrecho(application,req,res);
    });
    
    // post

    application.post('/novo_trecho/:id_tabela', (req,res) => {
        application.app.controllers.tab.criarTrecho(application,req,res);
    });
    
    application.post('/update_trecho', (req,res) => {
        application.app.controllers.tab.updateTrecho(application,req,res);
    });

}