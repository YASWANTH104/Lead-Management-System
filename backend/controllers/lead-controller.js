const Lead=require("../models/Lead")

function buildFilters(query) {
  const filters = {};

  if (query.email_eq) filters.email = query.email_eq;
  if (query.company_eq) filters.company = query.company_eq;
  if (query.city_eq) filters.city = query.city_eq;

  if (query.email_contains)
    filters.email = { $regex: query.email_contains, $options: "i" };
  if (query.company_contains)
    filters.company = { $regex: query.company_contains, $options: "i" };
  if (query.city_contains)
    filters.city = { $regex: query.city_contains, $options: "i" };

  if (query.status) filters.status = { $in: query.status.split(",") };
  if (query.source) filters.source = { $in: query.source.split(",") };

  if (query.score_eq) filters.score = Number(query.score_eq);
  if (query.score_gt)
    filters.score = { ...(filters.score || {}), $gt: Number(query.score_gt) };
  if (query.score_lt)
    filters.score = { ...(filters.score || {}), $lt: Number(query.score_lt) };

  if (query.lead_value_gt)
    filters.lead_value = {
      ...(filters.lead_value || {}),
      $gt: Number(query.lead_value_gt),
    };
  if (query.lead_value_lt)
    filters.lead_value = {
      ...(filters.lead_value || {}),
      $lt: Number(query.lead_value_lt),
    };
  if (query.lead_value_between) {
    const [minVal, maxVal] = query.lead_value_between.split(",").map(Number);
    filters.lead_value = { $gte: minVal, $lte: maxVal };
  }

  if (query.created_after)
    filters.created_at = {
      ...(filters.created_at || {}),
      $gt: new Date(query.created_after),
    };
  if (query.created_before)
    filters.created_at = {
      ...(filters.created_at || {}),
      $lt: new Date(query.created_before),
    };
  if (query.created_between) {
    const [start, end] = query.created_between.split(",");
    filters.created_at = { $gte: new Date(start), $lte: new Date(end) };
  }

  if (query.last_activity_after)
    filters.last_activity_at = {
      ...(filters.last_activity_at || {}),
      $gt: new Date(query.last_activity_after),
    };
  if (query.last_activity_before)
    filters.last_activity_at = {
      ...(filters.last_activity_at || {}),
      $lt: new Date(query.last_activity_before),
    };

  if (typeof query.is_qualified !== "undefined")
    filters.is_qualified = query.is_qualified === "true";

  return filters;
}

const getLeads = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const filters = buildFilters(req.query);

    const [total, records] = await Promise.all([
      Lead.countDocuments(filters),
      Lead.find(filters).sort({ created_at: -1 }).skip(skip).limit(limit),
    ]);

    return res.status(200).json({
      data: records,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createLeads = async (req, res) => {
  try {
    const created = await Lead.create(req.body);
    return res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: "Email must be unique" });
    return res.status(400).json({ message: err.message });
  }
};

const getSpecificLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Not found" });
    return res.status(200).json(lead);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const removed = await Lead.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "Deleted" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createLeads,
  getLeads,
  updateLead,
  getSpecificLead,
  deleteLead,
};
