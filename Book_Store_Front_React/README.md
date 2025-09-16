# Book Store Frontend

React frontend for the Book Store application.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file with:

```env
VITE_API_URL=http://localhost:3000
```

## Production Build

The application builds to the `dist` directory and can be served by any static file server.

## Docker

```bash
# Build image
docker build -t book-store-frontend .

# Run container
docker run -p 80:80 book-store-frontend
```
