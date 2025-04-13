/** @type {import('@hey-api/openapi-ts').UserConfig} */
module.exports = {
  input: 'schema/schema.json',
  output: 'src/client.gen',
  plugins: ['@hey-api/typescript', 'zod', '@hey-api/client-fetch', {
    name: '@hey-api/sdk',
    validator: true,
  },],
};