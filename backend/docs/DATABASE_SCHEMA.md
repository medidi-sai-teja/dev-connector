<!-- Example:

### Users Collection

```
{
  _id: ObjectId,
  name: String,
  email: String,
  passwordHash: String,
  age: Number,
  gender: String,
  photo_url: url
  skills: [String],
  createdAt: Date
}
```

### MatchRequests Collection

```
{
  senderId: ObjectId,
  receiverId: ObjectId,
  status: "pending | accepted | rejected"
}
```

This helps explain **data modeling**.

--- -->


### Users Collection

```
{
  _id: ObjectId,
  name: String,
  email: String,
  passwordHash: String,
  age: Number,
  gender: String,
  photo_url: url
  skills: [String],
  createdAt: Date

  connections: [
    {
      _id: ObjectId,
      user1_id: ObjectId,
      user2_id: ObjectId,
    }
  ]

  chats:[
    {
      _id: ObjectId,
      user1_id: ObjectId,
      user2_id: ObjectId,
      chat: Text
    },
  ]
}
```
