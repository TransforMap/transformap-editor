# USER API endpoints and responses

## getUser

Gets the metadata of a certain user

**Endpoint**: /users/{userId}
**Request method**: GET
**Payload**: No
**Expected response**: A JSON string containing the metadata of the user

```json
{
  "name": "Joe",
  "email": "joe@domain.com",
  "agreedTos": false
}
```

## updateUser

Updates the metadata of a certain user

**Endpoint**: /users/{userId}
**Request method**: PUT
**Payload**: A JSON string containing the updated metadata of the user

```json
{
  "name": "Joe",
  "email": "joe@domain.com",
  "agreedTos": true
}
```

**Expected response**: A JSON string containing the metadata of the user

```json
{
  "name": "Joe",
  "email": "joe@domain.com",
  "agreedTos": true
}
```
