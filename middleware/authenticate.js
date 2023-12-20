const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const [bearer, token] = authHeader.split(" ");

        if (bearer === "Bearer" && token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'qWesz0874531764X');
                res.locals.user = decoded;
                next();
            } catch (error) {
                res.status(401);
                throw Error("Not authorized");
            }
        } else {
            res.status(401);
            throw Error("Invalid authorization format");
        }
    } else {
        res.status(401);
        throw Error("Authorization header missing");
    }
};