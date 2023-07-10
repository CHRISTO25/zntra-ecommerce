
const { Long } = require('mongodb');
const Category=require('../models/categoriesModel')
const User = require('../models/categoriesModel')

const loadCategorypage=async(req,res)=>{
    try {
        const categoryData = await Category.find();
        res.render('categories',{data:categoryData,er:"Make your changes"})
    } catch (error) {
        console.log(error.message);
    }
 }

 const loadAddcategories=async(req,res)=>{
    try {
        res.render('addCategorie',{er:"Add Category here"})
    } catch (error) {
        console.log(error.message);
    }
 }
 
 const addCategorie=async(req,res)=>{
    const Categoryname=req.body.name
    const Categorydescription=req.body.description
    const Categoryimage=req.file
    const lowerCategoryName = Category.find({cat_name:Categoryname})
    try {
        if(!lowerCategoryName){
        const categoryExist = await Category.findOne({ category: lowerCategoryName });
        console.log(categoryExist)
        if (!categoryExist) {
            const category = new Category({
                cat_name:Categoryname,
                cat_image: Categoryimage.filename,
                cat_description: Categorydescription
                
            });

            await category.save();
            req.session.categorySave = true;
            res.redirect('/categories');

        } else {
            req.session.categoryExist = true;
            res.render("addcategorie",{er:"Category name already exists"});
        }
    }
    else{
        req.session.categoryExist = true;
        res.render("addcategorie",{er:"Category name already exists"});
    }
        
    } catch (error) {
        console.log(error.message);
    }
 }

 const disableCategory=async(req,res)=>{
    try {
        const id=req.query.id
        await Category.findByIdAndUpdate({_id:id},{$set:{cat_verify:false}})
        const categoryData = await Category.find();

        if (categoryData) {
            res.render('categories',{er:"your update has been sucessfull",data:categoryData}) 
        } else {
            res.render('/categories',{er:"sorry can't update ur request",data:categoryData})
        }
       
    } catch (error) {
        console.log(error.message);
    }
}

const loadcategoryEditpage=async(req,res)=>{
    try {
        const id=req.query.id
        const categoryData = await Category.find({_id:id});
        console.log(categoryData);

        if (categoryData[0]) {
            res.render('categoryEdit',{data:categoryData[0]}) 
        } else {
            res.render('categories',{er:"cant edit this",data:categoryData})
        }
       
    } catch (error) {
        console.log(error.message);
    }
}
const categoryEditpage=async(req,res)=>{
    try {
        const id=req.body.id
        const Categoryname=req.body.name
        const Categorydescription=req.body.description
        const Categoryimage=req.file
        if(Categoryimage)
        {
            await Category.findByIdAndUpdate({_id:id},{$set:{cat_name:Categoryname,cat_description:Categorydescription,cat_image:Categoryimage.filename}})

        }
        else{
            await Category.findByIdAndUpdate({_id:id},{$set:{cat_name:Categoryname,cat_description:Categorydescription}})
 
        }
        const categoryData = await Category.find();

        if (categoryData) {
            res.render('categories',{er:"your update has been sucessfull",data:categoryData}) 
        } else {
            res.render('/categories',{er:"sorry can't update ur request",data:categoryData})
        }
      
       
    } catch (error) {
        console.log(error.message);
    }
}

 module.exports={loadCategorypage,
                 loadAddcategories,
                 addCategorie,
                 disableCategory,
                 loadcategoryEditpage,
                 categoryEditpage
                }