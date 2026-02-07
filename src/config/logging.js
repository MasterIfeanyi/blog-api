export const NODE_ENV = process.env.NODE_ENV || 'development';

export const isProduction = NODE_ENV === 'production';

export const morganFormat = isProduction ? 'combined' : 'dev';
