const { response } = require("express");
const fs = require('fs')
const path = require('path');

const { v4: uuidv4 } = require('uuid');

const { updateImage } = require("../helpers/update-image");

const fileUpload = (req, res = response) => {

    const type = req.params.type
    const id = req.params.id

    const validTypes = ['users']

    // Verifying the type of content
    if (!validTypes.includes(type)) {
        return res.status(400).json({
            ok: false,
            err: 'Not valid type for upload file'
        })
    }

    // Validation for the archive
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: 'No archive'
        })
    }

    // Process image

    const file = req.files.img

    // Cut name
    const cutName = file.name.split('.')
        // Extension
    const fileExtension = cutName[cutName.length - 1]

    // Validate extension
    const validExtensions = ['png', 'jpg', 'jpeg']

    if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({
            ok: false,
            err: 'No valid extension'
        })
    }

    // Generate file
    const fileName = `${ uuidv4() }.${fileExtension}`

    // Path for save image
    const pathImg = path.resolve(__dirname, `../../uploads/${type}/${req.user}/${fileName}`)

    // Use mv() method to place the file somewhere on your server
    file.mv(pathImg, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: 'Error moving image'
            })
        }

        updateImage('users', req.user, `${fileName}`)

        res.json({
            ok: true,
            message: 'fileUploaded',
            file: fileName
        })

    })


}

const returnImage = (req, res = response) => {

    const type = req.params.type;
    const img = req.params.img;
    const user = req.params.user

    const pathImg = path.join(__dirname, `../../uploads/${ type }/${user}/${ img }`);

    // imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../../uploads/no-image.png`);
        res.sendFile(pathImg);
    }

}

module.exports = {
    fileUpload,
    returnImage
}