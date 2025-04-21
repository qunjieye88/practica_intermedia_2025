const usersModel = require("../models/user")

const findUserEmail = async (user) => {
    const userFinded = await usersModel.findOne({ email: user.email });
    if (userFinded) {
        return userFinded
    } else{
        return null
    } 
};


module.exports = {findUserEmail }