const ForgotPassword = require('../services/ForgotPasswordService');

const ForgotPasswordReset = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        await ForgotPassword.resetPassword(email, newPassword);
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {ForgotPasswordReset};