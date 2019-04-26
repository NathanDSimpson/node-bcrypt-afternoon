const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res,) => {
        const {username, password, isAdmin} = req.body
        const db = req.app.get('db')
        const result = await db.get_user([username]) // dont forget await. can't do anything with data before we have it
        const existingUser = result[0]
        if (existingUser) {
            return res.status(409).send('Already taken, bro')
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const registeredUser = await db.register_user([isAdmin, username, hash]) 
        const user = registeredUser[0]
        req.session.user = {
            isAdmin: user.is_admin, 
            id: user.id, 
            username: user.username
        }
        res.status(201).send(req.session.user)
    },

    login: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')
        const result = await db.get_user([username])
        const foundUser = result[0]
        if (!foundUser) {
            return res.status(401).send(`You don't exist, bro`)
        }
        const isAuthenticated = bcrypt.compareSync(password, foundUser.hash)
        if (!isAuthenticated) {
            return res.status(403).send(`Get it right, bro`)
        }
        req.session.user = {isAdmin: foundUser.is_admin, id: foundUser.id, username: foundUser.username}
        res.status(200).send(req.session.user)
    },

    logout: (req, res) => {

    }
}