module.exports = {
  api: {
    input: {
      target: 'http://api.zxjl.com/swagger/v1/swagger.json',
      validation: false
    },
    output: {
      mode: 'tags-split',
      target: './src/api',
      schemas: './src/api/model',
      client: 'swr',
      httpClient: 'axios',
      baseUrl: 'http://api.zxjl',
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
