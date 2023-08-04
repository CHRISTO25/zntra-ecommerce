const Banner = require('../models/bannerModel')


const load_add_banner = async(req,res)=>{
    try {
        res.render('add_banner')
    } catch (error) {
        console.log(error.message);
    }
}

const insert_banner = async(req,res)=>{
     try {
     const name = req.body.name
     const image =req.file

     const banner = new Banner({
        banner_name:name,
        banner_image:image.filename
       
    });

    await banner.save();
          

        res.redirect('/add_banner')
     } catch (error) {
       console.log(error.message); 
     }
}

const load_banner = async(req,res)=>{
    try {
        const dta = await Banner.find()
        res.render('view_banner',{er:"banner page",data:dta})
    } catch (error) {
        console.log(error.message);
    }
}

const delete_banner = async(req,res)=>{
    try {
        const id =req.query.id
        await Banner.deleteOne({_id:id });
        
    } catch (error) {
        console.log(error.message);
    }
}


const use_the_banner = async(req,res)=>{
    try {
        const id = req.query.id
        
        await Banner.updateOne({_id:id}, {$set:{ in_use: true }});
        res.redirect('/view_banner')
    } catch (error) {
        
    }
} 

const remove_the_banner = async(req,res)=>{
    try {
        const id = req.query.id
        
        await Banner.updateOne({_id:id}, {$set:{ in_use: false }});
        res.redirect('/view_banner')
    } catch (error) {
        
    }
} 

module.exports={
    load_add_banner,
    insert_banner,
    load_banner,
    delete_banner,
    use_the_banner,
    remove_the_banner
}