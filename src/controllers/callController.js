import Call from "../models/Call.js";

/**
 * Create call log when call starts
 */
export const createCallLog = async (req, res) => {
  try {
    const { receiverId, type } = req.body;

    const call = await Call.create({
      caller: req.user._id,
      receiver: receiverId,
      type,
      status: "missed",
      startedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      call,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Update call status (accept/reject/end)
 */
export const updateCallStatus = async (req, res) => {
  try {
    const { callId, status } = req.body;

    const call = await Call.findByIdAndUpdate(
      callId,
      {
        status,
        endedAt: new Date(),
      },
      { new: true }
    );

    res.json({
      success: true,
      call,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};