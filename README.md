<h1 align="center">
	React Typing Test
</h1>

<h3 align="center">
	Minimal typing test with leaderboard.
</h3>

<h3 align="center">
	<b>Live:</b> type.ethanhaque.ca<br>
	<b>1.0 Serverless:</b> https://eh-type.netlify.app/<br>
	<b>Backend:</b> https://github.com/Ethan-Haque/words-api
</h4>

<h4 align="center">
	Version: 2.0
</h4>

<p align="center">
	<a href="#demo">Demo</a> •
	<a href="#features">Features</a> •
	<a href="#tech-stack">Tech Stack</a>
</p>

## Demo
![TypingTest](https://user-images.githubusercontent.com/40015195/191353106-ae9d8293-ed84-495f-8f1e-f16aa0dc098f.gif)

## Features
* <b>Keyboard-First Design:</b> All test interactions are handled via keyboard input, providing an accessible and efficient user experience.
* <b>Persistent Settings:</b> User preferences for the timer and number of sentences are stored in local storage and can be dynamically managed through keypresses.
* <b>Performance Tracking:</b> Real-time tracking of typing metrics such as time, words per minute (WPM), and accuracy, with scores securely saved in a PostgreSQL database.
* <b>Dynamic Sentence Generation:</b> Sentences are dynamically retrieved from a custom-built Words API, ensuring variety in typing tests.
* <b>Interactive Leaderboard:</b> Displays user scores fetched from the backend, with options to filter based on test settings like sentence count.

## Tech Stack
This project was created with React and TailwindCSS, and is hosted on my VPS alongside the API and database.
1.0 is hosted on Netlify with Netlify serverless functions and FaunaDB as the database. 

<p align="center">
	<img src="https://img.shields.io/badge/React-05122A?style=flat&logo=react" alt="react Badge" height="25">&nbsp;
	<img src="https://img.shields.io/badge/Javascript-05122A?style=flat&logo=javascript" alt="javascript Badge" height="25">&nbsp;
	<img src="https://img.shields.io/badge/TailwindCSS-05122A?logo=tailwindcss" alt="TailwindCSS Badge" height="25">&nbsp;
</p>
<p align="center">
	<img src="https://img.shields.io/badge/Netlify-05122A?logo=netlify" alt="Netlify Badge" height="25">&nbsp;
	<img src="https://img.shields.io/badge/FaunaDB+FQL-05122A?logo=fauna" alt="FaunaDB Badge" height="25">&nbsp;
</p>
