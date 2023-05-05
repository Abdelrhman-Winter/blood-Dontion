const express = require("express");
const router = express.Router();
const hostAdminModel = require("../models/hostAdminModel");
const BookingModel = require("../models/bookingModel");
const userModel = require("../models/userModel");

// @desc get user hospital by admin hospital
router.get('/getUsers', async (req, res, next) => {
    if (req.user && req.user.role == 'admin' && req.isAuthenticated()) {
        req.query = req.user.hospitalName
        const user = await BookingModel.find({ location: req.query })
            .populate({ path: 'user', select: 'firstName lastName phone city bloodType address' });

        if (!user) {
            res.status(404).redirect('/')
        }
        res.render('donors-admin', { user, num_donors: user.length, layout: false })
    } else {
        res.redirect('/')
    }

})

// @desc get requests hospital by admin hospital
router.get('/request-admin', async (req, res, next) => {
    if (req.user && req.user.role == 'admin' && req.isAuthenticated()) {
        console.log(req.user);

        req.query = req.user.hospitalName;
        const user = await BookingModel.find({ location: req.query })
            .populate({ path: 'user', select: 'firstName lastName phone city bloodType' });

        if (!user) {
            res.send('no users')
        }
        res.render('request-admin', { user, num_donors: user.length, layout: false })
    } else {
        res.redirect('/')
    }
})

// @desc update requests hospital by admin hospital
router.post('/request-admin', async (req, res, next) => {
    if (req.user && req.user.role == 'admin' && req.isAuthenticated()) {
        const id = req.body.id;
        const rejBtn = req.body.rejBtn;
        console.log(req.body.id);

        if (req.body.id) {
            const user = await BookingModel.findOneAndUpdate(id,
                { additionalInfo: 'yes', isConfirmed: true });
            res.redirect('/hostAdmins/request-admin')
        } else if (req.body.rejBtn) {
            const user = await BookingModel.findOneAndRemove(id,);
            res.redirect('/hostAdmins/request-admin')
        }

        res.redirect('/hostAdmins/request-admin')
    } else {
        res.redirect('/')
    }
})

module.exports = router