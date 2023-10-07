require("@nomiclabs/hardhat-waffle");
require("dotenv").config(); 
require("@nomicfoundation/hardhat-verify"); 

const bsc_testnet_url = process.env.BSC_TESTNET_URL; 
const private_Key = process.env.PRIVATE_KEY; 

const etherscan_bsc = process.env.ETHERSCAN_BSC; 

module.exports = {
solidity: "0.8.7",


networks:{
bscTestnet:{
url: bsc_testnet_url,
accounts:[private_Key], 
chainId: 97,
},
localhost:{
url: "http://127.0.0.1:8545/",
chainId:31337,
}
},
etherscan:{
apiKey: etherscan_bsc,
}
};
