/**
 * Generic request validation middleware using Zod schemas.
 */
const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsed = schema.parse(dataToValidate);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error.errors) {
        const messages = error.errors.map((e) => e.message).join(", ");
        return res.status(400).json({ message: messages || "Validation failed" });
      }
      return res.status(400).json({ message: error.message || "Invalid request payload" });
    }
  };
};

module.exports = { validateRequest };
