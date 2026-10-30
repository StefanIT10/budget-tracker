
# Budget Tracker

A simple personal budget tracking application built with React and Vite. It allows users to manage their income and expenses, organize transactions by category, and monitor monthly budgets.

## Features

- Add, edit, and delete transactions.
- Track income and expenses.
- Organize transactions by category.
- Filter and search transactions.
- Sort transactions.
- View monthly income and expense summaries.
- Set monthly budgets for different categories.
- Monitor spending, remaining budgets, and budget progress.
- Store application data in the browser using localStorage.
- Handle loading states and errors.

## Technologies

- React
- JavaScript
- Vite
- CSS
- Vitest
- React Testing Library
- Jest DOM
- User Event

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/StefanIT10/budget-tracker.git
   ```

2. Navigate to the project directory:

   ```bash
   cd budget-tracker
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal to use the application.

## Running Tests

The project uses Vitest and React Testing Library for unit and component testing.

Run all tests once:

```bash
npx vitest run
```

Alternatively, run tests in watch mode:

```bash
npm test
```

### Test Coverage

The tests cover the following functionality:

- **Monthly Summary:** calculation of total income and expenses.
- **Budget Summary:** calculation of spending, remaining budgets, and budget progress for each category.
- **Transaction Form Validation:** validation of transaction amounts, dates, and categories, as well as successful transaction submission.

## Production Build

To create a production build, run:

```bash
npm run build
```

The generated files will be available in the `dist` directory.
