const { otpStore } = require("./sendOtp")

exports.VerifyOtp = async (req, res) => {
    const { email, otp } = req.body

    if (otpStore[email] == otp) {
        return res.json({
            success: true,
            message: "OTP verified"
        })
    }

    res.json({
        success: false,
        message: "Invalid OTP"
    })
}