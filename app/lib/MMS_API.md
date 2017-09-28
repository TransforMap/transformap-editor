# MMS API endpoints and responses

## createNewMediaFile

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
  "url": "https://base.transformap.co/images/transformap.png",
  "version_date": "2017-07-30T16:01:34+00:00"
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
  "url": "https://base.transformap.co/images/transformap.png",
  "version_date": "2017-07-30T16:01:34+00:00"
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
  "version_date": "2017-07-30T16:01:34+00:00"
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
    "version_date": "2017-07-30T16:01:34+00:00",
    "active": true,
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png",
    "author": "alex"
  },
  {
    "mediaId": "c29c8d11-ec27-4fe1-9a23-dd10a3b37e11",
    "name": "yet another version",
    "version_date": "2017-07-30T16:01:34+00:00",
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png",
    "author": "jenny"
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
    "version_date": "2017-07-30T16:01:34+00:00",
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
    "version_date": "2017-07-30T16:01:34+00:00",
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  },
  {
    "mediaId": "497123c0-f9d8-4e6c-acff-76ec9efcb265",
    "name": "a previous version of the same file",
    "version_date": "2017-07-30T16:01:34+00:00",
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  },
  {
    "mediaId": "c29c8d11-ec27-4fe1-9a23-dd10a3b37e11",
    "name": "yet another previous version",
    "version_date": "2017-07-30T16:01:34+00:00",
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  }
]
```

## setActiveMediaFileVersion

Sets a version as currently active

**Endpoint**: /media/{mediaId}/versions/{versionId}
**Request method**: POST
**Payload**: no
**Expected response**: The complete metadata definition of the media file's versions.

```json
[
  {
    "name": "other version of the same file",
    "description": "a new description for the same file",
    "version_date": "2017-07-30T16:01:34+00:00",
    "active": true,
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  },
  {
    "mediaId": "497123c0-f9d8-4e6c-acff-76ec9efcb265",
    "name": "a previous version of the same file",
    "version_date": "2017-07-30T16:01:34+00:00",
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  },
  {
    "mediaId": "c29c8d11-ec27-4fe1-9a23-dd10a3b37e11",
    "name": "yet another previous version",
    "version_date": "2017-07-30T16:01:34+00:00",
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  }
]
```

## uploadBlob

Uploads an asset's binary blob to the MMS

**Endpoint**: /media/{mediaId}/blob
**Request method**: POST
**Payload**: The multipart binary contents of the asset

```
----------V2ymHFg03ehbqgZCaKO6jy
"POST: HTTP/1.0"
"user-agent: firefox"
"content-type: multipart/form-data; boundary=----------V2ymHFg03ehbqgZCaKO6jy"
"\r\n------------V2ymHFg03ehbqgZCaKO6jy\r\n"
"Content-Disposition: form-data; name=thefile; filename=thefile.gif\r\n"
"Content-Type: image/gif\r\n\r\n"
[Binary contents]
"\r\n------------V2ymHFg03ehbqgZCaKO6jy--\r\n"
```

**Expected response**: The url and mimetype of the uploaded file

```json
[
  {
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  }
]
```