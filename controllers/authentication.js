const db = require('../models');

exports.getRegister = (req, res) => {
    //console.log(req.cookies?.ErrorTime);
    //req.session.registered = undefined;
    res.render('register', {message: req.cookies?.message});
    res.cookie('message', '0');
    res.cookie.save;
};

exports.getLogin = (req, res, next) => {
    res.cookie('message', '0');//????????????????????????????????????????????????????????
    console.log('11: ' + req.session.loginMessage);
    res.render('login', {message: req.session.loginMessage});
    req.session.loginMessage = '';
    req.session.save();
    console.log('14: ' + req.session.loginMessage);
}


exports.getPassword = (req, res) => {
    //console.log(req.session.registered);
    res.render('password', {email: req.session.email});
}

exports.postPassword = (req, res) => {
    let onTime = req.cookies?.LoginProcess;//cookies.get('LoginProcess', {signed: true});
    console.log('time: ' + onTime);
    if (!onTime) {
        res.cookie('message', '1');
        return res.redirect('/register');
    }//render('register', {onTime: false});
    let theEmail = req.session.email;
    return db.User.findOne({
        where: {email: theEmail},
        attributes: ['email']
    }).then((email) => {
        if (email === null) {
            console.log('free: true, ' + email);
            return db.User.create({
                firstName: req.session.firstName,
                lastName: req.session.lastName,
                password: req.body.thePassword.trim(),
                email: theEmail
            })
                .then((contact) => {
                    console.log('**** user crated!');
                    req.session.loginMessage = 'registered';
                    res.redirect('/login');
                    //req.session.registered = false;
                    console.log('49: ' + req.session.loginMessage);
                })
                .catch((err) => {
                    console.log('***There was an error creating a user', JSON.stringify(contact));
                    return res.redirect('/');
                })

        } else {
            console.log('**** the email already busy!');
            res.cookie('message', '2');
            return res.redirect('/register');
        }

    }).catch((err) => {
        console.log('****Failed to check email duplication number 2', JSON.stringify(err));
        err.error = 1; // some error code for client side
        return res.send(err)
    });
}


exports.postLogin = (req, res) => {
    let theEmail= req.body.email.trim();
    let thePassword= req.body.password.trim();
    return db.User.findOne({
        where: {email: theEmail},
        //attributes: ['email','password']
    }).then((user) => {
        if (user?.email==theEmail && user?.password==thePassword) {
            console.log('****user exist: true, ' + user.firstName+" "+user.lastName);
            req.session.isLogged=true;
            req.session.email=user.email;
            req.session.firstName = user.firstName;
            req.session.lastName = user.lastName;
            //req.session.save();
            res.redirect('/logged/marsBrowser');
            }
        else{
            console.log('user exist: false, ' + user);
            req.session.loginMessage = 'errorLoginDetails';
            res.redirect('/login');
        }
        }).catch()
};
