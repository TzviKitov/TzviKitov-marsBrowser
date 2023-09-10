const db = require('../models');

//
exports.postRegister = (req, res) => {
    res.cookie("LoginProcess", 'true', {maxAge: 60 * 1000});//Enable a cookie time limit
    let theEmail = req.body.email.trim();
    return db.User.findOne({
        where: {email: theEmail},
        attributes: ['email']
    }).then((email) => {
        console.log(email);
        if (email)
            res.send(false);
         else {
            req.session.email = theEmail;
            req.session.firstName = req.body.firsName.trim();
            req.session.lastName = req.body.lastName.trim();
            res.send(true);
        }
    })
        .catch(() => {
            return res.redirect('/register');////In the event of a database access error, the user will be redirected to the re-login page.
        });
}

//View all saved images for the logged in user (while loading the main page).
// In the event of an access to the database error, the user will be disconnected from the site and will be directed to the login page
exports.getAllImages= (req, res) => {
    return db.Image.findAll({where: {email: req.session.email}})
        .then((images) =>{
            res.send(images);
        })
        .catch((err) => {
            return res.redirect('/marsBrowser/logout');
        });
}

//Send a photo with all its details to save in the database. In the event of an access to the database error, the user will be disconnected from the site and will be directed to the login page
exports.postImage= (req, res) => {
        console.log(req.body);
        return db.Image.create({
            earth_date: req.body.earth_date,
            imgID: req.body.id,
            sol: req.body.sol,
            camera: req.body.camera.name,
            rover: req.body.name,
            img_src: req.body.img_src,
            email: req.session.email
        }).then(()=> {
            res.send(true);
        })
            .catch((err) => {
                return res.redirect('/marsBrowser/logout');
            })
};

//Deleting an image and its details from the database. In the event of an access to the database error, the user will be disconnected from the site and will be directed to the login page
exports.deleteImage= (req,res)=>{
    return db.Image.findOne({where: {email: req.session.email ,imgID: req.params.imgID}})
        .then((image) => {
            console.log(image);
            image.destroy({force: true});
        })
        .then(()=> {
            console.log('the image is delate');
            res.send(true);
            }
        )
        .catch(() => {
            return res.redirect('/marsBrowser/logout');
        })

}

//Delete all images and their details from the database. In the event of an access to the database error, the user will be disconnected from the site and will be directed to the login page
exports.deleteAllImages=(req,res)=>{
    return db.Image.findAll({where: {email: req.session.email}})
        .then((images) => images.forEach((image)=>image.destroy({ force: true })))
        .then(() => {
                res.send(true);
            }
        )
        .catch(() => {
            return res.redirect('/marsBrowser/logout');
        })

}
