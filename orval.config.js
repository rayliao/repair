module.exports = {
  api: {
    input: {
      target: 'http://106.55.142.137/swagger/v1/swagger.json',
      validation: false
    },
    output: {
      mode: 'tags-split',
      target: './src/api',
      schemas: './src/api/model',
      client: 'react-query',
      httpClient: 'axios',
      baseUrl: 'http://106.55.142.137',
      override: {
        mutator: {
          path: './src/utils/taroAxios.ts',
          name: 'createTaroAxiosInstance'
        }
      },
      mock: false
    }
  }
}
