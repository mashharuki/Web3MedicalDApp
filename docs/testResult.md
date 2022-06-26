# テスト結果

### ローカル環境(Ganache)でのテスト結果は下記の通り

```cmd
Using network 'development'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



  Contract: MedicalData Contract tests!!
    initialization
      ✓ confirm owner address
      ✓ confirm doctor's address (59ms)
      ✓ confirm doctor's name (84ms)
    get doctor info tests
      ✓ get doctor info (82ms)
    add a new doctor
      ✓ confirm doctor's address and name (222ms)
      ✓ Should revert when contract is called from invalid address (340ms)
    approve method tests
      ✓ approve (105ms)
      ✓ chageStatus (126ms)
      ✓ should revert when contract is called from invalid role address (133ms)
      ✓ should revert when contract is called from invalid role address (83ms)
    claim approve method tests
      ✓ require approvement (152ms)
      ✓ should revert when contract is called from invalid role address (92ms)
    create a new medical data!!
      ✓ create (407ms)
      ✓ should revert when contract is called from invalid role address
      ✓ get patient's medical data (410ms)
      ✓ should revert when contract is called from invalid role address (403ms)
      ✓ should revert when contract is called from invalid role address (259ms)
    update a medical data!!
      ✓ edit (887ms)
      ✓ should revert when contract is called from invalid role address (741ms)
    delete a medical data!!
      ✓ delete (745ms)
      ✓ should revert when contract is called from invalid role address (444ms)


  21 passing (9s)
```