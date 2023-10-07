//SPDX-License-Identifier: MIT


pragma solidity ^0.8.7; 


contract BscFaucet {


event fundEvent(); 


event withdrawToFundUsersEvent();


event ownerWithdrawEvent(); 


error youNeedToWait(); 


mapping(address => uint256) public addressToAmountFunded;


address[] public funders;


address s_owner; 


uint256 numberOfPeopleFunded; 

mapping(address => uint256) public lastCallTimeStamp; 


uint256 private cooldownDuration = 1 hours; 


constructor(address owner){
s_owner = owner; 
numberOfPeopleFunded = 0; 
}


/**
* @dev here creates the function fund to let the contract continues to having liquidity for funding people
*/
function fund()public payable{
addressToAmountFunded[msg.sender] += msg.value;
funders.push(msg.sender);
emit fundEvent();
}


/**
* @dev here creates the ownerWithdraw function where the owner can personally withdraw some bnb from contract, if for some reasons some extra bnb are in the contract
* this will be rarely used 
* 
*/
function ownerWithdraw()public{
require(msg.sender == s_owner, "You're not the owner!"); 
uint256 getBalance = contractBalance();
require(getBalance > 0,"Can't do the withdraw because the contract balance is 0"); 
(bool success,) = msg.sender.call{value: address(this).balance}(""); 
require(success,"Something went wrong with claim"); 
emit ownerWithdrawEvent();
}


/**
* 
* @dev creates this modifider to not allows people claim bnb more than 1 time at hour
*/
modifier onlyOnceAddressWaited1Hour(){
require(block.timestamp >= lastCallTimeStamp[msg.sender] + cooldownDuration,"You need to wait");
_;
}


/**
* 
* @dev here creates the withdrawFunction that is utilized to fund the users
*/
function withdrawToFundUsers(address payable _to, uint256 _value)public onlyOnceAddressWaited1Hour(){
if(block.timestamp >= lastCallTimeStamp[msg.sender] + cooldownDuration){
require(_to != address(0),"Invalid address"); 
require(_value > 0, "Not enough value"); 
require(address(this).balance >= _value,"Insufficent contract faucet balance"); 
_to.transfer(_value); 
numberOfPeopleFunded = numberOfPeopleFunded + 1; 
lastCallTimeStamp[msg.sender] = block.timestamp; 
emit withdrawToFundUsersEvent();
}else{
revert youNeedToWait(); 
}
}


/*
* @dev here just return the number of times that this contract funded people
*/
function seeNumberOfPeopleFunded()public view returns(uint256){
return numberOfPeopleFunded; 
}


/**
* @dev here returns the contract balance, to be able to show it on the website
*/
function contractBalance()public view returns(uint256){
return address(this).balance; 
}


/**
* @dev here returns the function to let see the all the users who funded this contract
*/
function returnFunders()public view returns(address[] memory){
return funders; 
}
}
