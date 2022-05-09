const crypto = require('crypto')
const fs = require('fs-extra')
const path = require('path')
const Metashu = require('@ndujalabs/metashu')

const snapshot = require('../input/snapshot.json')
const teamTokens = require('./teamTokens');

class Shuffler {

  async run(opt) {
    if (opt.shuffle) {
      return this.shuffleMetadata(opt)
    } else if (opt.verify) {
      return this.verifyFile(opt)
    }
  }

  async sha256File(file) {
    const fileBuffer = await fs.readFile(file)
    const hashSum = crypto.createHash('sha256')
    hashSum.update(fileBuffer)
    return hashSum.digest('hex')
  }

  async verifyFile(opt) {
    let fn = path.resolve(process.cwd(), opt.verify[0])
    if (!(await fs.pathExists(fn))) {
      console.error('File not found')
      process.exit(1)
    }
    let sha256 = await this.sha256File(fn)
    if(opt.verify[1] === sha256) {
      console.log('Success. The file is the right one.')
    } else {
      console.log('Nope. The file has a different hash.')
    }
  }

  async shuffleMetadata(opt) {
    const salt = snapshot.hash
    const tmp = path.resolve(__dirname, '../tmp')
    await fs.ensureDir(tmp)
    // if allMetadata has not been previously saved, it throws an exception
    const allMetadata = require('../input/metadata-EVD2.json')
    const specials = require('./specials')
    const teamTokens = require('./teamTokens')
    const teamMetadata = []
    const remainingMetadataWithoutSpecials = []
    for (let m of allMetadata) {
      delete m.external_url
      m.image = "https://img.everdragons2.com/tmp/" + m.image.split("/")[4]
      // console.log(m)
      if (teamTokens.includes(m.name)) {
        m.tokenId = teamTokens.indexOf(m.name)
        teamMetadata.push(m)
      } else if (!specials.includes(m.name)) {
        remainingMetadataWithoutSpecials.push(m)
      }
    }

    teamMetadata.sort((a,b) => {
      a = a.tokenId
      b = b.tokenId
      return a > b ? 1 : a < b ? -1 : 0;
    })
    await fs.writeFile(path.resolve(tmp, 'teamMetadata.json'), JSON.stringify(teamMetadata, null, 2))
    const metadata = path.resolve(tmp, 'remainingMetadataWithoutSpecials.json')
    await fs.writeFile(metadata, JSON.stringify(remainingMetadataWithoutSpecials, null, 2))
    const output = path.resolve(__dirname, "../output/finalMetadata.json")
    const options = {
      input: metadata,
      output,
      salt,
      firstId: 10,
      addTokenId: true,
      limit: 600 - 9,
      remaining: path.resolve(__dirname, '../input/notShuffledMetadata.json'),
    }
    const metashu = new Metashu(options)
    await metashu.shuffle()
    // pre-append teamMetadata
    let finalMetadata = teamMetadata.concat(require(output))
    await fs.writeFile(output, JSON.stringify(finalMetadata, null, 2))
  }

}

module.exports = new Shuffler()
