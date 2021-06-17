function formatQuery(query) {
  if (!query.page || isNaN(query.page)) {
    query.page = this.defaultPaginationOptions.page;
  }
  if (!query.limit || isNaN(query.limit)) {
    query.limit = this.defaultPaginationOptions.limit;
  }

  if (typeof query.page === "string") {
    query.page = parseInt(query.page);
  }
  if (typeof query.limit === "string") {
    query.limit = parseInt(query.limit);
  }
  if (query.page < this.defaultPaginationOptions.page)
    query.page = this.defaultPaginationOptions.page;

  if (query.limit > this.defaultPaginationOptions.maxLimit)
    query.limit = this.defaultPaginationOptions.maxLimit;
  return query;
}

function calculatePositionStartDocument(page, limit) {
  return page * limit - limit;
}

async function countDocument(query) {
  const totalDocument = await this.model.find(query).count().exec();
  return totalDocument;
}

async function findDocuments(conditions, query) {
  const { filter, sort, limit, select, page, populate } = query;
  const mQuery = this.model.find({ ...conditions, ...filter });

  mQuery.select(select);
  mQuery.sort(sort);
  mQuery.limit(limit);

  const skip = calculatePositionStartDocument(page, limit);
  mQuery.skip(skip);
  if (populate) {
    mQuery.populate(populate);
  }
  // console.time("docs_");
  const docs = await mQuery.exec();
  // console.timeEnd("docs_");

  return docs;
}

function calculateTotalPage(totalDocument, limit) {
  const totalPage = Math.ceil(totalDocument / limit);
  return totalPage;
}

function calculatePages(page, totalDocument, limit) {
  const totalPage = calculateTotalPage(totalDocument, limit);
  const pages = {
    total: totalDocument,
    currentPage: page,
    next: page < totalPage ? page + 1 : 0,
    prev: page > 1 ? page - 1 : 0,
    hasNext: page < totalPage,
    hasPrev: page > 1
  };

  return pages;
}

function calculateFilters(query) {
  const { filter, sort, limit, select, page, populate } = query;
  const filters = {
    ...filter,
    page,
    limit,
    sort,
    select,
    populate
  };
  Object.keys(filters).forEach(key => !filters[key] && delete filters[key]);
  return filters;
}

function calculateItems(totalDocument, page, limit) {
  const totalPage = calculateTotalPage(totalDocument, limit);
  const skip = calculatePositionStartDocument(page, limit);
  const items = {
    total: totalDocument,
    begin: page <= totalPage ? skip + 1 : totalDocument,
    end: totalDocument > limit * page ? limit * page : totalDocument
  };
  return items;
}

async function countDocumentAggregate(aggregations) {
  const total = await this.model
    .aggregate(aggregations)
    .count("total")
    .then(result => {
      if (result && result.length) {
        result = result[0];
        return result.total;
      }
      return 0;
    });

  return total;
}

async function aggregateDocuments(aggregations, query) {
  const { limit, page } = query;
  const mAggregate = this.model.aggregate(aggregations);

  const skip = calculatePositionStartDocument(page, limit);
  mAggregate.skip(skip);
  mAggregate.limit(limit);

  return await mAggregate.exec();
}

function formatResult(query, totalDocument, docs) {
  const { page, limit } = query;
  const pages = calculatePages(page, totalDocument, limit);
  const filters = calculateFilters(query);
  const items = calculateItems(totalDocument, page, limit);
  const results = {
    docs,
    items,
    filters,
    pages
  };
  return results;
}

class Pagination {
  model;
  defaultPaginationOptions = {
    limit: 10,
    page: 1,
    maxLimit: 100
  };

  constructor(model) {
    this.model = model;
  }

  async paginateAggregate(aggregations = {}, query = { filter: {} }) {
    query = formatQuery.call(this, query);

    const [totalDocument, docs] = await Promise.allSettled([
      countDocumentAggregate.call(this, aggregations),
      aggregateDocuments.call(this, aggregations, query)
    ]);

    return formatResult(query, totalDocument.value, docs.value);
  }

  async paginate(conditions = {}, query = { filter: {} }) {
    query = formatQuery.call(this, query);

    const { filter } = query;
    const [totalDocument, docs] = await Promise.allSettled([
      countDocument.call(this, { ...conditions, ...filter }),
      findDocuments.call(this, conditions, query)
    ]);
    return formatResult(query, totalDocument.value, docs.value);
  }
}

module.exports = Pagination;
