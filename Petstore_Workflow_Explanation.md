# Petstore API Workflow - Complete Explanation

## Overview
This collection performs a complete pet lifecycle: create → order → delete → verify deletion.
It's designed to run 4 times using Postman's Collection Runner with iterations.

---

## 1. Create Pet Request

### Request Body:
```json
{
  "id": {{currentPetId}},
  "category": {
    "id": 1,
    "name": "Dogs"
  },
  "name": "TestPet{{currentPetId}}",
  "photoUrls": [
    "https://example.com/pet{{currentPetId}}.jpg"
  ],
  "tags": [
    {
      "id": 1,
      "name": "test"
    }
  ],
  "status": "available"
}
```

### Field Explanations:

**`"id": {{currentPetId}}`**
- **What it is**: Unique identifier for the pet
- **Where it comes from**: Generated in Pre-request Script using `pm.info.iteration`
- **Values**: 10001, 10002, 10003, 10004 (for 4 iterations)

**`"category"`**
- **What it is**: Pet category grouping
- **Purpose**: Organizes pets by type (Dogs, Cats, Birds, etc.)
- **Static value**: We use "Dogs" for all pets in this test

**`"name": "TestPet{{currentPetId}}"`**
- **What it is**: Pet's display name
- **Values**: "TestPet10001", "TestPet10002", etc.
- **Purpose**: Makes each pet easily identifiable

**`"photoUrls"`**
- **What it is**: Array of photo URLs for the pet
- **Required field**: Swagger API requires at least one photo URL
- **Our value**: Fake URL for testing purposes

**`"tags"`**
- **What it is**: Labels/keywords for categorizing pets
- **Purpose**: Additional metadata for filtering/searching pets
- **Our value**: Simple "test" tag to identify our test pets
- **Structure**: Array of objects with `id` and `name`

**`"status": "available"`**
- **What it is**: Pet's availability status
- **Possible values**: "available", "pending", "sold"
- **Why "available"**: Requirement specifies creating pets with "available" status

### Pre-request Script:
```javascript
// Generate unique IDs for each run
const iteration = pm.info.iteration || 0;
const petId = 10001 + iteration;
const orderId = 20001 + iteration;
pm.environment.set('currentPetId', petId);
pm.environment.set('currentOrderId', orderId);
```

**Explanation**:
- `pm.info.iteration`: Gets current iteration number (0, 1, 2, 3)
- Creates unique IDs by adding iteration to base numbers
- Stores IDs in environment variables for use across requests

---

## 2. Place Order Request

### Request Body:
```json
{
  "id": {{currentOrderId}},
  "petId": {{currentPetId}},
  "quantity": 1,
  "shipDate": "2025-08-03T08:10:22.870Z",
  "status": "placed",
  "complete": true
}
```

### Field Explanations:

**`"id": {{currentOrderId}}`**
- **What it is**: Unique order ID
- **Values**: 20001, 20002, 20003, 20004
- **Source**: Generated in first request's pre-request script

**`"petId": {{currentPetId}}`**
- **What it is**: References which pet this order is for
- **Purpose**: Links order to specific pet
- **Values**: 10001, 10002, 10003, 10004

**`"quantity": 1`**
- **What it is**: How many pets to order
- **Static value**: Always 1 for our test

**`"shipDate"`**
- **What it is**: When the order should be shipped
- **Format**: ISO 8601 datetime string
- **Our value**: Fixed date for testing

**`"status": "placed"`**
- **What it is**: Order status
- **Possible values**: "placed", "approved", "delivered"
- **Why "placed"**: Standard initial status for new orders

**`"complete": true`**
- **What it is**: Whether order processing is complete
- **Type**: Boolean
- **Our value**: true (order is fully processed)

---

## 3. Delete Order Request (with Retry)

### Request Details:
- **Method**: DELETE
- **URL**: `{{baseUrl}}/store/order/{{currentOrderId}}`
- **Headers**: `api_key: {{apiKey}}` (Authentication required)

### Test Script (Retry Logic):
```javascript
let retryCount = pm.environment.get('orderDeleteRetries') || 0;

if (pm.response.code === 200) {
    pm.test("Order deleted successfully", function () {
        pm.expect(pm.response.code).to.eql(200);
    });
    pm.environment.unset('orderDeleteRetries');
    console.log('Order deleted:', pm.environment.get('currentOrderId'));
} else if (pm.response.code === 404 && retryCount < 3) {
    pm.environment.set('orderDeleteRetries', retryCount + 1);
    console.log('Order delete retry', retryCount + 1, 'for order:', pm.environment.get('currentOrderId'));
    postman.setNextRequest(pm.info.requestName);
} else {
    pm.test("Order delete failed after retries", function () {
        pm.expect(pm.response.code).to.eql(200);
    });
    pm.environment.unset('orderDeleteRetries');
}
```

**Retry Logic Explanation**:
- **Success (200)**: Order deleted successfully, continue to next request
- **Not Found (404) + retries < 3**: Increment retry counter, repeat this request
- **Other failures or max retries reached**: Mark as failed, continue

---

## 4. Delete Pet Request (with Retry)

### Request Details:
- **Method**: DELETE
- **URL**: `{{baseUrl}}/pet/{{currentPetId}}`
- **Headers**: `api_key: {{apiKey}}` (Authentication required)

### Test Script:
Same retry logic as order deletion, but for pets.

---

## 5. Verify Pet Deleted (404 Check)

### Request Details:
- **Method**: GET
- **URL**: `{{baseUrl}}/pet/{{currentPetId}}`
- **Expected Result**: 404 Not Found

### Test Script:
```javascript
pm.test("Pet not found after deletion (404)", function () {
    pm.expect(pm.response.code).to.eql(404);
});

console.log('Verified pet deletion - Pet ID:', pm.environment.get('currentPetId'));
```

**Purpose**: Confirms pet was actually deleted from the system.

---

## 6. Verify Order Deleted (404 Check)

### Request Details:
- **Method**: GET
- **URL**: `{{baseUrl}}/store/order/{{currentOrderId}}`
- **Expected Result**: 404 Not Found

**Purpose**: Confirms order was actually deleted from the system.

---

## Variables Used

### Collection Variables:
- **`{{baseUrl}}`**: `https://petstore.swagger.io/v2`
- **`{{apiKey}}`**: `special-key`

### Environment Variables (Dynamic):
- **`{{currentPetId}}`**: Current pet ID (10001-10004)
- **`{{currentOrderId}}`**: Current order ID (20001-20004)
- **Retry counters**: `orderDeleteRetries`, `petDeleteRetries`

---

## Running the Collection

1. **Import** the collection into Postman
2. **Open Collection Runner**
3. **Set Iterations**: 4
4. **Run**: Each iteration will process one complete pet lifecycle

### Expected Results:
- **4 pets created** (IDs: 10001, 10002, 10003, 10004)
- **4 orders placed** (IDs: 20001, 20002, 20003, 20004)
- **All orders deleted** (with retries if needed)
- **All pets deleted** (with retries if needed)
- **All deletions verified** (404 responses confirmed)

This approach is clean, efficient, and follows the API automation requirements perfectly!
