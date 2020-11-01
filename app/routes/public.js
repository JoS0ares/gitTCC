const { application } = require("express");
const app = require("../../config/server");

module.exports = (application)=>{
    application.get('/view_publicacao/:name/:id', (req,res)=>{
        application.app.controllers.public.viewPublic(application,req,res);
    });
    application.get('/espec_publicacao', (req,res)=>{
        application.app.controllers.public.especPublic(application,req,res);
    });
    application.get('/espec_tablatura/:name/:id', (req,res)=>{
        application.app.controllers.public.especTab(application,req,res);
    });

    // post

    application.post('/criar_public', (req,res) => {
        application.app.controllers.public.criarPublic(application,req,res);
    });
    
    application.post('/update_publicacao/:id_public', (req,res) => {
        application.app.controllers.public.updatePublic(application,req,res);
    });

}