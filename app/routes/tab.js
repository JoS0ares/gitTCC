const { application } = require("express");
const { check, validationResult } = require("express-validator");

module.exports = (application)=>{
    application.get('/delete_trecho/:id_tabela/:nome_trecho', (req,res)=>{
        application.app.controllers.tab.deleteTrecho(application,req,res);
    });

    application.get('/espec_tablatura/:name/:id', (req,res)=>{
        application.app.controllers.tab.especTab(application,req,res);
    });

    
    // post

    application.post('/novo_trecho/:id',[
        check('detalhe_nome','Prencha o campo Nome do trecho sem espaços').not().isEmpty().if(()=>{
            for(var i = 0;i < req.body.detalhe_nome.length;i++) {
                if (req.body.detalhe_nome[i] == " ") {
                    return true
                }
            }
            return false
        })

    ], (req,res) => {
        const erros = validationResult(req).errors;
        console.dir(erros);
        
        application.app.controllers.tab.criarTrecho(application,req,res);
    
    });
    
    application.post('/update_trecho', (req,res) => {
        application.app.controllers.tab.updateTrecho(application,req,res);
    });

}