const { cwd } = require("node:process")
const path = require("path")
const compressing = require("compressing")

const defaultOption = {
  sourceName: "docs",
  type: "zip",
  targetName: "docs",
}

function compression(options = defaultOption) {
  const sourceName = options.sourceName ?? "docs"
  const type = options.type ?? "zip"
  const targetName = options.targetName ?? "docs"
  const targetPath = path.resolve(cwd(), sourceName)
  return {
    name: "compression",
    closeBundle() {
      console.log("start Ziping...")
      compressing.zip
        .compressDir(targetPath, `${targetName}.${type}`)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
  }
}

module.exports = {
  compression,
}
