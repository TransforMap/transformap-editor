# MMS API endpoints and responses

## createNewMediaFile

Uploads a new media file

**Endpoint**: /media/
**Request method**: POST (multi-part message)
**Payload**: A multipart message containing the JSON metadata and the blob. Both mandatory.

```
----------V2ymHFg03ehbqgZCaKO6jy
"POST: HTTP/1.0"
"user-agent: firefox"
"content-type: multipart/form-data; boundary=----------V2ymHFg03ehbqgZCaKO6jy"
"\r\n------------V2ymHFg03ehbqgZCaKO6jy\r\n"
"Content-Disposition: form-data; name=thefile; filename=thefile.jpg\r\n"
"Content-Type: image/jpg\r\n\r\n"
[Binary contents]
"\r\n------------V2ymHFg03ehbqgZCaKO6jy--\r\n"
"Content-Disposition: form-data; name=themetadata;\r\n"
"Content-Type: image/jpg\r\n\r\n"
{  
  "name": "some title",
  "description": "some description",
  "mimetype": "image.png",
  "url": "https://base.transformap.co/images/transformap.png"
}
```

**Expected response**: The complete metadata definition of the media file, including the URL of the asset.

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

Retrieves the metadata of a particular media file, not including versions

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

## updateMediaFile

Updates a particular media file

**Endpoint**: /media/{mediaId}
**Request method**: PUT (multi-part message)
**Payload**: A multipart message containing the JSON metadata and the blob. Both mandatory.

```
----------V2ymHFg03ehbqgZCaKO6jy
"POST: HTTP/1.0"
"user-agent: firefox"
"content-type: multipart/form-data; boundary=----------V2ymHFg03ehbqgZCaKO6jy"
"\r\n------------V2ymHFg03ehbqgZCaKO6jy\r\n"
"Content-Disposition: form-data; name=thefile; filename=thefile.jpg\r\n"
"Content-Type: image/jpg\r\n\r\n"
[Binary contents]
"\r\n------------V2ymHFg03ehbqgZCaKO6jy--\r\n"
"Content-Disposition: form-data; name=themetadata;\r\n"
"Content-Type: image/jpg\r\n\r\n"
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
