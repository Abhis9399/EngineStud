import product from "../../models/product";
import connectDb from "../../middleware/mongo";

const handler = async (req, res) => {
    if (req.method == 'POST') {
        console.log(req.body);
        for (let i = 0; i < req.body.length; i++) {
            // Corrected the syntax for creating a new product
            let p = new product({
                title: req.body[i].title,
                slug: req.body[i].slug,
                desc: req.body[i].desc,
                img: req.body[i].img,
                category: req.body[i].category,
                size: req.body[i].size,
                color: req.body[i].color,
                price: req.body[i].price,
                availableQty: req.body[i].availableQty,
            });

            try {
                // Corrected the await syntax for saving
                console.log("save")
                await p.save();
            } catch (error) {
                // Handle error if save fails
                console.error("Error saving product:", error.message);
                return res.status(500).json({ error: "Error saving product" });
            }
        }
        res.status(200).json({ success: "Success" });
    } else {
        res.status(400).json({ error: "This method is not allowed" });
    }
};

export default connectDb(handler);
