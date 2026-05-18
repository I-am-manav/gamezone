let otpStore = {}

exports.SendOtp = async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.json({
            success: false,
            message: "Email required"
        })
    }

    const otp = Math.floor(100000 + Math.random() * 900000)

    otpStore[email] = otp

    console.log("OTP:", otp)

    res.json({
        success: true,
        message: "OTP sent successfully"
    })
}

exports.otpStore = otpStore