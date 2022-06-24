# テスト結果

### ローカル環境(Ganache)でのテスト結果は下記の通り

```cmd
Using network 'development'.


Compiling your contracts...
===========================
> Compiling ./contracts/MedicalData.sol
> Artifacts written to /var/folders/sx/2tp22cmd3lj2lsqnd8wblkj00000gn/T/test--5500-42nTbHzn5iko
> Compiled successfully using:
   - solc: 0.8.0+commit.c7dfd78e.Emscripten.clang



  Contract: MedicalData Contract tests!!
    initialization
      ✓ confirm owner address
      ✓ confirm doctor's address (105ms)
      ✓ confirm doctor's name (65ms)
    add a new doctor
      ✓ confirm doctor's address and name (151ms)
      ✓ Should revert when contract is called from invalid address (507ms)
    approve method tests
      ✓ approve (119ms)
      ✓ chageStatus (128ms)
      ✓ should revert when contract is called from invalid role address (123ms)
      ✓ should revert when contract is called from invalid role address (147ms)
    claim approve method tests
      ✓ require approvement (106ms)
      ✓ should revert when contract is called from invalid role address (106ms)
    create a new medical data!!
      ✓ create (387ms)
      ✓ should revert when contract is called from invalid role address
      ✓ get patient's medical data (410ms)
      ✓ should revert when contract is called from invalid role address (347ms)
      ✓ should revert when contract is called from invalid role address (305ms)
    update a medical data!!
      ✓ edit (686ms)
      ✓ should revert when contract is called from invalid role address (489ms)
    delete a medical data!!
      ✓ delete (749ms)
      ✓ should revert when contract is called from invalid role address (335ms)


  20 passing (8s)
```