# RRR - E2E Test Automation

Automated tests for VPSocial.site shop using Playwright.

## Quick Start

### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/)

### 2. Clone & Setup
```bash
git clone <your-repository-url>
cd rrr
npm install
npm run install:browsers
```

### 3. Run Tests
```bash
npm test                 # Run tests
npm run test:headed     # Run with browser visible
npm run test:report     # View results
```

## Files
- `tests/e2e-workflow.spec.ts` - Main test
- `pages/WorkflowPage.ts` - Page actions
- `data/testData.json` - Test data

## Test Flow
1. Go to vpsocial.site
2. Browse categories
3. Add product to cart
4. Checkout as guest
5. Fill form
6. Clear cart

Done! 🎉
