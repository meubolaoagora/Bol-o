# Tasks

## Backend
- [x] `src/lib/db.ts`: Prisma client singleton.
- [x] `src/lib/auth.ts` and `src/app/api/auth/[...nextauth]/route.ts`: NextAuth configuration using Credentials provider.
- [x] `src/lib/scoring.ts`: Functions `calculatePoints` and `recalculateAllScores`.
- [x] `src/lib/prize.ts`: Function `calculatePrize(bolao)`.
- [x] `src/app/api/register/route.ts`: Participant registration (hash password with bcryptjs).
- [ ] Other API routes as specified in the implementation plan.

## Frontend
- [x] Reusable components in `src/components/`: Header, Footer, ScoreInput, RankingTable, GameCard, BolaoCard, StatusBadge, PixInfo.
- [x] Landing Page (`src/app/page.tsx`).
- [x] Login/Registration (`src/app/auth/page.tsx`).
- [x] Admin Login (`src/app/admin/login/page.tsx`).
- [x] Other pages in `admin/` and `boloes/`.
