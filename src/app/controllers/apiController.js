class apiControllers {

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
    handleDataReceive(req, res){
        console.log(res.body);
    }
}

module.exports = new apiControllers;