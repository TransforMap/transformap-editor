# MMS API endpoints and responses

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

## retrieveMediaFileVersions

Returns an array with all the versions of a certain media file

**Endpoint**: /media/{mediaId}/versions
**Request method**: GET
**Payload**: No
**Expected response**: The complete metadata definition of the media file's versions.

```json
[
  {
    "mediaId": "497123c0-f9d8-4e6c-acff-76ec9efcb265",
    "name": "other version of the same file",
    "versionDate": "2017-07-30T16:01:34+00:00",
    "assignedTo": ["0a6afb5c-70b1-40f7-8f46-8dd7e0d94060"],
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  },
  {
    "mediaId": "c29c8d11-ec27-4fe1-9a23-dd10a3b37e11",
    "name": "yet another version",
    "versionDate": "2017-07-30T16:01:34+00:00",
    "assignedTo": ["0a6afb5c-70b1-40f7-8f46-8dd7e0d94060"],
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  }
]
```

## addMediaFileVersion

Adds a new version to an existing media file

**Endpoint**: /media/{mediaId}/versions
**Request method**: POST
**Payload**: yes

```json
[
  {
    "name": "other version of the same file",
    "description": "a new description for the same file",
    "versionDate": "2017-07-30T16:01:34+00:00",
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  }
]
```

**Expected response**: The complete metadata definition of the media file's versions.

```json
[
  {
    "name": "other version of the same file",
    "description": "a new description for the same file",
    "versionDate": "2017-07-30T16:01:34+00:00",
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  },
  {
    "mediaId": "497123c0-f9d8-4e6c-acff-76ec9efcb265",
    "name": "a previous version of the same file",
    "versionDate": "2017-07-30T16:01:34+00:00",
    "assignedTo": ["0a6afb5c-70b1-40f7-8f46-8dd7e0d94060"],
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  },
  {
    "mediaId": "c29c8d11-ec27-4fe1-9a23-dd10a3b37e11",
    "name": "yet another previous version",
    "versionDate": "2017-07-30T16:01:34+00:00",
    "assignedTo": ["0a6afb5c-70b1-40f7-8f46-8dd7e0d94060"],
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  }
]
```
