export class ArrayQueryBuilder<T> {
  private data: T[];
  private query: Record<string, string>;

  constructor(data: T[], query: Record<string, string>) {
    this.data = data;
    this.query = query;
  }

  sort(): this {
    const sortBy = this.query.sort || "";
    if (sortBy) {
      const order = sortBy.startsWith("-") ? -1 : 1;
      const field = sortBy.replace("-", "");

      this.data.sort((a: any, b: any) => {
        if (a[field] < b[field]) return -1 * order;
        if (a[field] > b[field]) return 1 * order;
        return 0;
      });
    }
    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 5;
    const start = (page - 1) * limit;
    const end = start + limit;
    this.data = this.data.slice(start, end);
    return this;
  }

  getResult(): T[] {
    return this.data;
  }

  getMeta(total: number) {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 5;
    const totalPage = Math.ceil(total / limit);
    const count = this.data.length;

    return { page, limit, total, totalPage, count };
  }
}
