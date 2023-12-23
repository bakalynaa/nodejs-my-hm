const UserModel = require("../schemas/usersSchema");
const bcrypt = require("bcrypt");



const findUser = async (req, option) => {
    const foundUser = await UserModel.findOne({ [option]: req });
    return foundUser || null;
};

const createUser = async (body) => {
    const password = await bcrypt.hash(body.password, 10);
    const createdUser = await UserModel.create({
        ...body,
        password,
    });
    return createdUser || null;
};

const loginUser = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
};


module.exports = {
    loginUser,
    createUser,
    findUser
}
