const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
require('dotenv').config();

exports.user_login_post = [
    body('username', 'Username required.').isLength({ min: 3 }).trim(),
    body('password', 'Password must atleast 6 characters.').isLength({ min:6 }),
    sanitizeBody('*'),

    // Process the request after validating.
    (req, res) => {
        // Save errors from validation, if any.
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            res.status(400).send({ errors: errors.array() })
        }
        else {
            const username = req.body.username.toLowerCase()
            const password = req.body.password
            // Create a token for the user.
            const token = jwt.sign({ username: username }, process.env.jwtSecret,
                {expiresIn: 21600 })
            // Set token in header
            req.headers['token'] = token
            res.status(200).send({ user: username, authorized: true, token: token })
        }
    },
];
