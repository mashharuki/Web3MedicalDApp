# マイグレーションの記録

MedicalData と SBT コントラクトのデプロイ記録

```cmd

Starting migrations...
======================
> Network name:    'munbai'
> Network id:      80001
> Block gas limit: 20000000 (0x1312d00)


1_deploy_medicalData.js
=======================

   Deploying 'MedicalData'
   -----------------------
   > transaction hash:    0x3d3f13de93312501a474cf1281bbd41a2313b9650ae78d8d41c28d371a2d7266
   > Blocks: 1            Seconds: 4
   > contract address:    0x1FB15c0a8Fa2bCc9C5b01366d28d47D08199b7b1
   > block number:        26997111
   > block timestamp:     1656733546
   > account:             0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072
   > balance:             2.788496498819902501
   > gas used:            3085531 (0x2f14db)
   > gas price:           2.500000008 gwei
   > value sent:          0 ETH
   > total cost:          0.007713827524684248 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 1 (block: 26997112)
   > confirmation number: 2 (block: 26997113)
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.007713827524684248 ETH


Summary
=======
> Total deployments:   1
> Final cost:          0.007713827524684248 ETH

```

```cmd
Starting migrations...
======================
> Network name:    'munbai'
> Network id:      80001
> Block gas limit: 20000000 (0x1312d00)


2_deploy_SBT.js
===============

   Deploying 'SBT'
   ---------------
   > transaction hash:    0x78b8695a2a25dfcf510fd607cc9eea18491c5a3076dffd5f78d9a0caab1d287c
   > Blocks: 1            Seconds: 8
   > contract address:    0xcfFb4F2Dff7919E8dC3a883FdeBe1ceae9aAc304
   > block number:        26997105
   > block timestamp:     1656733516
   > account:             0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072
   > balance:             2.796210326344586749
   > gas used:            734527 (0xb353f)
   > gas price:           2.500000009 gwei
   > value sent:          0 ETH
   > total cost:          0.001836317506610743 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 1 (block: 26997106)
   > confirmation number: 2 (block: 26997107)
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.001836317506610743 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.001836317506610743 ETH

```
