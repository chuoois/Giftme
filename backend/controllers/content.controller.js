const Content = require("../models/content.model");

// 📌 Create
const createContent = async (req, res) => {
  try {
    const { title, img, tags, description, enable = false } = req.body;

    // Nếu enable = true thì reset tất cả cái khác về false
    if (enable) {
      await Content.updateMany({}, { $set: { enable: false } });
    }

    const newContent = new Content({ title, img, tags, description, enable });
    await newContent.save();

    res.status(201).json(newContent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📌 Read all (with pagination, search, filter)
const getContents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    const contents = await Content.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Content.countDocuments(query);

    res.json({
      data: contents,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Update
const updateContent = async (req, res) => {
  try {
    const { title, img, tags, description, enable } = req.body;

    // Nếu enable = true thì reset tất cả cái khác về false
    if (enable) {
      await Content.updateMany({}, { $set: { enable: false } });
    }

    const updated = await Content.findByIdAndUpdate(
      req.params.id,
      { title, img, tags, description, enable },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📌 Delete
const deleteContent = async (req, res) => {
  try {
    const deleted = await Content.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get content đang bật (cho trang Home)
const getEnabledContent = async (req, res) => {
  try {
    const enabled = await Content.findOne({ enable: true });
    res.json(enabled);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createContent,
  getContents,
  updateContent,
  deleteContent,
  getEnabledContent,
};
