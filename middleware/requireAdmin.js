const requireAdmin = (req, res, next) => {
  const apiKey = req.headers["x-admin-key"];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ error: "Åtkomst nekad. Admin krävs." });
  }
  next();
};

export default requireAdmin;
