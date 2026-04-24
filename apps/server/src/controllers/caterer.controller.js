import Admin from "../models/Admin.js";
import { toPlain } from "../lib/serialize.js";

export const verifyCaterer = async (req, res) => {
    try {
        const { catererId } = req.body;

        const caterer = await Admin.findById(catererId);

        if (!caterer) {
            return res.status(404).json({
                success: false,
                message: "Caterer not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Caterer verified successfully",
        });
    } catch (error) {
        if (error?.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Caterer not found",
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAllCaterers = async (_req, res) => {
    try {
        const caterers = await Admin.find().select("email name");

        res.status(200).json({
            success: true,
            data: caterers.map(toPlain),
        });
    } catch {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
