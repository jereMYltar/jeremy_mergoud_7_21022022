// Import Product Model
import User from "../models/user_model";
 
// Get all products
export const getProducts = async (req, res) => {
    try {
        const users = await User.findAll();
        res.send(users);
    } catch (err) {
        console.log(err);
    }
}