let env;
try {
  env = process?.env;
} catch (err) {
  console.log('BevorAPI cannot find process.');
}

export const NODE_ENV = env ? env.NODE_ENV : 'development';
export const URL = env ? env.API_ENDPOINT : 'http://localhost:3001';
export const REQ_TIMEOUT = '5000';

// HTTP Options
export const CREDENTIALS = 'same-origin';
