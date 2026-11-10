
```
CHALLENGE-1:
Duplicate match requests were being created.

SOLUTION:
Added unique compound index on (senderId, receiverId, status).
```

```
CHALLENGE-2: 

Include Connection req sender profile details (such as name, profile picture, age, gender, skills) in the Connection Request to help receiver identify the connection request sender.

SOLUTION:

- Used referencing approach to connect User collection and Connection Requests collection

- Used populate() to get only needed fields(name, profile picture, age, gender, skills) to rather than disclosing sender's sensitive details(passsword, email etc) also.

```

```
CHALLENGE-3: 

In a list of connections of a loggedin user, ensuring only necessary details of the connection(connectionId, connected person details such as name, DP, age, gender, skills) of the connected user are exposed, rather than entire connection details( logged in user details, creation time, updated time, status, etc) which are not needed for the logged in user.

SOLUTION:

- Used array.map() to filter unnecessary details in the connection, and exposed only required connected user details

```


```
CHALLENGE-4: 

Ensure user feed doesn't include 
    1. user's own profile
    2. user's friends
    3. user's rejected and ignored people

SOLUTION:

- Find all the other users with whom the user already interacted -> create a separate list of them -> use that list to filter them out of all users in the users collection.

```


```
CHALLENGE-5: 

Sending the large dataset of users profiles for the feed to the client is 
    - reducing the API performance, 
    - slowing down Data retrieval speed
    - wasting server resources 
    - wasting network bandwidth

SOLUTION:

- Splitting the large data set of user profiles into smaller, manageable chunks(pages), before sending them to the client (i.e., pagination).

- This improved 
    1. API performance
    2. reduced server load
    3. enhanced user experience

```