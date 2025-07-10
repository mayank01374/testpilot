This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🚀 Running with Docker

You can build and run this project in a Docker container. This ensures a consistent environment and makes it easy to deploy anywhere.

### 1. Build the Docker image

```bash
docker build -t testpilot .
```

### 2. Run the Docker container

You may need to provide environment variables for full functionality (e.g., `GROQ_API_KEY`, `GITHUB_PRIVATE_KEY`, etc.). You can pass them with `-e` flags or use a `.env` file.

#### Example with environment variables:

```bash
docker run -p 3000:3000 \
  -e GROQ_API_KEY=your_groq_api_key \
  -e GITHUB_PRIVATE_KEY=your_github_private_key \
  -e GITHUB_WEBHOOK_SECRET=your_webhook_secret \
  -e GITHUB_APP_ID=your_github_app_id \
  -e GITHUB_CLIENT_ID=your_github_client_id \
  -e GITHUB_CLIENT_SECRET=your_github_client_secret \
  testpilot
```

#### Or with a .env file:

1. Create a `.env` file in the project root with your variables:
   ```env
   GROQ_API_KEY=your_groq_api_key
   GITHUB_PRIVATE_KEY=your_github_private_key
   GITHUB_WEBHOOK_SECRET=your_webhook_secret
   GITHUB_APP_ID=your_github_app_id
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```
2. Run the container with:
   ```bash
   docker run --env-file .env -p 3000:3000 testpilot
   ```

The app will be available at [http://localhost:3000](http://localhost:3000)
