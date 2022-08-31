import routes from './router/index'
import { convertDictionaryToObject } from './utils/appHelpers'
import '../../node_modules/@alegradev/smile-ui-next/dist/style.css'
import '../index.css'

const microSettings = {
  routes,
  dictionary: convertDictionaryToObject(),
}

export { microSettings }
