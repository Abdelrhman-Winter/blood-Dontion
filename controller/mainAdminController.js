const express = require("express");
const router = express.Router();
const mainAdminModel = require("../models/mainAdminModel");
const User = require("../models/userModel");
const HostAdmin = require("../models/hostAdminModel");

router.get('/showAllUsers', async (req, res, next) => {
    if (req.user && req.user.role == 'mainAdmin') {
        const user = await User.find();
        console.log(user)
        if (!user) {
            res.status(404).send('no users')
        }
        // res.status(200).send({ data: user })
        res.render('all-users', { user })
    } else if (req.user && req.user.role == 'admin') {
        res.redirect('/dashboard')
    }
    res.redirect('/')
})

router.get('/showHospitalAdmin', async (req, res, next) => {
    if (req.user && req.user.role == 'mainAdmin') {
        const hostAdmin = await HostAdmin.find();
        console.log(hostAdmin)
        if (!hostAdmin) {
            res.status(404).send('no hostAdmins')
        }
        res.render('admins', {
            hostAdmin
        })
    }
    else if (req.user && req.user.role == 'admin') {
        res.redirect('/dashboard')
    }
    res.redirect('/')
})

router.post('/deleteHospitalAdmin/:id', async (req, res, next) => {
    if (req.user && req.user.role == 'mainAdmin') {
        const id = req.params.id
        const hostAdmin = await HostAdmin.findByIdAndDelete({ _id: id });
        console.log(hostAdmin)
        if (!hostAdmin) {
            res.status(404).send('no hostAdmins')
        }
        res.status(200).redirect(
            '/main-admin/showHospitalAdmin'
        )
    }
    else if (req.user && req.user.role == 'admin') {
        res.redirect('/dashboard')
    }
    res.redirect('/')
})


router.get('/addNewHospitalAdmin', (req, res) => {
    if (req.user && req.user.role == 'mainAdmin') {
        res.status(200).render(
            'createAdmin'
        )
    } else if (req.user && req.user.role == 'admin') {
        res.redirect('/dashboard')
    }
    res.redirect('/')
})
router.post('/addNewHospitalAdmin', async (req, res, next) => {
    if (req.user && req.user.role == 'mainAdmin') {
        const { adminname, hospitalName, password } = req.body
        const hostAdmin = new HostAdmin({ adminname, hospitalName, password })
        await hostAdmin.save();
        console.log(hostAdmin)
        if (!hostAdmin) {
            res.status(404).send('no hostAdmins')
        }

        res.status(200).render(
            'createAdmin'
        )
    } else if (req.user && req.user.role == 'admin') {
        res.redirect('/dashboard')
    }
    res.redirect('/')
})

module.exports = router