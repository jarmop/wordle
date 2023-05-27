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

  const keyHandler = (key: string) => {
    let guess = guesses[attempt].join('')

    if (key === 'Enter') {
      if (win) {
        setWord(words[getRandomInt(0, words.length)])
        setGuesses(defaultGuesses)
        setAttempt(0)
        setWin(false)
      } else if (guess.length === word.length) {
        if (words.includes(guess)) {
          if (attempt < MAX_ATTEMPT) {
            setAttempt(attempt + 1)
          }
          if (guess === word) {
            setWin(true)
          }
        } else {
          alert('Not in the word list')
        }
      }

      return
    }

    if (key === 'Backspace') {
      if (guess.length > 0) {
        guess = guess.slice(0, -1)
      }
    } else if (key.length === 1 && guess.length < word.length) {
      guess += key
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

  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => keyHandler(event.key)
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
          <div>
            <button onClick={giveUp} style={{ margin: '2px 20px' }}>
              Give up
            </button>
          </div>
        </div>
      </div>
      <div className="Alphabet">
        {aplhabet.split('').map((char) => {
          const wrongCharacter = wrongCharacters.includes(char)
          const className = 'Character alpha' + (wrongCharacter ? ' wrong' : '')

          return (
            <div
              key={char}
              className={className}
              onClick={() => !wrongCharacter && keyHandler(char)}
            >
              {char}
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => keyHandler('Backspace')}
          style={{ margin: '20px', width: '100px', height: '40px' }}
        >
          Backspace
        </button>
        <button
          onClick={() => keyHandler('Enter')}
          style={{ margin: '20px', width: '100px', height: '40px' }}
        >
          Enter
        </button>
      </div>
    </div>
  )
}

export default App
