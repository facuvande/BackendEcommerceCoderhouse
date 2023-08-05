import multer from 'multer'
import * as path from 'path'
import fileDirName from './fileDirName.js'
const {__dirname} = fileDirName(import.meta);


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const fileType = req.fileType;
        let folder;

        switch (fileType) {
            case 'profile':
                folder = 'profiles'
                break;
            case 'product':
                folder = "products"
                break;
            case 'document':
                folder = "documents"
            default:
                folder = "documents"
                break;
        }

        cb(null, path.join(__dirname , '..', 'public', 'img', folder))
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

export const imgsUploader = multer({storage})