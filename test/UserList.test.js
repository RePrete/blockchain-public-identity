const UserList = artifacts.require('./UserList.sol')

contract('UserList', () => {
  before(async () => {
    this.userList = await UserList.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.userList.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('create user', async () => {
    const publicKey = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"
    const firstName = "firstName"
    const lastName = "lastName"
    const email = "email"
    await this.userList.createUser(publicKey, firstName, lastName, email)

    const user = await this.userList.users(publicKey)

    assert.equal(user.firstName, firstName)
    assert.equal(user.lastName, lastName)
    assert.equal(user.email, email)
  })
})