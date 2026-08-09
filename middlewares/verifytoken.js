const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    console.log("verifyToken middleware called");
    const token = req.cookies.token || req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Login Failed. Please Login Again' });
        }
        req.userId = decoded._id;
        console.log("Decoded userId:", req.userId);
        next();
    });

}
module.exports = verifyToken;