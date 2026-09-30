# 🎯 Wordle

A modern, fast and engaging **Wordle-style word guessing game** built with **React Native, Expo and TypeScript**.

The game supports both **Turkish 🇹🇷 and English 🇬🇧**, includes random games, statistics, persistent game progress, themes, animations and haptic feedback.

> 📱 Designed specifically as a mobile application.

---

## 📱 Overview

**Wordle** is a 5-letter word guessing game where the player has **6 attempts** to find the hidden word.

After submitting a guess, each letter receives a visual status:

* 🟩 **Correct** — The letter is in the correct position.
* 🟨 **Present** — The letter exists in the word but is in the wrong position.
* ⬜ **Absent** — The letter does not exist in the target word.

The game can be played in two languages:

* 🇹🇷 Turkish
* 🇬🇧 English

The application is designed to work primarily with local data and does not require a backend server for the core gameplay.

---

## ✨ Features

### 🎮 Core Gameplay

* 5-letter word guessing
* Maximum of 6 guesses
* Real-time keyboard interaction
* Letter-by-letter word evaluation
* Correct / Present / Absent feedback
* Duplicate-letter handling
* Invalid word detection
* Input sanitization
* Game win/loss states
* New game functionality

### 🎲 Random Game

Players can start a new random game at any time.

The random word is selected from the corresponding language's answer pool.

The previous word is avoided when possible so that consecutive random games do not normally use the same answer.

### 🌍 Multi-language Support

The application supports:

| Language     | Code |
| ------------ | ---- |
| 🇹🇷 Turkish | `tr` |
| 🇬🇧 English | `en` |

Turkish-specific character handling is implemented separately to correctly support characters such as:

`ç ğ ı İ ö ş ü`

For example:

```text
I  → ı
İ  → i
```

This is important because Turkish `I/İ` casing rules are different from English casing rules.

### 📊 Statistics

Game statistics are stored separately for each language.

Tracked statistics include:

* Games played
* Games won
* Current winning streak
* Maximum winning streak
* Guess distribution from 1 to 6 attempts

Example:

```text
Played: 25
Won: 20
Current Streak: 4
Max Streak: 8

Guess Distribution
1 guess → 1
2 guesses → 4
3 guesses → 7
4 guesses → 5
5 guesses → 2
6 guesses → 1
```

Turkish and English statistics are intentionally kept separate.

### 💾 Local Persistence

The application uses **AsyncStorage** to persist local data.

Persisted data includes:

* User settings
* Current game state
* Game statistics
* Language selection
* Theme preference
* Animation preference
* Haptic feedback preference

If storage fails, the application falls back to in-memory state so that gameplay can continue.

### 🎨 Themes

The application supports:

* 🌙 Dark theme
* ☀️ Light theme

The theme system uses a centralized palette so UI components can consume consistent colors throughout the application.

### ✨ Animations

Animations are used to improve the game experience, including:

* Tile reveal animations
* Invalid guess feedback
* UI transitions
* Game result interactions

Animations can be enabled or disabled from the settings.

### 📳 Haptic Feedback

The application uses Expo Haptics to provide tactile feedback during gameplay.

Haptic feedback can be enabled or disabled from settings.

---

# 🧠 How the Game Works

The game follows the classic Wordle evaluation model.

Suppose the target word is:

```text
APPLE
```

And the player guesses:

```text
ALLEE
```

The application evaluates every character and takes duplicate letters into account.

Possible results:

```text
A → Correct
L → Present
L → Absent
E → Absent
E → Correct
```

The duplicate-letter logic is implemented carefully using a multi-pass evaluation approach.

This prevents incorrect behavior when:

* The guessed word contains the same letter multiple times.
* The target contains fewer copies of that letter.
* Some occurrences are correct while others are only present.

---

# 🗂️ Project Structure

The project follows a modular structure separating game logic, UI, storage, themes, word data and utilities.

```text
Wordle/
│
├── App.tsx
├── index.ts
├── app.json
├── package.json
├── tsconfig.json
│
├── scripts/
│   ├── test-game-logic.ts
│   └── test-turkish.ts
│
└── src/
    │
    ├── components/
    │   └── Reusable UI components
    │
    ├── data/
    │   └── words/
    │       ├── en/
    │       └── tr/
    │
    ├── game/
    │   ├── gameLogic.ts
    │   ├── gameSession.ts
    │   ├── wordSelection.ts
    │   └── wordValidation.ts
    │
    ├── screens/
    │   └── GameScreen.tsx
    │
    ├── storage/
    │   └── storage.ts
    │
    ├── theme/
    │   ├── theme.ts
    │   └── ThemeContext.tsx
    │
    ├── types/
    │   └── index.ts
    │
    └── utils/
        └── turkish.ts
```

