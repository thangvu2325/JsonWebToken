const User = require('../models/User')
class SiteControllers {

    // [GET] /news    
    index(req, res){
  //       User.find({ }).then(doc =>{
  //         res.json(doc) 
  //         console.log(doc) 
  //       }) .catch(err=>{ res.status(400).json({error:'Bị lỗi'}) 
  //       console.log(err) 
  //  })
      res.render('home');
    }
    // [GET] /news/:slug
    search(req, res){
        res.render('search');
    }
}

module.exports = new SiteControllers;