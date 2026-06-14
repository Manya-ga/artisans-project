function getPublicBaseUrl(req) {
  return (
    process.env.BACKEND_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    process.env.APP_URL ||
    `${req.protocol}://${req.get('host')}`
  ).replace(/\/$/, '');
}

module.exports = { getPublicBaseUrl };
