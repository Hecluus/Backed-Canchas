const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4h" }, (error, token) => {
            if (error) {
                console.log(error);
                reject('No se puede generar el token');
            } else {
                resolve(token);
            }
        })
    })
}

module.exports = {
    generarJWT
}