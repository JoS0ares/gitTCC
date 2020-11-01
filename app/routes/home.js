const { application } = require("express");

module.exports = (application)=>{
    application.get('/home', (req,res) => {
        application.app.controllers.home.home(application,req,res);
    });
}