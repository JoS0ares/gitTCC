const { application } = require("express");

module.exports = (application,passport) => {
    application.get('/cadastro', (req,res)=>{
        return res.render('login.ejs');
    });
}