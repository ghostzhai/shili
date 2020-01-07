// .easy-mock.js
module.exports = {
  host: 'http://h2.beyondcloud.cn',
  output: 'src/api', // 产出到项目下的 api 目录，不用手动创建
  template: 'axios', // 基于 easy-mock-templates 提供的 axios 模板
  projects: [
    {
      id: '5c53e89f86811c03b07e4be8',//58fef6ac5e43ae5dbea5eb52
      name: 'kg' // 生成到 api/user 目录下。
    }
  ]
}
