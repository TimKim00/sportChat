const User = require('../models/user.model');
const Utils = require('../utils/utils');


/** Registers the user */
exports.registerUser = async (req, res) => {
  const { username, password, email, name, adminStatus } = req.body;

  try {
    // Check that username and password are provided
    const user = await User.findByUsername(username);
    if (user) {
      return res.status(400).json({ msg: 'Registration Failed.' });
    }

    // Create a new user. 
    const newUser = await User.createUser(username, password, email, name, adminStatus);
    res.status(201).json(Utils.createUserToken(newUser));

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

/** Logs in the user */
exports.loginUser = async (req, res) => {
  const {username, password} = req.body;
  try {
    const userInfo = await User.loginUser(username, password);
    if (!userInfo) {
      return res.status(401).json({ msg: 'Login Failed.' });
    }
    return res.status(201).json(Utils.createUserToken(userInfo));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

/** Logs out the user */
exports.logoutUser = async (req, res) => {
  try {
    const result = User.logoutUser(req.body.username);
    if (!result) {
      return res.status(401).json({ msg: 'Logout Failed.' });
    }
    return res.status(204).json({ msg: 'Logout Successful.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

/** Removes the user account */
exports.deleteUser = async (req, res) => {
  
}


