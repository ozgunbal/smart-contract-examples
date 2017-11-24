const SharedAccount = artifacts.require('./SharedAccount.sol')

contract('SharedAccount', (accounts) => {
    let instance;
    before(async() => {
        instance = await SharedAccount.deployed(10);
    });

    it("should be initialized with 0 accounts", async () => {
        const numAccounts = await instance.numberOfAccounts();

        assert.equal(numAccounts.toNumber(), 0, '0 isn\'t the initial numberOfAccounts');
    });
    it('should add new account', async () => {
        await instance.openAccount({from: accounts[1]});
        const numAccounts = await instance.numberOfAccounts();

        assert.equal(numAccounts.toNumber(), 1, 'Account is not opened');
    });
    it('should display balance', async () => {
        await instance.openAccount({from: accounts[2], value: 1});
        const balance = await instance.displayBalance({from: accounts[2]});

        assert.equal(balance.toNumber(), 1, 'Account balance is not match');
    });
    it('should deposit money', async () => {
        const prevBalance = await instance.displayBalance({from: accounts[2]});
        await instance.depositMoney({from: accounts[2], value: 5});
        const currBalance = await instance.displayBalance({from: accounts[2]});
        const expectedDeposit = currBalance.toNumber() - prevBalance.toNumber();
        
        assert.equal(expectedDeposit, 5, 'Deposit is not match');
    });
    it('should withdraw money', async () => {
        const prevBalance = await instance.displayBalance({from: accounts[2]});
        await instance.withdrawMoney(4, {from: accounts[2]});
        const currBalance = await instance.displayBalance({from: accounts[2]});
        const expectedWithdraw = prevBalance.toNumber() - currBalance.toNumber();

        assert.equal(expectedWithdraw, 4, 'Withdraw is not match');
    });
    it('should not open an account if exists', async () => {
        try {
            await instance.openAccount({from: accounts[1]});
        } catch(error) {
            assert.equal(error instanceof Error, true);
        }
    });
    it('should not display balance if account not exists', async () => {
        try {
            await instance.displayBalance({from: accounts[9]});
        } catch(error) {
            assert.equal(error instanceof Error, true);
        }
    });
    it('should not deposit money if account not exists', async () => {
        try {
            await instance.depositMoney({from: accounts[9], value:1});
        } catch(error) {
            assert.equal(error instanceof Error, true);
        }
    });
    it('should not withdraw money if account not exists', async () => {
        try {
            await instance.withdrawMoney(1, {from: accounts[9]});
        } catch(error) {
            assert.equal(error instanceof Error, true);
        }
    });
    it('should change owner', async () => {
        await instance.changeOwner(accounts[1], {from: accounts[0]});
        try {
            await instance.takeAllMoney({from: accounts[0]})
        } catch(error) {
            assert.equal(error instanceof Error, true);
        }
    });
    it('should delete an account by owner', async () => {
        const numAccounts = await instance.numberOfAccounts();
        const accountBalance = await instance.displayBalance({from: accounts[2]});
        const prevBalance =  await instance.displayBalance({from: accounts[1]});
        await instance.deleteAccount(accounts[2], {from: accounts[1]});
        const expectedBalance =  await instance.displayBalance({from: accounts[1]})
        
        const addedShare = accountBalance.toNumber() / (numAccounts.toNumber() - 1);

        assert.equal(prevBalance.toNumber() + addedShare , expectedBalance.toNumber(), 'Deleted account\'s balance not distributed');
    });
})