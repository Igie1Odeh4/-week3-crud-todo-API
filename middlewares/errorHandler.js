const errorhandler = (err, req, res, next) => {
  console.error(err.stack) || "";
  console.error('message:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Server error!'
  });
};

module.exports = errorhandler;
