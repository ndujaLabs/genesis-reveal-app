# Everdragons2 Genesis Reveal App

_Forked from https://github.com/superpowerlabs/genesis-blueprints-reveal-app_

A simple tool to shuffle the metadata of the Everdragons2 Genesis tokens and reveal the final ones.

### Introduction

Everdragons2 is a collection of 10,001 dragons randomly generated from hundreds of assets. They inherit the legacy of Everdragons, minted in 2018 as the first bridgeable cross-chain non-fungible token (NFT) for gaming. 

The Genesis Everdragons2 is a subset of 600 dragons with DAO voting power and many other extra features. They are also the first 600 Everdragons2 to be mined.

#### The flow

The entire set of metadata is in `input/metadata-EDV2.json`. 

**Stage 1**

1. Chose a future block on the Polygon blockchain. 
2. Include the selected block in the file `input/snapshot.json` and update this repo.
3. Commit and push to GitHub.

**Stage 2**

1. When the block is mined, include its hash in the snapshot file
2. Shuffle the metadata. The script will generate a file `genesisMetadata.json` with for the first 600 JSON files in the `output` folder, and a file `remainingMetadata.json`, in `input`. This file will be the base for the remaining 9401 dragons that will be mined later. 
3. Commit and push the update to GitHub. 

**Stage 3**
1. Upload all the metadata to S3. 
2. Deploy EVD2 (i.e., E2GT Version 2).
3. Airdrop the tokens to the owners.
4. Burn the tokens in the V1 contract.

Notice that immediately after the shuffle, the images are not available, but they have been hashed with SHA256 and later it is possible to verify that the image is the one that was supposed to be. When the images will be uploaded to Arweave, the metadata will be updated with the url of the images, and split in 600 JSON files that will be uploaded to Arweave as well.

### A future block

The chosen block is [28204804](https://polygonscan.com/block/countdown/28204804) on the Polygon PoS blockchain. The estimated target date is Wednesday, May 11, 2022, at 12:03:35 GMT-0700 (PDT).

When the block is mined this repo will be updated and ready to shuffle the metadata.

If you are part of the team, or a winner of Goldmine, ARG, etc. to check which are the tokenIDs of your NFTs, search you address in `src/whitelist.json`.

### Shuffle the data

First off, install the dependencies
``` 
npm i -g pnpm
pnpm install
```

When the hash is updated in `input/snapshot.json`, run
``` 
./shuffler.js --shuffle
```

It will generate a JSON file with 600 metadata.

Anyone can run it again to confirm that the repo is unchanged and the shuffling is fair.

### Validate an image

The image of any dragon has been hashed with SHA256. After than the images will be updated to Arweave, anyone can verify that the image is the one that was supposed to be. Any metadata file has the attribute `imageSha256`. To verify it, download the image, for example, `Sooloth.png` which has the hash `3416c69d047fe6287a74046c3959b5768fe53917b1fb2ca05599d75e13dc4cdc` and launch:
``` 
./shuffler.js --verify Soolhoth.png 3416c69d047fe6287a74046c3959b5768fe53917b1fb2ca05599d75e13dc4cdc
```

### Credits

Author: [Francesco Sullo](https://github.com/sullof)

### License
MIT
