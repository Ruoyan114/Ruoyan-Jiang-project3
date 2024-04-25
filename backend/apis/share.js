const express = require('express')
const router = express.Router();
const ShareModel = require('../db/share/share.model');
const jwt = require('jsonwebtoken')

// POST localhost:8000/api/share/
router.post('/', async function(request, response) {
    const newShare = request.body;

    const username = request.cookies.username;

    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "HUNTERS_PASSWORD")
    } catch(e) {
        return response.status(404).send("Invalid request")
    }


    newShare.from = decryptedUsername;

    try {
        const createShareResponse = await ShareModel.createShare(newShare)
        console.log(createShareResponse)
        return response.send("Share Successfully Created: " + createShareResponse)
    } catch (error) {
        return response.status(500).send(error)
    }
})

router.put('/:id', async function(request, response) {
    const share = request.body;

    const username = request.cookies.username;

    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "HUNTERS_PASSWORD")
    } catch(e) {
        return response.status(404).send("Invalid request")
    }

    try {
        const updateShareResponse = await ShareModel.updateShareStatus(request.params.id, share.status)
        console.log(updateShareResponse)
        return response.send("Share Successfully Updated: " + updateShareResponse)
    } catch (error) {
        return response.status(500).send(error)
    }
})

// http://localhost:8000/api/share
router.get('', function(request, response) {
    const username = request.cookies.username;

    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "HUNTERS_PASSWORD")
    } catch(e) {
        return response.status(404).send("Invalid request")
    }

    ShareModel.getShareByTo(decryptedUsername, 0)
    .then(function(dbResponse) {
        response.send(dbResponse)
    })
    .catch(function(error) {
        response.status(500).send(error)
    })
})

module.exports = router;
