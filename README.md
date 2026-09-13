# Running Pace Calculator

A simple React application that calculates running pace and time for various distances. The calculator allows users to:

- Calculate time from pace and vice versa
- Select from popular distances (5K, 10K, Half Marathon, Marathon)
- Enter custom distances
- Toggle between kilometers and miles

## Live Demo

View the live application at: https://kiralyor.github.io/racepacepro/

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
   git clone https://github.com/KiralyOr/racepacepro.git
   ```

2. Navigate to project directory:
   ```
   cd racepacepro
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

The `homepage` field in `package.json` is `"."`, so the build emits relative asset paths and works
both at a subpath (GitHub Pages) and at a domain root (Vercel). Changing it to an absolute URL will
break whichever target isn't served from that exact path.

1. Deploy to GitHub Pages:
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