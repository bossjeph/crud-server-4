const express = require('express');
const app = express();


class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}


const checkAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== 'Bearer valid-token') {
    return next(new AppError('Unauthorized access', 401));
  }
  next();
};

app.use(express.json());


app.post('/items', checkAuth, (req, res, next) => {
  const { name } = req.body;
  if (!name) return next(new AppError('Name is required', 400));
  res.status(201).json({ message: 'Item created', name });
});


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});


app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});


if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