---

# 🧩 Main Modules

## `src/game`

Contains the core game engine.

### `gameLogic.ts`

Responsible for evaluating submitted guesses.

It determines whether each letter is:

```text
correct
present
absent
```

Duplicate letters are handled explicitly.

### `gameSession.ts`

Responsible for creating and restoring game sessions.

It handles:

* New daily games
* New random games
* Restoring persisted games
* Detecting expired daily games

A saved daily game from a previous UTC day is automatically replaced with the new daily puzzle.

### `wordSelection.ts`

Responsible for selecting words.

It provides:

```ts
getDailyWord()
getRandomWord()
getUtcDateKey()
```

Daily words are deterministic while random games use random selection.

### `wordValidation.ts`

Responsible for validating player input.

It checks things such as:

* Word length
* Valid characters
* Whether the word exists in the selected language's word list

---

# 💾 Storage

The application uses:

```text
@react-native-async-storage/async-storage
```

Storage keys are separated by purpose.

For example:

```text
wordle:settings

wordle:statistics:tr
wordle:statistics:en

wordle:game-state:tr
wordle:game-state:en
```

This separation allows Turkish and English game progress and statistics to remain independent.

---

# 🎨 Theme System

The project has a centralized theme system.

Two palettes are currently available:

```text
Dark
Light
```

Each palette defines colors for:

* Background
* Surface
* Borders
* Text
* Accent
* Correct letters
* Present letters
* Absent letters
* Errors
* Overlays
* Toast messages

This allows UI components to remain independent from hard-coded theme colors.

---

# 🌐 Word Data

Word data is stored locally inside the project.

```text
src/data/words/
├── en/
└── tr/
```

The application maintains separate answer pools for Turkish and English.

The project expects the words used by the game to contain exactly **5 letters**.

Turkish words are normalized with Turkish-aware character handling.

---

# 🛠️ Tech Stack

| Technology                     | Purpose                           |
| ------------------------------ | --------------------------------- |
| React Native                   | Mobile application framework      |
| Expo                           | Development and native tooling    |
| TypeScript                     | Type-safe application development |
| AsyncStorage                   | Local persistence                 |
| Expo Haptics                   | Haptic feedback                   |
| Expo Linear Gradient           | UI gradients                      |
| React Native Safe Area Context | Safe area handling                |
| Expo Status Bar                | Status bar configuration          |

The current project uses:

```text
React Native 0.86.3
React 19.2.3
Expo ~57.0.25
TypeScript ~6.0.3
```

---

# 🚀 Getting Started

## Requirements

Before running the project, make sure you have:

* Node.js
* npm
* Expo CLI / Expo tooling
* Android Studio for Android development, if needed
* Xcode for iOS development, if needed

You can also use a physical device with the appropriate Expo development workflow.

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/alperenynk/Wordle.git
```

Move into the project directory:

```bash
cd Wordle
```

Install dependencies:

```bash
npm install
```

---

# ▶️ Running the Application

Start the Expo development server:

```bash
npm start
```

Then choose the platform you want to use.

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

---

# 🧪 Testing

The project includes lightweight scripts for checking important game behavior.

## TypeScript Check

Run:

```bash
npm run typecheck
```

This executes:

```bash
tsc --noEmit
```

and checks the project for TypeScript errors without generating output files.

---

## Game Logic Tests

Run:

```bash
npm run test:logic
```

This executes:

```bash
tsx scripts/test-game-logic.ts
tsx scripts/test-turkish.ts
```

The tests cover important cases such as:

### Duplicate Letters

```text
Secret: apple
Guess:  allee
```

This verifies that duplicate letters are evaluated correctly.

### Turkish Characters

The test suite checks characters such as:

```text
ı
İ
ş
ğ
```

and verifies Turkish-specific lowercase/uppercase behavior.

### Word Validation

The test suite also checks:

* Invalid word length
* Unknown words
* Turkish words
* English words
* Input sanitization

### Daily Word Determinism

The same date and language must always generate the same daily word.

---

# 🎮 Game Flow

A typical game follows this flow:

```text
Launch App
    │
    ▼
Load Settings & Saved Data
    │
    ▼
Create / Restore Game
    │
    ▼
Player enters a 5-letter word
    │
    ▼
Validate Guess
    │
    ├── Invalid → Show Feedback
    │
    └── Valid
          │
          ▼
     Evaluate Guess
          │
          ▼
   Update Board & Keyboard
          │
          ▼
      Game Finished?
       /          \
     Yes           No
      │             │
      ▼             ▼
 Statistics      Next Guess
