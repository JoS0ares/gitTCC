const { application } = require("express");

module.exports.pesquisa = (application,req,res) => {
    let connection = application.config.dbConnection.dbConnection();
    let bancoModel = new application.app.models.banco(connection);

    if(!req.query.q) return res.render('pesquisa.ejs', {dados: [], query: ''});
    else {
        const query = simplificarTexto(req.query.q);
        
        bancoModel.pesquisarTags(query,(err,result)=>{
            if(err) return err;
            console.log(result);
            res.render('pesquisa.ejs', {dados: result,query: req.query.q});
        });
    }
}


function simplificarTexto(text) {
    const regex = /[\s,\.;:\(\)\-']/;
    return text.toUpperCase().split(regex);
}