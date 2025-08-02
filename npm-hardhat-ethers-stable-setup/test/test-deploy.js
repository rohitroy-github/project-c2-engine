// // FILE -> Writing/DefiningDeployingTests

// const {ethers} = require("hardhat");
// const {expect, assert} = require("chai");

// // describe("SimpleStorage", () => {})
// describe("SimpleStorage", function () {
//   let simpleStorageFactory, simpleStorage;

//   // beforeEach -> what to do before running the test
//   beforeEach(async function () {
//     // -> deploy the contract before each test
//     simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
//     simpleStorage = await simpleStorageFactory.deploy();
//   });

//   // it -> mainTest
//   // it(" -> desccribeTestsPurpose ", functionToExecute)

//   // test - 1
//   it("Should start with a favorite number of 0", async function () {
//     const currentValue = await simpleStorage.retrieve();
//     const expectedValue = "0";

//     // checkIfWeGetTheExpectedValue
//     assert.equal(currentValue.toString(), expectedValue);
//     // expect(currentValue.toString()).to.equal(expectedValue)
//   });

//   // test - 2
//   it("Should update number, when we call store function", async function () {
//     const expectedValue = "7";
//     const transactionResponse = await simpleStorage.store(expectedValue);
//     await transactionResponse.wait(1);
//     const currentValue = await simpleStorage.retrieve();

//     // checkIfWeGetTheExpectedValue
//     assert.equal(currentValue.toString(), expectedValue);
//   });

//   // test - 3
//   it("Should work correctly with the people struct and array", async function () {
//     const expectedPersonName = "Rohit Roy";
//     const expectedFavoriteNumber = "1";
//     const transactionResponse = await simpleStorage.addPerson(
//       expectedPersonName,
//       expectedFavoriteNumber
//     );
//     await transactionResponse.wait(1);
//     const {favoriteNumber, name} = await simpleStorage.people(0);

//     // We could also do it like this
//     // const person = await simpleStorage.people(0)
//     // const favNumber = person.favoriteNumber
//     // const pName = person.name

//     assert.equal(name, expectedPersonName);
//     assert.equal(favoriteNumber, expectedFavoriteNumber);
//   });
// });

// // ToExecute -> npx hardhat test
