class NewControllers {

    // [GET] /news    
    index(req, res){
        res.render('newtab');
    }
    // [GET] /news/:slug
    show(req, res){
        res.send('NEWS DETAIL!!!');
    }
}

module.exports = new NewControllers;