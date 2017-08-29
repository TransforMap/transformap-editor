# MMS API endpoints and responses

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

## createNewMediaFileForPOI

Uploads a new media file

**Endpoint**: /media/
**Request method**: POST
**Payload**: A JSON string containing the metadata of the media file to create

```json
{  
  "name": "some title",
  "description": "some description",
  "mimetype": "image.png",
  "url": "https://base.transformap.co/images/transformap.png"
}
```

**Expected response**: The complete metadata definition of the media file.

```json
{
  "mediaId": "0a6afb5c-70b1-40f7-8f46-8dd7e0d94060",
  "name": "some title",
  "description": "some description",
  "mimetype": "image.png",
  "assignedTo": [],
  "url": "https://base.transformap.co/images/transformap.png",
  "versionDate": "2017-07-30T16:01:34+00:00"
}
```

## retrieveMetadataForMediaFile

Retrieves the metadata of a particular media file, including all versions

**Endpoint**: /media/{mediaId}
**Request method**: GET
**Payload**: No
**Expected response**: The complete metadata definition of the media file.

```json
{
  "mediaId": "0a6afb5c-70b1-40f7-8f46-8dd7e0d94060",
  "name": "some title",
  "description": "some description",
  "mimetype": "image.png",
  "assignedTo": ["0a6afb5c-70b1-40f7-8f46-8dd7e0d94060"],
  "url": "https://base.transformap.co/images/transformap.png",
  "versionDate": "2017-07-30T16:01:34+00:00"
}
```

## updateMedataForMediaFile

Updates the metadata of a particular media file

**Endpoint**: /media/{mediaId}
**Request method**: PUT
**Payload**: A JSON string containing the metadata of the media file to update with.

```json
{  
  "name": "some new title"
}
```

**Expected response**: The complete metadata definition of the media file.

```json
{
  "mediaId": "0a6afb5c-70b1-40f7-8f46-8dd7e0d94060",
  "name": "some new title",
  "description": "some description",
  "mimetype": "image.png",
  "url": "https://base.transformap.co/images/transformap.png",
  "versionDate": "2017-07-30T16:01:34+00:00"
}
```

## deleteMediaFile

Deletes a media file moving it to a moderated trash

**Endpoint**: /media/{mediaId}
**Request method**: DELETE
**Payload**: No
**Expected response**: The complete metadata definition of the media file.

```json
{
  "mediaId": "d07d6ab3-4e3f-44ce-accc-b3efc96b3f04",
  "deleted": true,
  "name": "some new title",
  "assignedTo": ["0a6afb5c-70b1-40f7-8f46-8dd7e0d94060"],
  "description": "some new description",
  "mimetype": "image.png",
  "url": "https://base.transformap.co/images/transformap.png",
  "versionDate": "2017-07-30T16:01:34+00:00"
}
```

## retrieveJournaledMediaFilesForPOI

TBD
