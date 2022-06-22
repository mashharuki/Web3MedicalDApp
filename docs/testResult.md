# テスト結果

### ローカル環境(Ganache)でのテスト結果は下記の通り

```cmd
Compiling your contracts...
===========================
> Compiling ./contracts/MedicalData.sol
> Compilation warnings encountered:

    Warning: Visibility for constructor is ignored. If you want the contract to be non-deployable, making it "abstract" is sufficient.
  --> project:/contracts/MedicalData.sol:79:3:
   |
79 |   constructor(address[] memory _doctorAddrs, string[] memory _doctorNames) public {
   |   ^ (Relevant source part starts here and spans across multiple lines).


> Artifacts written to /var/folders/sx/2tp22cmd3lj2lsqnd8wblkj00000gn/T/test--2299-CQ8TelbBsEad
> Compiled successfully using:
   - solc: 0.8.0+commit.c7dfd78e.Emscripten.clang



  Contract: MedicalData Contract tests!!
    initialization
      ✓ confirm owner address
      ✓ confirm doctor's address (63ms)
      ✓ confirm doctor's name (110ms)
    add a new doctor
      ✓ confirm doctor's address and name (184ms)
      ✓ Should revert when contract is called from invalid address (304ms)
    approve method tests
      ✓ approve (98ms)
      ✓ chageStatus (126ms)
      ✓ should revert when contract is called from invalid role address (90ms)
      ✓ should revert when contract is called from invalid role address (120ms)
    claim approve method tests
      ✓ require approvement (97ms)
      ✓ should revert when contract is called from invalid role address (67ms)
    create a new medical data!!
      ✓ create (176ms)
      ✓ should revert when contract is called from invalid role address
      ✓ get patient's medical data (359ms)
      ✓ should revert when contract is called from invalid role address (116ms)
    update a medical data!!
      ✓ edit (712ms)
      ✓ should revert when contract is called from invalid role address (535ms)
      ✓ should revert when contract is called from invalid role address (301ms)
    delete a medical data!!
      ✓ delete (618ms)
      ✓ should revert when contract is called from invalid role address (246ms)
      ✓ should revert when contract is called from invalid role address (341ms)


  21 passing (7s)
```