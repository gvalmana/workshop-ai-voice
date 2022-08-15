import routes from "./router/index";
import { convertDictionaryToObject } from "./utils/appHelpers";

const microSettings = {
  routes,
  dictionary: convertDictionaryToObject(),
};

export { microSettings };
