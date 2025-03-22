# Running Pace Calculator

A simple React application that calculates running pace and time for various distances. The calculator allows users to:

- Calculate time from pace and vice versa
- Select from popular distances (5K, 10K, Half Marathon, Marathon)
- Enter custom distances
- Toggle between kilometers and miles

## Live Demo

View the live application at: https://[your-github-username].github.io/running-pace-calculator/

## Features

- **Two-way calculation**: Calculate total time from pace or pace from total time
- **Popular distances**: Quick selection of common running distances
- **Custom distance**: Option to enter any distance
- **Unit conversion**: Switch between kilometers and miles
- **Responsive design**: Works on mobile and desktop devices

## Setup and Deployment

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/[your-github-username]/running-pace-calculator.git
   ```

2. Navigate to project directory:
   ```
   cd running-pace-calculator
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### GitHub Pages Deployment

1. Update the `homepage` field in `package.json` with your GitHub username:
   ```json
   "homepage": "https://[your-github-username].github.io/running-pace-calculator"
   ```

2. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

Alternatively, the included GitHub Actions workflow will automatically deploy your application when you push to the main branch.

## Technologies Used

- React
- Tailwind CSS
- GitHub Pages

## License

MIT