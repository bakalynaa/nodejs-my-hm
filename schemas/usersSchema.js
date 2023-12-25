const { model, Schema } = require("mongoose");
const {mongooseHandleError} = require("../middleware/mongooseHandleError");


const userSchema = new Schema(
    {
        name: {
            type: String,
            default: "User",
        },
        password: {
            type: String,
            required: [true, "Set password for user"],
            minlength: 6,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter",
        },
        token: { type: String, default: null },
        avatarURL: String,
    },
    { versionKey: false, timestamps: true }
);

userSchema.post("save", mongooseHandleError);
module.exports = model("user", userSchema);


