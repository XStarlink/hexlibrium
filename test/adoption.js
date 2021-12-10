//const { assert } = require("console");


const Adoption = artifacts.require("Adoption");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Adoption", function (accounts ) {
  describe('primeiro grupo de tests', () => {
    let instance;

    before(async() => {
      instance = await Adoption.deployed();
    });
    
  it('o usuário deve adotar um animal de estimação', async() => {
    await instance.adopt.sendTransaction(8, {from: accounts[0]});
    let adopter = await instance.adopters.call(8);
    assert.equal(adopter, accounts[0], "incorret ");
  });

  it('deve obter o endereço do adotante pelo id do animal de estimação na matriz', async() => {
    let adopters = await instance.getAdopters.call();
    assert.equal(adopters[8], accounts[0], "O proprietário do pet id deve ser registrado na matriz");
  });

  it('deve jogar se um id inválido for fornecido', async() => {
    try{
      await instance.adopt.sendTransaction(17,{from: accounts[0]});
      assert.fail(true, false, "esta função não jogou");
    } catch(error){
      assert.include(String(error), "revert", `Expected "revert" but instead got ${error}`);
    }
    
  // });
  // it("should assert true", async function () {
  //   await Adoption.deployed();
  //   return assert.isTrue(true);
  // });
});
});
});