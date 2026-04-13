
```
CHALLENGE-1:
Duplicate match requests were being created.

SOLUTION:
Added unique compound index on (senderId, receiverId).
```

```
CHALLENGE-2: 
Include Connection req sender profile details (such as name, profile picture, age, gender, skills) in the Connection Request to help receiver identify the connection request sender.

SOLUTION:
- Used referencing approach to connect **User collection and Connection Requests collection

- Used populate() to get only needed fields(name, profile picture, age, gender, skills) to rather than disclosing sender's sensitive details(passsword, email etc) also.

```

```
CHALLENGE-3: 
In a list of connections of a loggedin user, ensuring only necessary details of the connection(connectionId, connected person details such as name, DP, age, gender, skills) of the connected user are exposed, rather than entire connection details( logged in user details, creation time, updated time, status, etc) which are not needed for the logged in user.

SOLUTION:
- Used array.map() to filtered unnecessary details in the connection, and exposed only required connected user details

```