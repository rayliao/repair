module.exports = {
  api: {
    input: {
      target: 'https://api.zxjl.com/swagger/v1/swagger.json',
      validation: false
    },
    output: {
      mode: 'tags-split',
      target: './src/api',
      schemas: './src/api/model',
      client: 'swr',
      httpClient: 'axios',
      baseUrl: '',
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
