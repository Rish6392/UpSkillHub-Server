const Category = require("../models/category");

// create Category ka handle function

exports.createCategory = async (req, res) => {
    try {
        // fetch data
        const { name, description } = req.body;
        // validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All field is required"
            })
        }
        // craete entry in db
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        })
        console.log(categoryDetails);

        //retunr response
        return res.status(200).json({
            success: true,
            message: "category created Successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//showAllCategory handler function

exports.showAllCategory = async(req,res)=>{
    try{
        const allCategory = await Category.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            message:"All category returned successfully",
            allCategory,
        })

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//categoryPageDetails
exports.categoryPageDetails = async(req,res)=>{
    try{
        //get categoryId
        const {categoryId} = req.body;
        //get Courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId)
                                                .populate("courses")
                                                .exec();
        //vlidation
        if(!selectedCategory){
            return res.status(400).json({
                succes:false,
                message:'data not found',
            })
        }
        //get courses from diff category
        const diffrentCategories = await Category.find({
            _id:{$ne:categoryId},
        })
        .populate("courses")
        .exec();
        //get top 10/5 selling courses

        //return res
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                diffrentCategories,
                //
            }
        });

    }
    catch(error){
         console.log(error);
          return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
