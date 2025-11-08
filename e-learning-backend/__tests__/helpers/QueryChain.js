class QueryChain {
  constructor(result) { this._result = result; }
  populate() { return this; }
  sort() { return this; }
  skip() { return this; }
  limit() { return this; }
  lean() { return Promise.resolve(this._result); }
  exec() { return Promise.resolve(this._result); }
  static fromArray(arr) {
    return {
      populate: () => ({
        populate: () => ({
          sort: () => ({
            skip: () => ({
              limit: () => ({
                lean: () => Promise.resolve(arr)
              })
            })
          })
        })
      })
    };
  }
}
module.exports = { QueryChain };
