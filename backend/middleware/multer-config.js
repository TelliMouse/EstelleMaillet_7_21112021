const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/webp': 'webp',
    'image/svg+xml': 'svg'
};

//Middleware that treats any file attached to the request. In this instance the file is always an image
const storage = multer.diskStorage({
    //Directs the file to the direcrory "images"
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    //Modifies the original filename to make it more unique to avoid errors
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage}).single('image');