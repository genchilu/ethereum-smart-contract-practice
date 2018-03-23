module.exports = {
  networks: {
      development: {
          host: "localhost",
          port: 8545,
          network_id: "*", // 匹配任何network id
          //from: accounts[0] // 指定 contract owner
       }
  }
};