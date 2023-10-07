const {ethers, run, networks } = require("hardhat"); 

async function deploy(){
const contractFactory = await ethers.getContractFactory("BscFaucet"); 
const contract = await contractFactory.deploy(); 
console.log("Contract is deploying.."); 
await contract.deployed(); 
console.log("Contract deployed! Contract address is " + contract.address); 

// const fundBnb = await contract.fund({value: ethers.utils.parseEther("0.005")})
// const waitForFund = await fundBnb.wait(1); 
// console.log("Successfully funded 0.005 bnb at tx hash " + fundBnb.hash + " with " + waitForFund.confirmations + " confirmation/s")

// const withdrawUser = await contract.withdrawToFundUsers("0x0F4b8f37B4c0edcea6053c9A80f80c45852aDcbD", (ethers.utils.parseEther("0.002"))); 
// const waitForWithdrawUser = await withdrawUser.wait(1); 
// console.log("Successfully withdrawed 0.002 bnb at tx hash " + withdrawUser.hash+ " with " + waitForWithdrawUser.confirmations + " confirmation/confirmations "); 

// const contractBalanceAfterWithdraw = await contract.contractBalance(); 
// console.log("After withdraw, contract balance is " + (contractBalanceAfterWithdraw / 1e18).toString()); 

// const numberOfUserFunded = await contract.seeNumberOfPeopleFunded(); 
// console.log("The number of users funded is " + numberOfUserFunded.toString())

}

deploy(); 

