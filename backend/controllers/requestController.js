import Request from "../models/requestModel.js";
import Item from "../models/itemModel.js";

export const createRequest = async (req, res) => {
  try {
    const { userId, itemId, startDate, endDate, quantity } = req.body;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.available < quantity)
      return res.status(400).json({ message: "Not enough quantity available" });

    const overlapping = await Request.find({
      itemId,
      status: { $in: ["APPROVED", "ISSUED"] },
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      ],
    });

    let usedQty = overlapping.reduce((sum, r) => sum + r.quantity, 0);
    if (usedQty + quantity > item.quantity)
      return res.status(400).json({ message: "Item already booked for that date range" });

    const newReq = await Request.create({ userId, itemId, startDate, endDate, quantity });
    res.status(201).json({ message: "Request created", request: newReq });
  } catch (error) {
    res.status(500).json({ message: "Error creating request", error: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const requests = await Request.find(filter).populate("itemId").populate("userId");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests" });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await request.save();

    const item = await Item.findById(request.itemId);
    if (status === "ISSUED") item.available -= request.quantity;
    if (status === "RETURNED") item.available += request.quantity;
    await item.save();

    res.json({ message: "Status updated", request });
  } catch (error) {
    res.status(500).json({ message: "Error updating request", error: error.message });
  }
};
