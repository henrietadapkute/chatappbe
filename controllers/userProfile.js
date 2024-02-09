import User from "../models/User.js";

async function getUserProfile(req, res) {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, "-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function updateUserProfile(req, res) {
  try {
    const userId = req.params.userId;
    const updatedUserDetails = req.body;
    const user = await User.findByIdAndUpdate(userId, updatedUserDetails, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = { ...user.toObject(), password: undefined };

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export default {
  getUserProfile,
  updateUserProfile,
  deleteUser,
};
