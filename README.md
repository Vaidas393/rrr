# RRR - QA Automation Project

Complete QA automation solution with UI and API testing.

## Part 1: UI Testing (Playwright)

Automated E2E tests for VPSocial.site shop using Playwright.

### Quick Start

#### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/)

#### 2. Clone & Setup
```bash
git clone https://github.com/Vaidas393/rrr.git
cd rrr
npm install
npm run install:browsers
```

#### 3. Run Tests
```bash
npm test                 # Run tests
npm run test:headed     # Run with browser visible
npm run test:report     # View results
```

### Files
- `tests/e2e-workflow.spec.ts` - Main test
- `pages/WorkflowPage.ts` - Page actions
- `data/testData.json` - Test data

### UI Test Flow
1. Go to vpsocial.site
2. Browse categories
3. Add product to cart
4. Checkout as guest
5. Fill form
6. Clear cart

---

## Part 2: API Testing (Postman)

Automated API tests for Swagger Petstore using Postman.

### Quick Start

#### 1. Install Postman
Download and install Postman from [postman.com](https://www.postman.com/downloads/)

#### 2. Import Collection
1. Open Postman
2. Click **Import**
3. Select `Petstore_Single_Pet_Workflow.postman_collection.json`
4. Click **Import**

#### 3. Run API Tests
1. Open **Collection Runner** (Runner icon in Postman)
2. Select **"Petstore API - Single Pet Workflow"** collection
3. Set **Iterations: 4**
4. Click **Run**

### API Test Flow (per iteration)
1. Create pet with "available" status
2. Place order for the pet
3. Delete order (with retry mechanism)
4. Delete pet (with retry mechanism)
5. Verify pet deletion (404 check)
6. Verify order deletion (404 check)

### API Files
- `Petstore_Single_Pet_Workflow.postman_collection.json` - Main collection
- `Petstore_Workflow_Explanation.md` - Detailed documentation

### Expected Results
- **4 pets created** (IDs: 10001-10004)
- **4 orders placed** (IDs: 20001-20004)  
- **All resources deleted successfully**
- **All deletions verified with 404 responses**

Done! 🎉
