const CatchAsync = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch((e) => {
    console.log("Ocorreu um erro na promise");
    next(e);
  });
};

module.exports = CatchAsync;
