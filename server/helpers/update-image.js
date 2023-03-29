const User = require('../models/user')
const fs = require('fs')
const path = require('path')

const deleteImage = (path) => {

    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }
}

const updateImage = async(type, id, imgName) => {

    let oldPath = ''

    switch (type) {
        case 'users':
            const user = await User.findById(id)
            if (!user) {
                return false
            }

            oldPath = path.resolve(__dirname, `../../uploads/users/${id}/${user.img}`)
            deleteImage(oldPath)

            user.img = imgName
            await user.save()
            return true
            break
    }
}

module.exports = {
    updateImage
}