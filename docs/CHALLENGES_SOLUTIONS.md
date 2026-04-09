
```
Problem:
Duplicate match requests were being created.

Solution:
Added unique compound index on (senderId, receiverId).
```