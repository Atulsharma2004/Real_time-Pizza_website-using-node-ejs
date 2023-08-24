const User = require('../../models/user')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const passport = require('passport')
function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }

    return {
        login(req, res) {
            res.render('auth/login')
        },


        register(req, res) {
            res.render('auth/register')
        },

        async postLogin(req, res, next) {
            const { name, email, password } = req.body;
            //validate request
            if (!email || !password) {
                req.flash('error', 'Please fill in all required field!');
                return res.redirect('/login');
            }

            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message);
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message);
                    return res.redirect('/login')
                }

                req.login(user, (err) => {
                    if (err) {
                        req.flash('error', info.message);
                        return next(err)
                    }
                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },

        async postRegister(req, res) {
            const { name, email, password } = req.body;
        
            try {
                if (!name || !email || !password) {
                    req.flash('error', 'Please fill in all required fields!');
                    req.flash('name', { name: name });
                    req.flash('email', { email: email });
                    return res.redirect('/register');
                } else {
                    // Check if email exists asynchronously
                    const emailExists = await User.exists({ email: email });
        
                    if (emailExists) {
                        req.flash('error', 'Email already taken');
                        req.flash('name', { name: name });
                        req.flash('email', { email: email });
                        return res.redirect('/register');
                    }
                    else{
                        // Hash password
                    const hashedPassword = await bcrypt.hash(password, 10);
        
                    // Create a user
                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedPassword
                    });
        
                    // Save user to the database
                    await user.save();
        
                    // Successful registration, redirect to login or homepage
                    return res.redirect('/login');
                    }
                }
            } catch (err) {
                req.flash('error', 'Something went wrong');
                return res.redirect('/register');
            }
        },
        

        logout(req, res, next) {
            req.logout(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/')
            });

        }
    }
}

module.exports = authController;