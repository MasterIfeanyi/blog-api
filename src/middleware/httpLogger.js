import morgan from 'morgan';
import logger from '../utils/logger.js';
import { isProduction, morganFormat } from '../config/logging.js';




const httpLogger = isProduction
  ? morgan(morganFormat, {
      stream: {
        write: (message) => logger.info(message.trim())
      }
    })
  : morgan(morganFormat);


export default httpLogger;