```

---

# 🏆 Game States

The application uses three main game states:

```text
playing
won
lost
```

### Playing

The player can continue entering guesses.

### Won

The player correctly guesses the target word.

The game updates:

* Games played
* Games won
* Current streak
* Maximum streak
* Guess distribution

### Lost

The player uses all 6 attempts without finding the target word.

The game is then completed and the statistics are updated.

---

# ⚙️ Settings

The application provides user preferences for:

### Language

```text
🇹🇷 Turkish
🇬🇧 English
```

Changing the language creates a session for the selected language.

### Theme

```text
🌙 Dark
☀️ Light
```

### Animations

```text
Enabled
Disabled
```

### Haptics

```text
Enabled
Disabled
```

All settings are persisted locally.

---

# 🔐 Privacy & Data

The game is designed around local data storage.

Core gameplay does not require:

* User accounts
* A backend server
* A remote database
* Internet access for selecting the daily word

Game settings, progress and statistics are stored locally on the device using AsyncStorage.

No server-side user profile is required for the current implementation.

---

# 🧱 Architecture

The application separates responsibilities into several layers:

```text
┌──────────────────────────┐
│        UI / Screens      │
│      React Native        │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       Game Session       │
│   State & Game Flow      │
└────────────┬─────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌────────────┐ ┌─────────────┐
│ Game Logic │ │ Word System │
└────────────┘ └─────────────┘
      │             │
      └──────┬──────┘
             ▼
┌──────────────────────────┐
│        Storage           │
│      AsyncStorage        │
└──────────────────────────┘
```

This separation keeps the core game logic independent from the React Native UI.

---

# 📌 Design Principles

The project follows several development principles.

### Type Safety

TypeScript types are used for:

* Game state
* Settings
* Statistics
* Languages
* Game modes
* Game statuses
* Letter statuses

For example:

```ts
type Language = "tr" | "en";

type GameMode = "daily" | "random";

type GameStatus = "playing" | "won" | "lost";

type LetterStatus =
  | "correct"
  | "present"
  | "absent"
  | "empty";
```

### Separation of Concerns

UI components should not contain unnecessary game logic.

Game rules are kept inside the `game` module while persistence is handled by the `storage` module.

### Reusable Components

Common UI elements are separated into reusable components where appropriate.

### Local-first Architecture

The game does not depend on a backend for its core functionality.

This makes the application:

* Fast
* Simple
* Offline-friendly
* Easy to develop
* Easy to test

---

# 📈 Current Scope

The current project focuses on the core single-player Wordle experience.

### Included

* [x] 5-letter words
* [x] 6 attempts
* [x] Turkish language
* [x] English language
* [x] Daily mode
* [x] Random mode
* [x] Duplicate-letter handling
* [x] Word validation
* [x] Statistics
* [x] Streak tracking
* [x] Guess distribution
* [x] Local game persistence
* [x] Dark theme
* [x] Light theme
* [x] Animations
* [x] Haptic feedback
* [x] Turkish character handling
* [x] TypeScript type checking
* [x] Game logic verification scripts

---

# 🤝 Contributing

Contributions are welcome.

If you want to contribute:

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/my-feature
```

3. Make your changes.
4. Run the type checker.

```bash
npm run typecheck
```

5. Run the game logic checks.

```bash
npm run test:logic
```

6. Commit your changes.

```bash
git commit -m "feat: add my feature"
```

7. Push the branch.

```bash
git push origin feature/my-feature
```

8. Open a Pull Request.

---

# 🐛 Reporting Issues

If you find a bug, please open an issue and include:

* Device / platform
* Operating system version
* Steps to reproduce
* Expected behavior
* Actual behavior
* Screenshots or screen recordings if possible

For example:

```text
Platform:
Android

Problem:
Turkish "İ" character is not evaluated correctly.

Steps:
1. Select Turkish language
2. Start a new game
3. Enter a word containing "İ"
4. Submit the guess

Expected:
The character should be evaluated according to Turkish casing rules.

Actual:
...
```

---

# 👨‍💻 Author

**Alperen Yanık**

GitHub:

https://github.com/alperenynk

Repository:

https://github.com/alperenynk/Wordle

---

## ⭐ Project

If you find the project useful or interesting, you can support it by giving the repository a ⭐ on GitHub.

---

## 📚 Summary

**Wordle** is a TypeScript-based React Native game focused on providing a clean and modern Wordle experience on mobile devices.

The project combines:

```text
React Native
      +
Expo
      +
TypeScript
      +
Local Storage
      +
Deterministic Daily Puzzles
      +
Turkish / English Support
      +
Statistics
      +
Themes
      +
Haptic Feedback
```

The architecture keeps the game engine, word management, persistence and UI separated, making the project easier to maintain and extend as new features are added.
