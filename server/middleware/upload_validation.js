const path = require('path')

const verifyImage = (imageFile, res) => {

    if (!imageFile) {
        return res.status(400).json({
            err: {
                message: 'Error at uploading Image'
            }
        })
    }

    let validExtensions = ['png', 'jpg', 'jpeg']
    let cutName = imageFile.name.split('.')
    let extension = cutName[cutName.length - 1]

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(200).json({
            ok: false,
            err: {
                message: 'Valid extensions are: ' + validExtensions.join(', '),
                extension
            }
        })
    }

    return imageFile.name
}

module.exports = {
    verifyImage
}