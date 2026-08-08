# TradeFlow

## Architecture
TradeFlow is a role-based internal web application designed for a wholesale/distribution company. It features Customer CRM, Product/Inventory, and Sales Challans modules. The core business rule is the atomic challan confirmation transaction which ensures data integrity for stock deductions.

## Tech Stack
| Layer | Choice |
|---|---|
| Backend | Node.js, TypeScript, Express.js |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Validation | Zod v4 |
| Auth | JWT, bcrypt |
| Frontend | React, Vite, Tailwind CSS |
| HTTP Client | Axios, TanStack Query |

## Local Setup
1. Clone repo
2. `cd server && npm install`
3. Copy `.env.example` to `.env`, fill in DATABASE_URL and JWT_SECRET
4. `npx prisma migrate dev`
5. `npx prisma db seed`
6. `npm run dev`
7. `cd ../client && npm install`
8. Copy `.env.example` to `.env`
9. `npm run dev`

## Test Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@tradeflow.com | Password123! |
| Sales | sales@tradeflow.com | Password123! |
| Warehouse | warehouse@tradeflow.com | Password123! |
| Accounts | accounts@tradeflow.com | Password123! |

## Environment Variables
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`
- `NODE_ENV`
- `CORS_ORIGIN`
- `VITE_API_BASE_URL`

## Known Limitations / Assumptions
- Challan items are not editable after creation
- Confirmed challans cannot be reversed
- JWT stored in localStorage rather than httpOnly cookies
- Render free tier may cold-start on first request after inactivity
