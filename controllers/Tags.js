const Tag = require("../models/tags");

// create Tag ka handle function

exports.createTag = async (req, res) => {
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
        const tagDetails = await Tag.create({
            name: name,
            description: description,
        })
        console.log(tagDetails);

        //retunr response
        return res.status(200).json({
            success: true,
            message: "Tag created Successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//getAlltags handler function

exports.showAlltags = async(req,res)=>{
    try{
        const allTags = await Tag.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            message:"All tag returned successfully",
            allTags,
        })

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
