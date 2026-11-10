<!-- 
# EXAMPLE

### Create user

```
POST /api/users
```

Request:

```
{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}
```

Response:

```
201 Created
{
  "userId": "abc123"
}
```

Also document:

- status codes
- error responses
- authentication requirement


 -->

## authRouter

### Create User Account

```
POST /signup
```
<!-- ########################################### -->
### Login

```
POST /login
```
<!-- ########################################### -->
### Logout

```
POST /logout
```

<!-- ########################################### -->

## profileRouter

### View user profile

```
GET /profile/view
```
<!-- ########################################### -->
### Edit profile data

```
PATCH /profile/edit
```
<!-- ########################################### -->
### Delete user account

```
DELETE /profile/delete
```
<!-- ########################################### -->


## connectionRequestRouter

### send ConnectionRequest (send Status interested/ignored)

```
POST /feed/requests/send/:status/:toUserId 
```
<!-- ########################################### -->

<!-- 

### View sent connection requests

```
GET /user/connectionRequests/sent/view
``` -->
<!-- ########################################### -->
<!-- 

### View received connection requests

```
GET /user/connectionRequests/received/view
``` -->
<!-- ########################################### -->


### Review Requests to (accepted/rejected) received connection requests

```
POST /request/review/:status/:requestId
```
<!-- ########################################### -->


## userRouter

### View user feed
```
GET /user/feed
```
<!-- ########################################### -->

### View user connections
```
GET /user/connections
```
<!-- ########################################### -->


### View user connection requests
```
GET /user/requests/received
```
<!-- ########################################### -->

