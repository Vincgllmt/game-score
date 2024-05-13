// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
require('dotenv').config({
  path: '.env.test',
});
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};