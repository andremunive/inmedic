const { DEFAULT_PAGINATION_LIMIT } = process.env;

function paginationMiddleware(req, res, next) {
  const page = Number(req.query.page || 1) - 1;
  const limit = Number(req.query.limit || DEFAULT_PAGINATION_LIMIT);

  const getPaginationInfo = async (model) => {
    const totalItems = await model.count();
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page + 1;

    return {
      totalItems,
      totalPages,
      currentPage,
    };
  };

  req.pagination = {
    order: ['_id'],
    offset: page * limit,
    limit,
  };

  req.getPaginationInfo = getPaginationInfo;

  next();
}

module.exports = {
  paginationMiddleware,
};