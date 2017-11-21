pragma solidity ^0.4.18;

contract Greeter {
    struct GreetingMessage {
        string message;
        address owner;
    }
    
    // only owner of the contract
    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }
    
    // only owner of the contract or owner of the greeting message
    modifier onlyReadableByOwners (uint idx) {
        GreetingMessage storage currentMessage = greetings[idx];
        require(owner == msg.sender || currentMessage.owner == msg.sender);
        _;
    }
    
    GreetingMessage[] public greetings;
    
    address owner;
    
    function Greeter() public {
        greetings.push(GreetingMessage("Hello Codefiction", msg.sender));
        owner = msg.sender;
    }
    
    function getGreeting(uint idx) onlyReadableByOwners(idx) public constant returns (string, address) {
        GreetingMessage storage currentMessage = greetings[idx];
        return (currentMessage.message, currentMessage.owner);    
    }
    
    function setGreeting(string greetingMsg) public {
        greetings.push(GreetingMessage(greetingMsg, msg.sender));
    }
    
    // changes contract's owner but owner still can read initial greeting message
    function changeOwnership(address newOwner) onlyOwner public {
        owner = newOwner;
    }
}