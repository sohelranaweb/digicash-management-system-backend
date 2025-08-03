"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayQueryBuilder = void 0;
class ArrayQueryBuilder {
    constructor(data, query) {
        this.data = data;
        this.query = query;
    }
    sort() {
        const sortBy = this.query.sort || "";
        if (sortBy) {
            const order = sortBy.startsWith("-") ? -1 : 1;
            const field = sortBy.replace("-", "");
            this.data.sort((a, b) => {
                if (a[field] < b[field])
                    return -1 * order;
                if (a[field] > b[field])
                    return 1 * order;
                return 0;
            });
        }
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 5;
        const start = (page - 1) * limit;
        const end = start + limit;
        this.data = this.data.slice(start, end);
        return this;
    }
    getResult() {
        return this.data;
    }
    getMeta(total) {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 5;
        const totalPage = Math.ceil(total / limit);
        const count = this.data.length;
        return { page, limit, total, totalPage, count };
    }
}
exports.ArrayQueryBuilder = ArrayQueryBuilder;
