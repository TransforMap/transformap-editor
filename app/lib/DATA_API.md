# DATA API endpoints and responses

## createPOI

Creates a POI with the data passed as parameter

**Endpoint**: /place/{uuid}
**Request method**: POST
**Payload**: A JSON string containing the metadata of the POI to be created 

```json 
{}
```

**Expected response**: A JSON string containing the POIs metatada

```json 
{}
```

## updatePOI

Updates a POI with the data passed as parameter

**Endpoint**: /place/{uuid}
**Request method**: PUT
**Payload**: A JSON string containing the metadata of the POI to be updated 

```json 
{}
```

**Expected response**: The complete metadata definition of the media file.

```json 
{}
```

## deletePOI

Deletes the POI corresponding to the uuid passed as parameter

**Endpoint**: /place/{uuid}
**Request method**: DELETE
**Payload**: No
**Expected response**: The complete metadata definition of the media file.

```json 
{}
```
