// Catches any error passed via next(err) and returns a clean JSON response
module.exports = function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};
