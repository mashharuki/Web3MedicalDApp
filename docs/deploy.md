# マイグレーションの記録

MedicalData と SBT コントラクトのデプロイ記録

```cmd

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Starting migrations...
======================
> Network name:    'munbai'
> Network id:      80001
> Block gas limit: 20000000 (0x1312d00)


1_deploy_medicalData.js
=======================

   Replacing 'MedicalData'
   -----------------------
   > transaction hash:    0x58343fba26731978b8390d9ca8b61d9a80afc0c183f77008960344e6334d1532
   > Blocks: 34           Seconds: 168
   > contract address:    0x83f15ccdD1278908dF5bC646E903afE2f342deC1
   > block number:        27027076
   > block timestamp:     1656927049
   > account:             0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072
   > balance:             8.161177666949197458
   > gas used:            3527517 (0x35d35d)
   > gas price:           2.500000012 gwei
   > value sent:          0 ETH
   > total cost:          0.008818792542330204 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 1 (block: 27027077)
   > confirmation number: 2 (block: 27027078)
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.008818792542330204 ETH


2_deploy_SBT.js
===============

   Replacing 'SBT'
   ---------------
   > transaction hash:    0xf95fd4fbfa585acdd6f527b07f1d68064c298807b9388ca317c50422e72e6c38
   > Blocks: 2            Seconds: 8
   > contract address:    0x808B72a2868D1201FCE18609fC51725DF2eDd845
   > block number:        27027080
   > block timestamp:     1656927069
   > account:             0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072
   > balance:             8.159341349439648607
   > gas used:            734527 (0xb353f)
   > gas price:           2.500000013 gwei
   > value sent:          0 ETH
   > total cost:          0.001836317509548851 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 1 (block: 27027081)
   > confirmation number: 2 (block: 27027082)
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.001836317509548851 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.010655110051879055 ETH

```
