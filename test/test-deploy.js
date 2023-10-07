const { expect, assert } = require("chai");
const { errors } = require("ethers");
const { ethers } = require("hardhat");


describe("BscFaucet", async function(){
let faucetFactory; 
let faucet; 
let signer; 
let signerAddress; 

beforeEach(async function(){
signer = await ethers.getSigner(); 
signerAddress = signer.getAddress(); 
faucetFactory = await ethers.getContractFactory("BscFaucet"); 
faucet = await faucetFactory.deploy(signerAddress); 
await faucet.deployed(); 
})


//CONTRACT BALANCE
it("At start without any fund, the contracts balance should be 0", async function(){
const getBalance = await faucet.contractBalance(); 
assert.equal("0", getBalance.toString()); 
})
it("After a fund of 0.01 bnb, the contracts balance should be what? 0.01 bnb of course", async function(){
const fundBnb = await faucet.fund({value: ethers.utils.parseEther("0.01")}); 
await fundBnb.wait(1); 
const getBalance =  await faucet.contractBalance(); 
assert.equal((getBalance.toString() / 1e18), "0.01"); 
})
it("After a fund and then a withdrawToFundUsers for the same amount, balance should be 0 ", async function(){
const fundBnb = await faucet.fund({value:ethers.utils.parseEther("0.01")}); 
await fundBnb.wait(1); 
const withdrawToFundTheUsers = await faucet.withdrawToFundUsers("0xA398071aB64A0D2Fe84072c7B0524004BC1030eA", ethers.utils.parseEther("0.01")); 
await withdrawToFundTheUsers.wait(1); 
const getBalance = await faucet.contractBalance(); 
assert.equal(getBalance.toString(), "0"); 
})


//NUMBER OF PEOPLE FUNDED
it("At start the number of people funded should be 0", async function(){
const getPeopleFunded = await faucet.seeNumberOfPeopleFunded(); 
assert.equal("0",getPeopleFunded.toString()); 
})
it("After fund the number of people funded shoul be 0", async function(){
const fundBnb = await faucet.fund({value:ethers.utils.parseEther("0.01")}); 
await fundBnb.wait(1); 
const getPeopleFunded = await faucet.seeNumberOfPeopleFunded(); 
assert.equal("0",getPeopleFunded.toString()); 
})
it("After funding one user the number of people funded should be 1", async function(){
const fundBnb = await faucet.fund({value:ethers.utils.parseEther("0.01")}); 
await fundBnb.wait(1); 
const withdrawToFundTheUsers = await faucet.withdrawToFundUsers("0xA398071aB64A0D2Fe84072c7B0524004BC1030eA", ethers.utils.parseEther("0.01")); 
await withdrawToFundTheUsers.wait(1); 
const getPeopleFunded = await faucet.seeNumberOfPeopleFunded(); 
assert.equal("1",getPeopleFunded.toString()); 
})


//FUND
it("Can successfully fund money in the contract if the balance is equal to the money funded after a fund function", async function(){
const fundBnb = await faucet.fund({value: ethers.utils.parseEther("0.01")}); 
await fundBnb.wait(1); 
const getBalance =  await faucet.contractBalance(); 
assert.equal((getBalance.toString() / 1e18), "0.01"); 
})
it("Before the first fund the array 'funders' size should be 0", async function(){
const getArr = await faucet.returnFunders(); 
const getSize = getArr.length;
assert.equal("0",getSize.toString()); 
})
it("After the first fund the array 'funders' size shouls be 1", async function(){
const fundBnb = await faucet.fund({value: ethers.utils.parseEther("0.01")}); 
await fundBnb.wait(1); 
const getArr = await faucet.returnFunders(); 
const getSize = getArr.length;
assert.equal("1",getSize.toString()); 
})
it("After the first fund in the array 'funders' should corretly be returned the address who funded money", async function(){
const fundBnb = await faucet.fund({value: ethers.utils.parseEther("0.01")}); 
await fundBnb.wait(1); 
const getArr = await faucet.returnFunders(); 
console.log(getArr); 
})


//OWNER WITHDRAW
it("Can't withdraw if the contract balance is 0", async function(){
await expect(faucet.ownerWithdraw()).to.be.revertedWith("Can't do the withdraw because the contract balance is 0");
})
it("If the contract balance is more than 0, owner can withdraw", async function(){
const fundBnb = await faucet.fund({value: ethers.utils.parseEther("0.01")}); 
await fundBnb.wait(1); 
const withdraw = await faucet.ownerWithdraw(); 
await withdraw.wait(1); 
})


//WITHDRAW TO FUND USERS
it("User address can't withdraw twice in the same hour", async function(){
const fundBnb = await faucet.fund({value:ethers.utils.parseEther("0.02")}); 
await fundBnb.wait(1); 
const withdrawToFundTheUsers = await faucet.withdrawToFundUsers("0xA398071aB64A0D2Fe84072c7B0524004BC1030eA", ethers.utils.parseEther("0.01")); 
await withdrawToFundTheUsers.wait(1); 
await expect(faucet.withdrawToFundUsers("0xA398071aB64A0D2Fe84072c7B0524004BC1030eA", ethers.utils.parseEther("0.01"))).to.be.revertedWith("You need to wait"); 
})
it("Can't withdraw if the value is not > 0", async function(){
const fundBnb = await faucet.fund({value:ethers.utils.parseEther("0.02")}); 
await fundBnb.wait(1); 
await expect(faucet.withdrawToFundUsers("0xA398071aB64A0D2Fe84072c7B0524004BC1030eA", ethers.utils.parseEther("0"))).to.be.revertedWith("Not enough value"); 
})
it("Can't do the withdraw if the value exceeds the contract balance", async function(){
await expect(faucet.withdrawToFundUsers("0xA398071aB64A0D2Fe84072c7B0524004BC1030eA", ethers.utils.parseEther("0.01"))).to.be.revertedWith("Insufficent contract faucet balance"); 
})
it("If everything it's ok user can do the withdraw", async function(){
const fundBnb = await faucet.fund({value:ethers.utils.parseEther("0.02")}); 
await fundBnb.wait(1); 
const withdrawToFundTheUsers = await faucet.withdrawToFundUsers("0xA398071aB64A0D2Fe84072c7B0524004BC1030eA", ethers.utils.parseEther("0.01")); 
await withdrawToFundTheUsers.wait(1); 
})
})