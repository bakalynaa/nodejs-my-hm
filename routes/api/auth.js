const express = require("express");
const validateBody = require("../../middleware/validateBody");
const { registerSchema, loginSchema, updateSubsSchema } = require("../../schemas/userJoiSchemas");
const UsersController = require("../../controllers/UsersController");
const authenticate = require("../../middleware/authenticate");

const router = express.Router()

router.post("/register", validateBody(registerSchema),
    UsersController.createUser );

router.post("/login", validateBody(loginSchema), UsersController.loginUser);

router.patch("/",
    validateBody(updateSubsSchema),
    authenticate,
    UsersController.updateSubscription);

router.patch("/logout", authenticate, UsersController.logout);

router.get(
    "/current",
    authenticate,
    UsersController.getCurrentContacts
);


module.exports = router