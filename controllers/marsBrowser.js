
exports.getMarsBrowser = (req, res) => {
    if(!req.session.isLogged)
        return res.redirect('/login');
    res.render('marsBrowser',{name: req.session.firstName + " " + req.session.lastName});
};

exports.getLogout = (req, res) => {
    req.session.isLogged=false;
    //req.session.save();
    res.redirect('/');
};



