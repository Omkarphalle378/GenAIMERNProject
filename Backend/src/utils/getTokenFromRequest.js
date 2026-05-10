/**
 * Prefer Authorization: Bearer (SPA / cross-origin); fall back to cookie.
 */
function getTokenFromRequest(req) {
  const h = req.headers.authorization;
  if (h && typeof h === "string" && h.startsWith("Bearer ")) {
    return h.slice(7).trim();
  }
  return req.cookies?.token;
}

module.exports = { getTokenFromRequest };
