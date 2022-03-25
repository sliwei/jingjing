import { HttpError } from '../utils/tool/error'

const fzf = async (ctx, next) => {
  throw new HttpError(404)
}

export { fzf }
