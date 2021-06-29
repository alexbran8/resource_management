const newError = ({ error, code = 500, ...rest }) => {
  const err = new Error(error)
  err.code = code
  Object.keys(rest).map(key => err[key] = rest[key])
  return err
}

const isNull = x => x === null || x === undefined || x === ''

module.exports = {
  newError,
  isNull
}