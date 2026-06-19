import Group from "../models/Group.js";

export const createGroup = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      members,
    } = req.body;

    const group = await Group.create({
      name,
      description,
      members: [
        ...members,
        req.user._id,
      ],
      admins: [req.user._id],
    });

    res.status(201).json({
      success: true,
      group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getGroups = async (
  req,
  res
) => {
  try {
    const groups =
      await Group.find({
        members: req.user._id,
      }).populate(
        "members",
        "name avatar isOnline"
      );

    res.status(200).json({
      success: true,
      groups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const addMember = async (
  req,
  res
) => {
  try {
    const { groupId, userId } =
      req.body;

    const group =
      await Group.findById(
        groupId
      );

    if (
      !group.admins.includes(
        req.user._id
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only admin can add members",
      });
    }

    if (
      group.members.includes(
        userId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User already in group",
      });
    }

    group.members.push(userId);

    await group.save();

    res.status(200).json({
      success: true,
      message:
        "Member added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const removeMember = async (
  req,
  res
) => {
  try {
    const { groupId, userId } =
      req.body;

    const group =
      await Group.findById(
        groupId
      );

    if (
      !group.admins.includes(
        req.user._id
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only admin can remove",
      });
    }

    group.members =
      group.members.filter(
        (m) =>
          m.toString() !==
          userId
      );

    await group.save();

    res.status(200).json({
      success: true,
      message:
        "Member removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};