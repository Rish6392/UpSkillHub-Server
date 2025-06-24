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
