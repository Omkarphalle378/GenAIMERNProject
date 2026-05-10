/**
 * User-visible message for failed auth API calls (network, CORS, timeouts, HTTP errors).
 */
export function getAuthErrorMessage(err, fallback) {
  const serverMsg = err.response?.data?.message
  if (serverMsg) return serverMsg

  if (err.code === "ECONNABORTED") {
    return "Request timed out. Try again."
  }
  if (
    err.code === "ERR_NETWORK" ||
    err.message === "Network Error" ||
    !err.response
  ) {
    return (
      "Cannot reach the API. Start the backend from the Backend folder (npm run dev) " +
      "and open the site with npm run dev in Fronted (not file://)."
    )
  }

  return err.message || fallback
}
