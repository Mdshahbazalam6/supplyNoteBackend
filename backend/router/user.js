let date = new Date();
const express = require('express')
const userModel = require('../database/user')
const route = express.Router()
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const jsonbody = bodyParser.json()
const SECRET = require('../Constant/index')
const jwt = require('jsonwebtoken')
const generateId = require('shortid')
const urlModel = require('../database/short')


const signUp = async (req, res) => {
    const {
        postbody
    } = req.body
    console.log(postbody)
    const {
        name,
        email,
        password
    } = postbody
    try {
        if (name.length == 0 || email.length == 0 || password.length == 0) {
            return res.status(401).send({
                message: 'Please Fill Data Correctly'
            })
        }
        let userExist = await userModel.findOne({
            email
        })

        if (userExist) {
            return res.status(400).send({
                err: 'User Exists'
            })
        } else {
            let data = new userModel({
                name,
                email,
                password
            })
            await data.save()
            return res.status(200).send({
                message: "User Registered Successfully",
                data,
            })
        }
    } catch (error) {
        console.log(error)
    }
}

async function loginUser(req, res) {
    let userbody = req.body.postbody
    let {
        email,
        password
    } = userbody
    let existingUser = await userModel.findOne({
        email: email
    })

    if (existingUser) {
        let isMatched = await bcrypt.compare(password, existingUser.password)
        if (isMatched) {
            let encrypted_Token = jwt.sign({
                id: existingUser._id,
                email: existingUser.email,
                name: existingUser.name,
            }, SECRET)
            return res.send({
                data: {
                    token: encrypted_Token

                },

            })
        } else {
            error: "Password Does not match"
        }


    } else {
        return res.status(404).send({
            error: "User was not found "
        })
    }
}
async function getLoggedinUser(req, res) {

    let {
        token
    } = req.body
    if (token) {
        try {
            let data = jwt.verify(token, SECRET)
            console.log(data)
            return res.status(200).send({
                data,
            })

        } catch (error) {
            return res.status(404).send({
                error: "token not Provided"
            })
        }
    }
}


// ----------------------------------------------------------------------

async function getShort(req, res) {
    console.log(req.body)
    const {
        url
    } = req.body
    try {
        if (!url) {
            return res.status(400).send({
                error: 'Please Provide Some Url'
            })
        } else {
            const UrlExists = await urlModel.findOne({
                url
            })
            if (UrlExists) {
                return res.status(200).send({
                    url: UrlExists
                })
            } else {
                const shortedUrl = new urlModel({
                    url,
                    shortURl: generateId.generate()
                })
                let urlData = await shortedUrl.save()
                return res.status(200).send({
                    url: urlData
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

async function fetchShortUrl(req, res) {
    try {
        const {
            shortId
        } = req.params
        const urlData = await urlModel.findOne({
            shortURl: shortId
        })

        if (!urlData) {
            return res.status(404).send({
                error: "Not Found"
            })
        } else {
            const {
                day
            } = urlData
            const {
                Hour
            } = urlData
            const {
                minutes
            } = urlData


            if (date.getDate() > day + 2) {
                console.log('first')
                await urlModel.deleteOne({
                    _id: urlData._id
                })
                return res.status(401).send({
                    error: 'url Expired'
                })
            } else if (date.getDate() == day + 2 && date.getHours() > Hour) {
                console.log('second')
                await urlModel.deleteOne({
                    _id: urlData._id
                })
                return res.status(401).send({
                    error: 'url Expired'
                })
            } else if (date.getDate() == day + 2 && date.getHours() == Hour && date.getMinutes() > minutes) {
                console.log('third')
                await urlModel.deleteOne({
                    _id: urlData._id
                })
                return res.status(401).send({
                    error: 'url Expired'
                })
            } else if(urlData.CountOfaccessing == 20){
                return res.status(402).send({
                    error: 'Limit exhausted'
                })
            }else {
                urlData.CountOfaccessing=urlData.CountOfaccessing+1
                await urlData.save()
                return res.redirect(urlData.url)
            }

        }
    } catch (error) {
        console.log(error)
    }

}
route.get('/:shortId', jsonbody, fetchShortUrl)
route.post('/geturl', jsonbody, getShort)
route.post('/signup', jsonbody, signUp)
route.post('/log', jsonbody, loginUser)
route.post('/loggedinuser', jsonbody, getLoggedinUser)


module.exports = route;