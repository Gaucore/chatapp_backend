import User from "../models/User.js";

export const searchUsers = async (
  req,
  res
) => {
  try {
    const keyword =
      req.query.keyword || "";

    const users = await User.find({
      $and: [
        {
          _id: {
            $ne: req.user._id,
          },
        },
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    }).select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getContacts = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    ).populate(
      "contacts",
      "name email avatar isOnline"
    );

    res.status(200).json({
      success: true,
      contacts: user.contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addContact = async (
  req,
  res
) => {
  try {
    const { contactId } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (
      user.contacts.includes(contactId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Contact already added",
      });
    }

    user.contacts.push(contactId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Contact Added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeContact = async (
  req,
  res
) => {
  try {
    const { contactId } = req.body;

    const user = await User.findById(
      req.user._id
    );

    user.contacts =
      user.contacts.filter(
        (contact) =>
          contact.toString() !== contactId
      );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Contact Removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};