//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

// We import this library to be able to use console.log
import "hardhat/console.sol";

// This is the main building block for smart contracts.
contract YourContract {
    event SetGreeting(address sender, string greeting);

    string public greeting = "Hello Ethereum!";

    constructor() payable {
        // what should we do on deploy?
    }

    function setGreeting(string memory newGreeting) public {
        greeting = newGreeting;
        console.log(msg.sender, "set greeting to", greeting);
        emit SetGreeting(msg.sender, greeting);
    }

    // to support receiving ETH by default
    receive() external payable {}

    fallback() external payable {}
}
