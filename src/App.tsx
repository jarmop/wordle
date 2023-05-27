import React, { useEffect, useState } from 'react'
import './App.css'
import words from './words.json'

const MAX_ATTEMPT = 5
const defaultWord = words[getRandomInt(0, words.length)]
const aplhabet = 'abcdefghijklmnopqrstuvwxyz'
const defaultGuesses = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
]

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

const getStatus = (word: string, guessIndex: number, guessChar: string) => {
  if (guessChar === word[guessIndex]) {
    return 'correct'
  } else if (word.includes(guessChar)) {
    return 'missplaced'
  } else {
    return 'wrong'
  }
}

function App() {
  const [word, setWord] = useState(defaultWord)
  const [guesses, setGuesses] = useState(defaultGuesses)
  const [attempt, setAttempt] = useState(0)
  const [win, setWin] = useState(false)

  const characters = []
  for (let character of word) {
    characters.push(character)
  }

  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      let guess = guesses[attempt].join('')

      if (event.key === 'Enter') {
        if (win) {
          setWord(words[getRandomInt(0, words.length)])
          setGuesses(defaultGuesses)
          setAttempt(0)
          setWin(false)
        } else if (guess.length === word.length) {
          if (words.includes(guess)) {
            setAttempt(attempt + 1)
            if (guess === word) {
              setWin(true)
            }
          } else {
            alert('Not in the word list')
          }
        }

        return
      }

      if (event.key === 'Backspace') {
        if (guess.length > 0) {
          guess = guess.slice(0, -1)
        }
      } else if (event.key.length === 1 && guess.length < word.length) {
        guess += event.key
      }

      setGuesses(
        guesses.map((value, i) =>
          i === attempt
            ? ['', '', '', '', ''].map((char, i) =>
                guess[i] !== undefined ? guess[i] : char
              )
            : value
        )
      )
    }
    window.addEventListener('keydown', keydownListener)

    return () => window.removeEventListener('keydown', keydownListener)
  })

  const giveUp = (event: any) => {
    const triggeredWithEnter = event.clientX === 0
    if (win || attempt > MAX_ATTEMPT || triggeredWithEnter) {
      return
    }

    setGuesses(
      guesses.map((value, i) => (i === attempt ? word.split('') : value))
    )
    if (attempt < MAX_ATTEMPT) {
      setAttempt(attempt + 1)
    }
    setWin(true)
  }

  const wrongCharacters = guesses
    .slice(0, attempt)
    .flat()
    .filter((guessChar) => !word.includes(guessChar))

  return (
    <div className="App">
      <div style={{ display: 'flex' }}>
        <div>
          {guesses.map((guess, i) => (
            <div key={i} className="Word">
              {guess.map((character, j) => {
                const className =
                  'Character' +
                  (i < attempt ? ' ' + getStatus(word, j, character) : '')

                return (
                  <div key={`${i}${j}`} className={className}>
                    {character}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div>
          <button onClick={giveUp} style={{ margin: '2px 20px' }}>
            Give up
          </button>
        </div>
      </div>
      <div className="Alphabet">
        {aplhabet.split('').map((char) => {
          const className =
            'Character ' + (wrongCharacters.includes(char) ? 'used' : 'unused')

          return (
            <div key={char} className={className}>
              {char}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
