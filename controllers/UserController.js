const db = require('../models/index');
const { User } = db;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { json } = require('sequelize');

const login = (req, res, next) => {
    try {
        let body = req.body;
        User.findOne({ where: { email: body.email } })
            .then((usuarioDB) => {

                if (!usuarioDB) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: "Usuario-ontrase{a incorrectos",
                        },
                    });
                }

                // Valida password
                if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: "Usuario-contrase{a incorrectos",
                        },
                    });
                }

                // Genera token
                let token = jwt.sign(
                    {
                        usuario: usuarioDB,
                    },
                    process.env.SEED_AUTENTICACION,
                    {
                        expiresIn: process.env.CADUCIDAD_TOKEN,
                    }
                );
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            })
    } catch (error) {
        error = new Error("An error occurred when login.");
      error.status = 400;
      res.status(400).send("Error 400 when login");
      return next(error);
    }
}
const register = (req, res, next) => {
    try {
        let { id, email, password, dni, phone } = req.body;
        let user = {
            id,
            email,
            dni,
            phone,
            password: bcrypt.hashSync(password, 10)
        }
        User.create(user).then(userDB => {
            return res.status(201).json({
                ok: true,
                user: userDB
            }).end();
        })
    } catch (error) {
        error = new Error("An error occurred when register");
        error.status = 400;
        res.status(400).send("Error, try to register again.");
        return next(error);
    }
}



const logout = (req, res, next) => {
    try {
        //cambia el valor del token
        if (!req.headers.authorization)
            res.cookie('jwt', '', { maxAge: 1 }).json({
                msg: 'Succesfully logged out'
            })
        //y enviamos a donde el front quiera
        //res.redirect('/')
    } catch (error) {
        error = new Error("Error on logout");
        error.status = 400;
        res.status(400).send("Error, try again");
        return next(error);
    }

}

module.exports = {
    register,
    login,
    logout
}