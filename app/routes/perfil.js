const { application } = require("express");

module.exports = (application) => {
    application.get('/cadastro', (req,res)=>{
        return res.render('cadastro.ejs');
    });
}