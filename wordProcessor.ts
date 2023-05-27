const fs = require('fs')

fs.readFile('words.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  const words = data.split('\n')

  const wordsByLength = {}

  for (let word of words) {
    if (wordsByLength[word.length] === undefined) {
      wordsByLength[word.length] = []
    }
    wordsByLength[word.length].push(word)
  }

  console.log(wordsByLength[5])

  
  fs.writeFile('src/words.json', JSON.stringify(wordsByLength), (err) => {
    if (err) {
      console.error(err)
    }
    // file written successfully
  })
})
