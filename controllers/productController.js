const { Long } = require('mongodb');
const Category=require('../models/categoriesModel')
const User = require('../models/categoriesModel')
const Product=require('../models/productModel')


const loadAddproduct=async(req,res)=>{
    try {
      const  catData= await Category.find()
         if(catData)
         {
            res.render('productadd',{data:catData})
         }
         else{
            res.render('productadd',{data:"no categorys are added"})
         }
       
    } catch (error) {
        console.log(error.message);
    }
}

const insertProducts=async(req,res)=>{
    try {
      const  product_name=req.body.name
      const  product_description=req.body.description
      const  product_quantity=req.body.quantity
        const files = req.files;
        const  product_image = [];

        files.forEach((file) => {
            const image = file.filename;
             product_image.push(image);
        });
        product_category=req.body.category
        console.log(product_category);
        product_price=req.body.price

        const productExist = await Product.findOne({product_name : product_name });
        console.log(productExist)
        if (!productExist) {
            const product = new Product({
                product_name:product_name,
                product_description:product_description,
                product_quantity:product_quantity,
                product_price:product_price,
                product_category:product_category,
                product_image:product_image
                
            });

            await product.save();
            // req.session.categorySave = true;
            res.redirect('/view_products');

        } else {
            req.session.productExist = true;
            res.render('productadd');
        }

    } catch (error) {
        console.log(error.message);
    }
}
const loadviewProducts=async(req,res)=>{
    try {
        const productData=await Product.find()
        console.log(productData,"=====================================");
        if(productData){
            res.render('productView',{data:productData,er:" Product details has been founded"})
        }
        else{
            res.render('productView',{er:"Data not found"})
        }
    } catch (error) {
        console.log(error.message);
    }
}


const loadActive_Disable=async(req,res)=>
 {
    try {
        const id=req.query.id
        console.log(id);
        const productfind = await Product.find({_id:id});
         console.log(productfind[0].product_verified);
        if(productfind[0].product_verified==true)
        {
            await Product.findByIdAndUpdate({_id:id},{$set:{product_verified:false}})
        }
        else{
            await Product.findByIdAndUpdate({_id:id},{$set:{product_verified:true}})
        }
       
        const data = await Product.find();

        if (data) {
           res.redirect('/view_products')      
        } else {
            res.render('productView',{er:"cannot make changes to this the user"})
        }
       
    } catch (error) {
        console.log(error.message);
    }
 }

 const loadProductedit=async(req,res)=>{
    try {
        const id=req.query.id
        
        const  catData= await Category.find()
        const productfin = await Product.find({_id:id});
        const productfind =productfin[0]
         if(catData && productfind)
         {
            res.render('productEdit',{data:catData,datas:productfind})
         }
         else{
            res.render('productEdit',{data:"no categorys are added"})
         }
    } catch (error) {
        console.log(error.message);
    }
 }

 const productEdit =async(req,res)=>{
    try {
        id=req.body.id
        product_name=req.body.name
        product_description=req.body.description
        product_quantity=req.body.quantity
        product_image=req.file
        product_category=req.body.category
        product_price=req.body.price
        
         if(product_image){
        await Product.findByIdAndUpdate({_id:id},{$set:{product_name:product_name,product_description:product_description,product_quantity:product_quantity,product_image:product_image.filename,product_category:product_category,product_price:product_price}})
         }
         else
         {
            await Product.findByIdAndUpdate({_id:id},{$set:{product_name:product_name,product_description:product_description,product_quantity:product_quantity,product_category:product_category,product_price:product_price}})

         }

        const data = await Product.find();

        if (data) {
           res.redirect('/view_products')      
        } else {
            res.render('productView',{er:"cannot make changes to this the user"})
        }

    } catch (error) {
        console.log(error.message);
    }
 }


module.exports={
    loadAddproduct,
    insertProducts,
    loadviewProducts,
    loadActive_Disable,
    loadProductedit,
    productEdit
}