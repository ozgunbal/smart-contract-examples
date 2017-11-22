const Greeter = artifacts.require('./Greeter.sol')

contract('Greeter', (accounts) => {
    let instance;
    before(async() => {
        instance = await Greeter.deployed();
        await instance.setGreeting("Second greet", {from: accounts[1]});
    });

    it("should be initialized with initial message", async () => {
        const greeting = await instance.getGreeting(0);
        
        const [message, address] = greeting;
        assert.equal(message, "Hello Codefiction", 'Initial message is not set');
        assert.equal(address, accounts[0], 'GreetingMessage is not generated with correct owner');
    });
    it('should set a new greeting', async () => {
        const greeting = await instance.getGreeting(1, {from: accounts[1]});

        const [message, address] = greeting;
        assert.equal(message, "Second greet", 'New greeting message is not set');
        assert.equal(address, accounts[1], 'GreetingMessage is not generated with correct owner');
    });
    it('should greeting message can be read by both message owner and contract owner', async () => {
        const greetingByOwner = await instance.getGreeting(1, {from: accounts[0]});
        const greetingByMessageOwner = await instance.getGreeting(1, {from: accounts[1]});

        const [message1, address1] = greetingByOwner;
        const [message2, address2] = greetingByMessageOwner;
        assert.equal(message1, message2, 'Message owner and contract owner don\'t read the same message');
        assert.equal(address1, address2, 'Owner of the read greeting message did not match');
    });
    it('should greeting message not read except owners', async () => {
        try {
            const greetingByOwner = await instance.getGreeting(0, {from: accounts[1]});
        } catch(error) {
            assert.equal(error instanceof Error, true);
        }
    });
    it('should change contract ownership', async () => {
        const greetingReadByOwner = await instance.getGreeting(1, {from: accounts[0]});
        await instance.changeOwnership(accounts[2], {from: accounts[0]});
        const greetingReadByNewOwner = await instance.getGreeting(1, {from: accounts[2]});

        const [message1, address1] = greetingReadByOwner;
        const [message2, address2] = greetingReadByNewOwner;
        assert.equal(message1, message2, 'Old contract owner and new contract owner don\'t read the same message');
        assert.equal(address1, address2, 'Owner of the read greeting message did not match');
    });
})
