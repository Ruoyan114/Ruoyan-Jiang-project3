const express = require('express')
const router = express.Router();
const PasswordModel = require('../db/password/password.model');
const ShareModel = require('../db/share/share.model');
const jwt = require('jsonwebtoken')

// POST localhost:8000/api/password/
router.post('/', async function(request, response) {
    const newPassword = request.body;

    const username = request.cookies.username;

    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "HUNTERS_PASSWORD")
    } catch(e) {
        return response.status(404).send("Invalid request")
    }


    newPassword.username = decryptedUsername;

    try {
        const matchedPassword = await PasswordModel.getPasswordByUsernameAndUrl(newPassword.username, newPassword.url);
        if (matchedPassword) {
            const updatePasswordResponse = await PasswordModel.updatePassword(matchedPassword._id, newPassword.password)
            return response.send("Password Successfully Updated: " + updatePasswordResponse)
        } else {
            const createPasswordResponse = await PasswordModel.createPassword(newPassword)
            console.log(createPasswordResponse)
            return response.send("Password Successfully Created: " + createPasswordResponse)
        }
    } catch (error) {
        return response.status(500).send(error)
    }
})

router.get('/', async function(request, response) {

    const username = request.cookies.username;

    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "HUNTERS_PASSWORD")
    } catch(e) {
        return response.status(404).send("Invalid request")
    }

    const matchedShare = await ShareModel.getShareByTo(decryptedUsername, 1)
    const shareUsernames = matchedShare.map(share => share.from)
    PasswordModel.findPasswordByUsername(decryptedUsername, shareUsernames)
        .then(function(dbResponse) {
            response.cookie("passwordCount", dbResponse.length + 1)
            response.send(dbResponse)
        })
        .catch(function(error) {
            response.status(500).send(error)
        })

})

// http://localhost:8000/api/password/id
router.get('/:id', function(request, response) {
    const passwordId = request.params.id;

    PasswordModel.getPasswordById(passwordId)
    .then(function(dbResponse) {
        response.send(dbResponse)
    })
    .catch(function(error) {
        response.status(500).send(error)
    })
})


router.delete('/:id', async function(req, response) {
    const passwordId = req.params.id;

    const deleteResponse = await PasswordModel.deletePassword(passwordId)
    return response.send("Successfully delete password!")
})

module.exports = router;
