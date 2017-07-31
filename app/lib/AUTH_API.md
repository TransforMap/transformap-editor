# AUTH API endpoints and responses

## retrieveAuthToken

Retrieves the auth token from the RP

**Endpoint**: /auth/
**Request method**: GET
**Payload**: No
**Expected response**: A JSON string containing the auth token

```json 
{
  "token": "d07d6ab3-4e3f-44ce-accc-b3efc96b3f04"
}
```

## logout

Decouples the auth token from the current session

**Endpoint**: /auth/
**Request method**: GET
**Payload**: No
**Expected response**: No

