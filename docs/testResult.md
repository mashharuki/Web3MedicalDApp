# テスト結果

### ローカル環境(Ganache)でのテスト結果は下記の通り

```cmd
Using network 'development'.


Compiling your contracts...
===========================
> Compiling ./contracts/MedicalData.sol
> Artifacts written to /var/folders/0c/vbkwk57s4lb21y1ts4ndr9zh0000gn/T/test--2339-yBPTyliYIpnH
> Compiled successfully using:
   - solc: 0.8.0+commit.c7dfd78e.Emscripten.clang



  Contract: MedicalData Contract tests!!
    initialization
      ✓ confirm owner address
      ✓ confirm doctor's address (40ms)
      ✓ confirm doctor's name (116ms)
    get doctor info tests
      ✓ get doctor info
    add a new doctor
      ✓ confirm doctor's address and name (231ms)
      ✓ Should revert when contract is called from invalid address (421ms)
    approve method tests
      ✓ approve (99ms)
      ✓ chageStatus (60ms)
      ✓ should revert when contract is called from invalid role address (135ms)
      ✓ should revert when contract is called from invalid role address (47ms)
    claim approve method tests
      ✓ require approvement (88ms)
      ✓ should revert when contract is called from invalid role address (48ms)
    create a new medical data!!
      ✓ create (289ms)
      ✓ should revert when contract is called from invalid role address
      ✓ get patient's medical data (318ms)
      ✓ should revert when contract is called from invalid role address (367ms)
      ✓ should revert when contract is called from invalid role address (143ms)
    update a medical data!!
      ✓ edit (589ms)
      ✓ should revert when contract is called from invalid role address (420ms)
    delete a medical data!!
      ✓ delete (528ms)
      ✓ should revert when contract is called from invalid role address (305ms)
    test for paying Treatment costs!!
value: 10000000000000000
contractBalance: 20000000000000000
      ✓ pay !! (393ms)
value: 10000000000000000
      ✓ should revert when contract is called from invalid role address (57ms)
value: 10000000000000000
contractBalance: 20000000000000000
      ✓ should revert when contract is called from invalid role address (172ms)

  Contract: SBT Contract tests!!
    initialization
      ✓ confirm SBT Name
      ✓ confirm SBT Symbol
      ✓ check SBT TotalSupply
    Mint SBT !!
      ✓ mintSBT (117ms)
      ✓ mintSBT * 10 (1006ms)
      ✓ mintSBT * 10 (2086ms)
    burn SBT !!
      ✓ mintSBT (248ms)


  31 passing (12s)
```
