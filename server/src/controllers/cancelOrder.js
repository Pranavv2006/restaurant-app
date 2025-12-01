const { CancelOrderService } = require("../services/CancelOrderService");

const cancelOrderController = async (req, res) => {
    try{
        const { orderId } = req.params;

        const result = await CancelOrderService({ orderId });

        if (result.success) {
            return res.status(200).json({ success: true, data: result.data });
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }

    } catch (error) {
        return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        });
    }
};

module.exports = { cancelOrderController };