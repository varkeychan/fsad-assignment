# API Endpoints

### AUTH
POST /api/auth/signup → Register new user  
POST /api/auth/login → Login existing user

### ITEMS
GET /api/items → Get all items  
GET /api/items/:id → Get item by ID  
POST /api/items → Create item  
PUT /api/items/:id → Update item  
DELETE /api/items/:id → Delete item

### REQUESTS
POST /api/requests → Create borrow request  
GET /api/requests → Get all (or by userId)  
PUT /api/requests/:id → Update status (APPROVED, REJECTED, ISSUED, RETURNED)
