const { application } = require("express");
const app = require("../../config/server");

module.exports = application=>{
    application.get('/admin', (req,res)=>{
        application.app.controllers.admin_home.admin(application,req,res);
    });
}