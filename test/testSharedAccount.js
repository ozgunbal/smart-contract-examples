const SharedAccount = artifacts.require('./SharedAccount.sol')

contract('Greeter', (accounts) => {
    it("should be initialized with 0 accounts", async () => {
        const instance = await SharedAccount.deployed(10);
        const numAccounts = await instance.numberOfAccounts();

        assert.equal(numAccounts.toNumber(), 0, '0 isn\'t the initial numberOfAccounts');
    });
    it('should add new account', async () => {
        const instance = await SharedAccount.deployed(10);
        await instance.openAccount({from: accounts[1]});
        const numAccounts = await instance.numberOfAccounts();

        assert.equal(numAccounts.toNumber(), 1, 'Account is not opened');
    })
})