<!-- Learning Log 
Example:

### Date: 12 March

# Task-Sl: Implemented JWT authentication.

### What I learned:
- Difference between access token and refresh token
- How middleware verifies JWT

### Challenges I faced and How I resolved Them:
#### Challenge-1: Token not verifying due to wrong secret key.
#### Solution: Used same JWT_SECRET in login and verify middleware.

-->




<!--########################################################### -->


### Date: 28th Feb, 2026

# Task-1: Gathered Rquirements


### What I learned:
- Defining Project, MVP features, target audience
(in PROJECT_OVERVIEW)

### Challenges I faced and How I resolved Them: --

---

<!--########################################################### -->


### Date: 28th Feb, 2026

# Task-2: Designed Basic System Architecture, Components Interaction, Sequence Flow 

### What I learned:
- Types of System Architectures (Monolith, Decoupled, Microservices)
- Basic High Level Designing
- Basic Low Level Design
    - DB Design
    - API Design (REST APIs)

### Challenges I faced and How I resolved Them:

#### Challenge-1: Confused between decoupled and microservices
#### Solution: TODO

---


<!--########################################################### -->

### Date: 9th March, 2026

# Task-3 : Created Express Server


### What I learned:
- How to create server and start listening.

### Challenges I faced and How I resolved Them: --

---

<!--########################################################## -->

### Date: 9th March, 2026

# Task-4: Created a MongoDB database on a remote server and established a connection to the DB

### What I learned:
- How to create a Cluster space on a remote server

### Challenges I faced and How I resolved Them: --
---

<!-- ########################################################## -->


### Date: 22nd March, 2026

# Task-5: Created User Schema

### What I learned:
- Data Validation
- Data Sanitization


### Challenges I faced and How I resolved Them:

#### Challenge-1: Secure password before storing it in the DB
#### Solution: Used bcrpt to hashing as a pre-save hook 

#### Challenge-2: Validate User input at Schema level
#### Solution: Validated using regex and applying business constraints

#### Challenge-3: Mitigate Injection Attacks at Schema level
#### Solution: Sanitised user input by setting global sanitizer filter
---

<!-- ########################################################## -->


### Date: 6th April, 2026

# Task-6: Create APIs to perform CRUD operations on user profile

### What I learned:
- Data Validation and Sanitization at API level
- CRUD APIs development for User profile


### Challenges I faced and How I resolved Them: --

<!-- ########################################################## -->

### Date: 10th April, 2026

# Task-6: Create APIs to manage Connection Requests

### What I learned:
- Compound Indexing

### Challenges I faced and How I resolved Them: 

**Challange-1:** Duplicate match requests were being created.\
**Solution:** Added unique compound index on (senderId, receiverId).


<!-- ########################################################## -->