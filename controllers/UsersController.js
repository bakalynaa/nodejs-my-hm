const asyncHandler = require("express-async-handler");
const UsersService = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../schemas/usersSchema");
const uuid = require("node:uuid");
const sendEmail = require("../emailSender");


const createUser = asyncHandler(async ({body}, res) => {
    const foudnUser = await UsersService.findUser(body.email);

    if (foudnUser) {
        res.status(409);
        new Error("Email in use");
    }

    const verificationToken = uuid.v4();

    const createdUser = await UsersService.createUser(body);

    const verifyEmail = {
        to: createdUser.email,
        subject: "Verify email",
        html: `<a target="_blank" href="http://localhost:${process.env.PORT}/users/verify/${verificationToken}">Verify your email</a>`,
    };

    sendEmail(verifyEmail);

    res.status(201).json({
        code: 201,
        message: "Created",
        user: {
            email: createdUser.email,
            subscription: createdUser.subscription,
        },
    });
});

const loginUser = asyncHandler(async ({body}, res) => {
    const {email, password} = body;
    const user = await UsersService.findUser(email, "email");

    if (!user || !bcrypt.compareSync(password, user.password)) {
        res.status(401);
        throw Error("Email or password is wrong");
    }

    const payload = {id: user._id};

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'qWesz0874531764X', {
        expiresIn: "23h",
    });

    user.token = token;
    await user.save();

    res.status(200).json({
        code: 200,
        message: "ok",
        token: user.token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    });
});

const logout = asyncHandler(async (_, res) => {
    const {locals} = res;
    const user = await UsersService.findUser(locals.user.id, "_id");
    user.token = null;
    await user.save();
    res.status(204).json({code: 204, message: "No Content"});
});

const getCurrentContacts = asyncHandler(async (req, res) => {
    const {id} = res.locals.user;

    const user = await UsersService.findUser(id, "_id");

    if (!user) {
        res.status(401);
        throw Error("Bad request, unauthorized");
    }

    res.status(200).json({
        code: 200,
        message: "ok",
        user: {email: user.email, subscription: user.subscription},
    });
});

const updateSubscription = asyncHandler(async (req, res) => {
    const {id} = res.locals.user;

    const user = await UsersService.findUser(id, "_id");

    if (!user) {
        res.status(401);
        throw Error("Bad request, unauthorized");
    }

    const newSubscription = req.body.subscription;
    console.log(typeof newSubscription);

    user.subscription = newSubscription;
    await user.save();

    res.status(200).json({
        code: 200,
        message: "ok",
        user: {email: user.email, subscription: user.subscription},
    });
});

const updateContactAvatar = async (userId, avatarURL) => {
    try {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { avatarURL },
            { new: true }
        );

        return user;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createUser,
    loginUser,
    logout,
    updateSubscription,
    getCurrentContacts,
    updateContactAvatar
}