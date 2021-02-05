const { application } = require("express");
const { check, validationResult } = require("express-validator");
const app = require("../../config/server");

module.exports = (application)=>{
    application.get('/view_publicacao/:name/:id', (req,res)=>{
        application.app.controllers.public.viewPublic(application,req,res);
    });
    application.get('/espec_publicacao', (req,res)=>{
        application.app.controllers.public.especPublic(application,req,res);
    });
    // post

    application.post('/criar_public', (req,res) => {
        return application.app.controllers.public.criarPublic(application,req,res);
    });
    application.post('/update_publicacao/:id_public', (req,res) => {
        return application.app.controllers.public.updatePublic(application,req,res);
    });
    application.post('/update_public_publicacao', (req,res)=>{
        return application.app.controllers.public.updateUnicParam(application,req,res);
    });
    application.post('/delete_publicacoes', (req,res)=>{
        return application.app.controllers.public.deletePublic(application,req,res);
    });
    application.post('/like', (req,res)=>{
        return application.app.controllers.public.like(application,req,res);
    });
}