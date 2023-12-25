const gravatar = require('gravatar');
const { userSchema } = require('../schemas/usersSchema')

module.exports = userSchema.pre('save', function (next) {
    if (!this.avatarURL) {
        const avatar = gravatar.url(this.email, { s: '200', r: 'pg', d: 'mm' });
        this.avatarURL = avatar;
    }
    next();
});