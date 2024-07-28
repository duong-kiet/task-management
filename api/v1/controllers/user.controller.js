const md5 = require("md5")
const User = require("../models/user.model")

const generateHelper = require("../../../helpers/generate")
const sendMailHelper = require("../../../helpers/sendMail")

const ForgotPassword = require("../models/forgot-password.model")


// POST /api/v1/users/register
module.exports.register = async (req, res) => {
    req.body.password = md5(req.body.password)

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })
    
    if(existEmail) {
        res.json({
            code: 400,
            message: "Email exist"
        })
    } else {
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password
        })
        
        user.save()

        const token = user.token
        res.cookie("token", token)

        res.json({
            code: 200,
            message: "Tạo tài khoản thành công",
            token: token
        })
    }
}

// POST /api/v1/users/login
module.exports.login = async (req,res) => {
    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại"
        })
        return;
    }

    if(md5(password) !== user.password) {
        res.json({
            code: 400,
            message: "Sai mật khẩu"
        })
        return;
    }

    const token = user.token
    res.cookie("token", token)

    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token: token
    })
}

// POST /api/v1/users/password/forgot
module.exports.forgotPassword = async (req,res) => {
    const email = req.body.email

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại"
        })
        return;
    }

    const otp = generateHelper.generateRandomNumber(8);

    const timeExpire = 5; // thời gian hết hạn mã OTP
    // Lưu data vào database
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now() + timeExpire*60
    }
    
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

    // Send OTP qua email user
    const subject = "Mã OTP xác minh lấy lại mật khẩu"
    const html = `
        Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> trong ${timeExpire} phút).
        Vui lòng không chia sẻ mã OTP này với bất kỳ ai
    `
    sendMailHelper.sendMail(email, subject, html)

    res.json({
        code: 200,
        message: "Đã gửi mã OTP qua email"
    })
}