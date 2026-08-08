export function parsePagination(query: { page?: string; limit?: string }) {
  const page = parseInt(query.page || "1", 10);
  const limit = parseInt(query.limit || "20", 10);

  const validPage = isNaN(page) || page < 1 ? 1 : page;
  const validLimit = isNaN(limit) || limit < 1 ? 20 : limit;

  const skip = (validPage - 1) * validLimit;

  return {
    page: validPage,
    limit: validLimit,
    skip,
  };
}
