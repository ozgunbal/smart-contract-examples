const Greeter = artifacts.require('./Greeter.sol')

contract('Greeter', (accounts) => {
    it("should be initialized with initial message", async () => {
        const instance = await Greeter.deployed();
        const greeting = await instance.getGreeting(0);
        
        const [message, address] = greeting;
        assert.equal(message, "Hello Codefiction", '0 isn\'t the initial numberOfAccounts');
        assert.equal(address, accounts[0], 'GreetingMessage is not generated with correct owner');
    });
})
