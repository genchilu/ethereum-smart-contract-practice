module.exports = {
  networks: {
      development: {
          host: "localhost",
          port: 9545,
          network_id: "*", // 匹配任何network id
          from: "0x627306090abab3a6e1400e9345bc60c78a8bef57" // 指定 contract owner
       }
  }
};