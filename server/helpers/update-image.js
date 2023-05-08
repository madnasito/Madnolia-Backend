const User = require('../models/user')
const fs = require('fs')
const path = require('path')

const deleteImage = (path) => {

    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }
}

const updateImage = async(id, img, thumb) => {

    let oldPath = ''

    const user = await User.findById(id)
    if (!user) {
        return false
    }


    user.img = img
    user.thumb_img = thumb
    user.save()
}

module.exports = {
    updateImage
}