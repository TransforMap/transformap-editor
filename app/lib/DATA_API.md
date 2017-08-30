# DATA API endpoints and responses

## createPOI

Creates a POI with the data passed as parameter

**Endpoint**: /place/
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

## retrieveMediaFilesForPOI

Retrieves the list of media files associated with a POI

**Endpoint**: /place/{uuid}/media/
**Request method**: GET
**Payload**: No
**Expected response**: A JSON string containing an array of media file metadata. Each object will contain the currently active version of the media file's metadata, if available.

```json
[
  {
    "mediaId": "d07d6ab3-4e3f-44ce-accc-b3efc96b3f04",
    "ipfs": "QmVXmy59f5QqKDGyhpHbRiGnba5SfHaooDPCWhd8Xtgwz2",
    "mimetype": "image/jpeg",
    "name": "Chaotic connectome replacement image for the large image on the main screen",
    "description": "some description",
    "versionDate": "2017-07-30T16:01:34+00:00"
  },
  {
    "mediaId": "0a6afb5c-70b1-40f7-8f46-8dd7e0d94060",
    "mimetype": "image.png",
    "name": "Transformap Base",
    "url": "https://base.transformap.co/images/transformap.png",
    "versionDate": "2017-07-30T16:01:34+00:00"
  }
]
```
