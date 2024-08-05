const fs = require('fs');

const Photo = require('../models/Photo');


exports.getAllPhotos = async (req, res) => {
    //res.sendFile(path.resolve(__dirname, "views/index.html")); // Static dosya göndermek istersek

    const currentPage = req.query.page || 1;
    const photosPerPage = 2;
    const totalPhotos = await Photo.find().countDocuments();

    const photos = await Photo.find()
        .sort('-createdDate') // Descending sıralama için -
        .skip((currentPage - 1) * photosPerPage)
        .limit(photosPerPage);

    res.render("index", {
        photos,
        current: currentPage,
        pages: Math.ceil(totalPhotos / photosPerPage)
    }); // Default olarak views klasörün de index.ejs dosyasını arıyacaktır.

};

exports.getPhotoById = async (req, res) => {
    const photo = await Photo.findById(req.params.id);

    res.render('photo', {
        photo
    });
};

exports.createPhoto = async (req, res) => {

    const uploadDir = __dirname + '/../public/uploads';

    if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir);

    const beUploadedImg = req.files.image;
    console.log(beUploadedImg);

    beUploadedImg.mv(uploadDir + '/' + beUploadedImg.name, async (err) => {
        if (err) throw err;

        await Photo.create({
            ...req.body,

            // app.use(fileUpload()) middleware'i file verisinin req.body içerisinde değil de, 
            // req.files içerisinde gelmesine neden olduğu için image name'i manuel ekliyoruz.
            image: beUploadedImg.name
        });

        res.redirect('/');
    })
};

exports.updatePhoto = async (req, res) => {

    const photo = await Photo.findById(req.params.id);

    photo.title = req.body.title;
    photo.description = req.body.description;

    await photo.save();

    res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {

    const photo = await Photo.findById(req.params.id);

    fs.unlinkSync(`${__dirname}/../public/uploads/${photo.image}`);

    await photo.deleteOne();

    res.redirect('/');
};