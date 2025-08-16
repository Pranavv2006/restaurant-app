const bcrypt = require('bcrypt');

const resetPassword = async (email) => {
    const findEmail = await User.findOne({ email });
        if (!findEmail) {
            throw new Error("User not found");
        }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    findEmail.password = hashedPassword;
    await findEmail.save();
}

module.exports = {resetPassword};