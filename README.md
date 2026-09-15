# AptiX

A web-based aptitude practice platform designed to help users practice and improve their aptitude skills through categorized questions and interactive tests.

## Live Demo

https://aptix-seven.vercel.app/

## Overview

AptiX is an aptitude practice application that provides an interactive environment for solving aptitude questions.

The application organizes questions into different categories and provides a structured interface for practicing and evaluating aptitude skills.

## Features

* Categorized aptitude questions
* Interactive question-solving interface
* Test and practice workflows
* Question navigation
* User-friendly interface
* Responsive design
* Client-side routing
* Supabase integration for application data
* Deployed application with Vercel

## Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Tailwind CSS

### Routing

* React Router

### Backend and Data

* Supabase
* Supabase JavaScript Client

### Build and Development

* Vite
* ESLint
* PostCSS
* Autoprefixer

### Deployment

* Vercel

## Project Structure

```text
AptiX/
├── data/
├── database/
├── public/
├── src/
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

Clone the repository:

```bash
git clone https://github.com/SUMITBOPATE/AptiX.git
```

Navigate to the project directory:

```bash
cd AptiX
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at the local development URL provided by Vite.

## Environment Variables

If the application requires Supabase credentials, create a `.env` file in the project root and configure the required environment variables.

Example:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not commit environment variables containing private credentials to the repository.

## Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Goals

The project was built to provide a practical platform for aptitude preparation while applying concepts such as:

* React component architecture
* Client-side routing
* State management
* API and database integration
* Responsive UI development
* Frontend application organization
* Deployment and production builds

## Future Improvements

Potential improvements include:

* User authentication
* User progress tracking
* Detailed performance analytics
* Timed aptitude tests
* Question bookmarking
* Difficulty-based filtering
* Leaderboards
* Additional aptitude categories
* Improved accessibility
* Automated testing

## Author

Sumit Bopate

GitHub: https://github.com/SUMITBOPATE
