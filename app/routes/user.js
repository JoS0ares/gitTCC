const { application } = require("express");

module.exports = (application) => {
    application.get('/cadastro', (req,res)=>{
        return res.render('login.ejs');
    });

    application.post('/cadastrar', (req,res)=>{
        return application.app.controllers.user.novoUsuario(application,req,res);
    });
    application.post('/login', (req,res)=>{
        return application.app.controllers.user.login(application,req,res);
    })
}