const db = require('../models');

exports.postRegister = (req, res) => {
    res.cookie("LoginProcess", 'true', {maxAge: 60 * 1000});
    let theEmail = req.body.email.trim();
    return db.User.findOne({
        where: {email: theEmail},
        attributes: ['email']
    }).then((email) => {
        console.log(email);
        if (email) {
            console.log('emailIsFree: false, ' + email);
            res.send(false);
        } else {
            req.session.email = theEmail;
            req.session.firstName = req.body.firsName.trim();
            req.session.lastName = req.body.lastName.trim();
            console.log('emailIsFree: true, ' + email);
            res.send(true);
        }
    })
        .catch((err) => {
            console.log('****Failed to check email duplication number 1', JSON.stringify(err));
            err.error = 2; // some error code for client side
            return res.redirect('/register');
        });
}
const checkLogin=(req, res)=>{
    if(!req.session.isLogged) {
       return res.send('7');
    }
}

exports.getAllImages= (req, res) => {
    // if(!req.session.isLogged)
    //     res.send('1');
    //checkLogin(req, res);

    return db.Image.findAll({where: {email: req.session.email}})//or req.ssasion.email????????????????????????????????????
        .then((images) =>{
            //if(images[0]?.email){
            console.log( '******** row34 : ' +images);
            res.send(images);//}
            //else res.send(false);
        })
        .catch((err) => {
            console.log('There was an error get the images', JSON.stringify(err))
            return res.send(err)
        });
}
exports.postImage= (req, res) => {
   // const image = req.body;
        //{ imgID, earth_date, sol, camera, rover, img_src} = req.body;
    //image.email=req.session.email;
    //checkLogin(req, res);
    // if(!req.session.isLogged) {
    //     return res.send('7');
    // }else {
        console.log(req.body);
        return db.Image.create({
            earth_date: req.body.earth_date,
            imgID: req.body.id,
            sol: req.body.sol,
            camera: req.body.camera.name,
            rover: req.body.name,
            img_src: req.body.img_src,
            email: req.session.email
        })
            .then((img) => res.send(img))
            .catch((err) => {
                console.log('*** error creating a image', JSON.stringify(err));
                return res.redirect('/marsBrowser/logout');
            })
   // }
};

exports.deleteImage= (req,res)=>{
    //checkLogin(req, res);
    // if(!req.session.isLogged)
    //     return res.send('7');
    console.log('****** row 67'+req.params.imgID);
    return db.Image.findOne({where: {email: req.session.email ,imgID: req.params.imgID}})//or req.ssasion.email????????????????????????????????????
        .then((image) => {
            console.log(image);
            image.destroy({force: true});
        })
        .then(()=> {
            console.log('the image is delate');
            res.send(true);
            }
        )
        .catch((err) => {
            console.log('There was an error delete the images', JSON.stringify(err))
            return res.send(err)
        })

}

exports.deleteAllImages=(req,res)=>{
    //checkLogin(req, res);

    return db.Image.findAll({where: {email: req.session.email}})
        .then((images) => images.forEach((image)=>image.destroy({ force: true })))
        .then(() => {
                res.send(true);
                console.log('all images delate');
            }
        )
        .catch((err) => {
            console.log('There was an error delete the images', JSON.stringify(err))
            return res.send(err)
        })

}

//     .catch((isFree) => {
//     console.log('17: ' + isFree)
//     // console.log('****Failed to check email duplication number 1', JSON.stringify(err));
//     // err.error = 1; // some error code for client side
//     // return res.send(err)
//     return isFree;
// })
//  .then((isFree) => {
//if (email===null)
//     req.session.email = theEmail;
//     req.session.firsName = req.body.firsName;
//     req.session.lastName = req.body.lastName;
//     console.log('emailIsFree: true, ' + isFree);
//     res.send(true);

//        })


//let emailIsBusy = users.find((user) => user.email === theEmail) === undefined;
// if (!emailIsBusy) {
//     req.session.email = theEmail;
//     req.session.firsName = req.body.firsName;
//     req.session.lastName = req.body.lastName;
// }
// console.log('emailIsBusy' + emailIsBusy);
// res.json(emailIsBusy);