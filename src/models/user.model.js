const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const Utils = require('../utils/utils');

const User = {
    /** Finds user with username */
    async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const values = [username];
        const result = await pool.query(query, values);
        return result.rowCount > 0 ? result.rows[0] : null;
    },

    /** Finds user with user id. */
    async findById(id) {
        const query = 'SELECT * FROM users WHERE user_id = $1';
        const values = [id];
        const result = await pool.query(query, values);
        return result.rowCount > 0 ? Utils.userInfoFilter(result.rows[0]) : null;
    },

    /** Creates the user with correct user.  */
    async createUser(username, password, email, name, adminStatus = false) {
        const query = `INSERT INTO users (username, encrypted_password, created_at,
             password_changed_at, admin_status, email, name)
              VALUES ($1, $2, $3, $3, $4, $5, $6) RETURNING *`;
        const encryptedPassword = await encryptPassword(password);
        values = [username, encryptedPassword, new Date(), adminStatus, email, name];
        const result = await pool.query(query, values);
        return result.rowCount > 0 ? Utils.userInfoFilter(result.rows[0]): null;
    },

    /** Logs in the user. */
    async loginUser(username, password) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const values = [username];
        const result = await pool.query(query, values);
        if (result.rowCount > 0) {
            const userInfo = result.rows[0];
            const isPasswordValid = await validateUserCredentials(password, userInfo.encrypted_password);
            if (isPasswordValid) {
                return Utils.userInfoFilter(userInfo);
            }
        }
        return null;
    },

    /** Logs out the user */
    async logoutUser(username) {
        const query = 'UPDATE users SET last_login = $1 WHERE username = $2';
        const values = [new Date(), username];
        const result = await pool.query(query, values);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    },


}

async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

async function validateUserCredentials(password, storedPassword) {
    try {
        // Generate the hashed password using the provided username and password
        const isPasswordValid = await bcrypt.compare(password, storedPassword);

        return isPasswordValid;
    } catch (error) {
        // Handle errors appropriately
        console.error(error);
        throw new Error('User credential validation failed');
    }
}

module.exports = User;
