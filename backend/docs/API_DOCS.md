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

## profileRouters

### View user profile

```
GET /user/profile/view
```
<!-- ########################################### -->
### Edit profile data

```
PATCH /user/profile/edit
```
<!-- ########################################### -->
### Delete user account

```
DELETE /user/profile/delete
```
<!-- ########################################### -->


## feedRouter

### View Feed

```
GET /feed/view
```
<!-- ########################################### -->

## connectionsRouter

### send ConnectionRequest (send Status interested)

```
POST /connections/send/interested/:userId
```
<!-- ########################################### -->

### Ignore recommended profile (send Status ignore a user)

```
POST /connections/send/ignore/:userId
```
<!-- ########################################### -->

### View sent connection requests

```
GET /user/connectionRequests/sent/view
```
<!-- ########################################### -->


### View received connection requests

```
GET /user/connectionRequests/received/view
```
<!-- ########################################### -->


### Accept received connection requests

```
GET /connectionRequests/received/accepted
```
<!-- ########################################### -->


### Reject received connection request

```
GET /connectionRequests/received/reject
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
GET /user/connectionRequests
```
<!-- ########################################### -->

