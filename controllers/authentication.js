const db = require('../models');

//Displays the registration page of the user information, with a notification in case it is activated
exports.getRegister = (req, res) => {
    res.render('register', {message:  req.session.registerMessage});
    req.session.registerMessage='';//Resetting a message After viewing, the message will disappear when the page is refreshed
    req.session.save();
};

//Displays the login page, with a notification in case it was activated
exports.getLogin = (req, res, next) => {
    res.render('login', {message: req.session.loginMessage});
    req.session.loginMessage = '';//Resetting a message After viewing, the message will disappear when the page is refreshed
    req.session.save();
}

//Displays the registration page for entering the password, with the email address on which the password is set
exports.getPassword = (req, res) => {
    res.render('password', {email: req.session.email});
}

//Sending the password and other details of the registrant, for registration in the database. In the event of a time error or duplication of the email (another user has already registered at this address while registering),
// the registration page will be returned with the appropriate message.
// In case there are no errors the user information is registered in the database, and is redirected to the login page with a message that the registration was successful
exports.postPassword = (req, res) => {
    if (!req.cookies?.LoginProcess) {
        req.session.registerMessage='timeError';
        return res.redirect('/register');
    }
    let theEmail = req.session.email;
    let thePassword= req.body.thePassword.trim();
    //Server side validation
    if(!thePassword.length >= 8 || !/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(theEmail)) {
        req.session.registerMessage = 'inputError';
        return res.redirect('/register');
    }
    return db.User.findOne({
        where: {email: theEmail},
        attributes: ['email']
    }).then((email) => {
        if (email === null) {
            return db.User.create({
                firstName: req.session.firstName,
                lastName: req.session.lastName,
                password: thePassword,
                email: theEmail
            })
                .then(() => {
                    req.session.loginMessage = 'registered';
                    res.redirect('/login');
                })
                .catch((err) => {
                    return res.redirect('/register');//In the event of a database access error, the user will be redirected to the re-registration page.
                })
        } else {
            req.session.registerMessage='emailError';
            return res.redirect('/register');
        }
    }).catch((err) => {//
        return res.redirect('/register');//In the event of a database access error, the user will be redirected to the re-registration page.
    });
}

//Sending the email and password to check when logging in. In case the details exist and match, all the details will be recorded in the session, and the user will be directed to the main page of the site.
// If there is an error in the data, the user will be redirected to the login page with the error message
exports.postLogin = (req, res) => {
    let theEmail= req.body.email.trim();
    let thePassword= req.body.password.trim();
    return db.User.findOne({
        where: {email: theEmail},
    }).then((user) => {
        if (user?.email==theEmail && user?.password==thePassword) {
            req.session.isLogged=true;
            req.session.email=user.email;
            req.session.firstName = user.firstName;
            req.session.lastName = user.lastName;
            res.redirect('/logged/marsBrowser');
            }
        else{
            console.log('user exist: false, ' + user);
            req.session.loginMessage = 'errorLoginDetails';
            res.redirect('/login');
        }
        }).catch((err) => {
        return res.redirect('/login');//In the event of a database access error, the user will be redirected to the login page.
    });
};
