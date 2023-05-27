const fs = require('fs')

fs.readFile('words5757.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  const words = data.split('\n')
  
  fs.writeFile('src/words.json', JSON.stringify(words), (err) => {
    if (err) {
      console.error(err)
    }
  })
})
