const User = require("../models/user");
const passport = require("passport");

// ==========================
// RENDER SIGNUP PAGE
// ==========================
module.exports.renderSignup = (req, res) => {
    res.render("users/signup");
};

// ==========================
// HANDLE SIGNUP
// ==========================
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });

        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to NextDestination!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// ==========================
// RENDER LOGIN PAGE
// ==========================
module.exports.renderLogin = (req, res) => {
    res.render("users/login");
};

// ==========================
// HANDLE LOGIN
// ==========================
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
};

// ==========================
// LOGOUT
// ==========================
module.exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash("success", "Logged out!");
        res.redirect("/listings");
    });
};
