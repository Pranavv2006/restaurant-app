const { login } = require("../services/loginService");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await login(email, password);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          user: result.data.user,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        },
      });
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    console.error("Login controller error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = { loginController };