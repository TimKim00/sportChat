const Utils = require('../utils/utils');
require('dotenv').config();

module.exports = async function(req, res, next) {
    // Check for a token in the request headers.
    // If a token is found, verify it using jwt.verify().
    // If the token is valid, extract the user data and attach it to the request object.
    // If the token is not valid, send a 401 Unauthorized response.
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Bearer <token>
    
    try {
        if (!token || !await Utils.validateToken(token)) {
            return res.status(401).json({msg: 'Unauthorized'});
        }
        next();
    } catch (err) {
        res.status(401).json({msg: 'Unauthorized'});
    }
}
