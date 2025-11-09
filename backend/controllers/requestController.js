import Request from "../models/requestModel.js";
import Item from "../models/itemModel.js";

const toNumber = (v) => {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? NaN : n;
};

const parseISO = (v) => {
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

export const createRequest = async (req, res) => {
  try {
    const { userId, itemId, startDate, endDate, quantity } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });
    if (!itemId) return res.status(400).json({ message: "itemId is required" });

    const qty = toNumber(quantity);
    if (qty === undefined || Number.isNaN(qty) || qty <= 0)
      return res.status(400).json({ message: "quantity must be a positive number" });

    const start = parseISO(startDate);
    const end = parseISO(endDate);
    if (!start || !end || start > end)
      return res.status(400).json({ message: "Invalid date range" });

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.available < qty)
      return res.status(400).json({ message: "Not enough quantity available" });

    const overlapping = await Request.find({
      itemId,
      status: { $in: ["APPROVED", "ISSUED"] },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    const usedQty = overlapping.reduce((sum, r) => sum + (r.quantity || 0), 0);
    if (usedQty + qty > item.quantity)
      return res.status(400).json({ message: "Item already booked for that date range" });

    const newReq = await Request.create({
      userId,
      itemId,
      startDate: start,
      endDate: end,
      quantity: qty,
      status: "PENDING",
    });

    return res.status(201).json({ message: "Request created", request: newReq });
  } catch (error) {
    console.error("Create Request Error:", error);
    return res.status(500).json({ message: "Error creating request", error: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const filter = req.query.userId ? { userId: req.query.userId } : {};
    const requests = await Request.find(filter).populate("itemId").populate("userId");
    return res.json(requests);
  } catch (error) {
    console.error("Get Requests Error:", error);
    return res.status(500).json({ message: "Error fetching requests" });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await request.save();

    const item = await Item.findById(request.itemId);
    if (!item) return res.status(404).json({ message: "Item not found for request" });

    if (status === "ISSUED") item.available -= request.quantity;
    if (status === "RETURNED") item.available += request.quantity;

    if (item.available < 0) item.available = 0;
    if (item.available > item.quantity) item.available = item.quantity;

    await item.save();

    return res.json({ message: "Status updated", request });
  } catch (error) {
    console.error("Update Request Error:", error);
    return res.status(500).json({ message: "Error updating request", error: error.message });
  }
};
