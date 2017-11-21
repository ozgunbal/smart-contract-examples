pragma solidity ^0.4.18;

contract SharedAccount {
    // Owner takes all the money. [DONE] [Owner leaves accounts active]
    // Owner can close account and share the balance with all accounts. [DONE] [Deactivate account and share its balance will all active accounts]
    // Owner can change owner. [DONE] [Ownership can be changed]
    
    struct AccountBalance {
        address addr;
        uint balance;
        bool isActive;
    }
    
    mapping(address => AccountBalance) accounts;
    mapping(uint => address) users;
    address owner;
    uint maxAccountCount;
    uint public numberOfAccounts;
    
    modifier isAccountExists() {
        require(accounts[msg.sender].addr != address(0) && accounts[msg.sender].isActive);
        _;
    }
    
    modifier isAccountNotExists() {
        require(!(accounts[msg.sender].addr != address(0) && accounts[msg.sender].isActive));
        _;
    }
    
    modifier isBalanceEnough(uint amount) {
        require(accounts[msg.sender].balance >= amount);
        _;
    }
    
    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }
    
    function SharedAccount(uint _maxAccountCount) public {
        owner = msg.sender;
        if(_maxAccountCount != 0) {
            maxAccountCount = _maxAccountCount;
        } else {
            maxAccountCount = 128;
        }
    }
    
    function openAccount() isAccountNotExists() payable public {
        require(numberOfAccounts < maxAccountCount); // modifier ile yapilir mi?
        
        accounts[msg.sender] = AccountBalance(msg.sender, msg.value, true);
        users[numberOfAccounts] = msg.sender;
        numberOfAccounts++;
    }
    
    function withdrawMoney(uint amount) isAccountExists() isBalanceEnough(amount) public {
        msg.sender.transfer(amount);
        accounts[msg.sender].balance -= amount;
    }
    
    function depositMoney() isAccountExists() payable public {
        accounts[msg.sender].balance += msg.value;
    }
    
    function displayBalance() isAccountExists() public constant returns (uint) {
        return accounts[msg.sender].balance;
    }
    
    // Owner functions
    
    function changeOwner(address _newOwner) onlyOwner public {
        owner = _newOwner;
    }
    
    function deleteAccount(address _accountOwner) onlyOwner public {
        accounts[_accountOwner].isActive = false;
        uint sharedBalance = accounts[_accountOwner].balance / (numberOfAccounts - 1);
        accounts[_accountOwner].balance = 0;
        for(uint i=0; i < numberOfAccounts; i++) {
            if(accounts[users[i]].isActive) {
                accounts[users[i]].balance += sharedBalance;
            }
        }
        
    }
    
    function takeAllMoney() onlyOwner public {
        uint totalMoney = 0;
        for(uint i=0; i < numberOfAccounts; i++) {
            if(accounts[users[i]].isActive) {
                totalMoney += accounts[users[i]].balance;
                //accounts[users[i]].isActive = false;
                accounts[users[i]].balance = 0;
            }
        }
        msg.sender.transfer(totalMoney);
    }
}