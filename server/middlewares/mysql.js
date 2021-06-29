const { newError, isNull } = require('../utils/main')
const userModel = require('../models/user')

const _find = async (model, _id, next) => {
  const _idc = _id || ''
  const result = { error: null, data: null }
  try {
    const where = _idc === '' ? {} : { id: _idc }
    const data = await model.findAll({ where })
    if (data === null)
      next(newError({ error: `Cannot find entry with id: ${_idc}`, code: 404 }))
    else result.data = data
    return result
  } catch (error) {
    next(newError({ error }))
  }
}

const find = model => async (req, res, next) => {
  const id = req.params.id || null
  const response = await _find(model, id, next)
  if (!isNull(response.data)) res.json(response)
}

// const findEmployeer = async nokiaid => {
//   try {
//     const id = nokiaid
//     const data = await userModel.findAll({ employeer, where: { nokiaid } })
//   } catch (error) {
//     console.log(error)
//   }
// }

module.exports = {
  find
}
