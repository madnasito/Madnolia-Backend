const { response } = require("express");
const fs = require('fs')
const path = require('path');
const axios = require('axios')
const FormData = require('form-data');
const { updateImage } = require('../helpers/update-image')


const fileUpload = async(req, res = response) => {

    const type = req.params.type
    const id = req.params.id


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
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif']

    if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({
            ok: false,
            err: 'No valid extension'
        })
    }

    const base64Img = Buffer.from(file.data).toString('base64')

    const formData = new FormData()
    formData.append('image', base64Img)

    axios.post('https://api.imgbb.com/1/upload?key=7105242b4493859bdb130faf8d7774d1', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then(resp => {

        updateImage(id, resp.data.data.url, resp.data.data.thumb.url)

        res.json({
            ok: true,
            img: resp.data.data.url,
            thumb: resp.data.data.thumb.url
        })
    }).catch((err) => {
        return res.status(400).json({
            ok: false,
            err
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