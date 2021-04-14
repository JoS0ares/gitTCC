const { application } = require("express");

module.exports = (application,passport) => {
    application.get('/cadastro', (req,res)=>{
        return res.render('login.ejs');
    });
    application.post('/cadastrar', (req,res)=>{
        return application.app.controllers.user.cadastrar(application,req,res);
    });
}