const User = require('../../models/user')

class Users {

    constructor() {
        this.users = []
    }

    addUser = async(user_id, socket_id) => {

        const user = await User.findById(user_id)

        const { name, username, thumb_img, _id } = user

        this.users.push({ name, username, thumb_img, _id, socket_id, match: '' })

        return this.users
    }

    // return new Promise((resolve, reject) => {
    // })
    getUser = (id) => this.users.filter(user => user.socket_id === id)[0]

    getUserById = (id) => this.users.filter(user => user._id.toString() === id)[0]

    getUsers = () => this.users

    getUsersByMatch = (match_id) => this.users.filter(user => user.match === match_id)

    deleteUser = (id) => {

        let deletedUser = this.getUser(id)

        this.users = this.users.filter(user => user.socket_id != id)

        return deletedUser
    }

}

module.exports = {
    Users
}