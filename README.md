### Demo
https://youtu.be/fZkktR58j_s?si=-J-J8WcYXzZPe_Eo

### Backend 
https://github.com/aritradhabal/ethglobal-backend

### Frontend

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

Include this in ```.env```

```
AUTH_SECRET='next-auth AUTH_SECRET'
HMAC_SECRET_KEY='' #create this by running `openssl rand -base64 32`
AUTH_URL='' #For testing this should be your NGROK URL and for production this should be your production URL
NEXT_PUBLIC_APP_ID="YOUR APP ID"
NEXT_PUBLIC_BACKEND_URL="YOUR BACKEND URL"
NEXT_PUBLIC_DEV_PORTAL_API_key="YOUR DEV_PORTAL API KEY"
```
