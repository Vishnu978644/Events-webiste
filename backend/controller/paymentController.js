import paymentModel from "../model/paymentModel.js";
// import bookingModel from "../model/bookingModel"; // Removed reference for simplicity

// GET all payments
export const getPayment = async (req, res) => {
    try {
        const payment = await paymentModel.find();
        res.status(200).json(payment);
    } catch (err) {
        res.status(500).json({ message: err.message }); // Changed to 500 for server error
    }
};

// POST a new payment
export const postPayment = async (req, res) => {
    // Note: You must ensure req.body contains the fields (paymentId, bookingId, etc.)
    try {
        const payment = await paymentModel.create(req.body); // Use req.body directly
        res.status(201).json(payment); // 201 for creation
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT/PATCH an existing payment (Update by paymentId in params)
export const putPayment = async (req, res) => {
    try {
        const { paymentId } = req.params; 
        
        const updatedPayment = await paymentModel.findOneAndUpdate(
            { paymentId: paymentId },
            req.body,
            { new: true } // Returns the updated document
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: `Payment ID ${paymentId} not found.` });
        }

        res.status(200).json(updatedPayment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE a payment (Delete by paymentId in params)
export const deletePayment = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const deletedPayment = await paymentModel.findOneAndDelete({ paymentId: paymentId });

        if (!deletedPayment) {
            return res.status(404).json({ message: `Payment ID ${paymentId} not found.` });
        }

        res.status(200).json(deletedPayment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};