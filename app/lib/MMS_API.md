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
  "title": "some title",
  "description": "some description",
  "assetUrl": "https://someDomain/someImage.png",
  "versionDate": "2017-07-30T16:01:34+00:00"
  },
  {
  "mediaId": "211345a8-0e28-43ae-99a9-7300040c6399",
  "title": "some other title",
  "description": "some other description",
  "assetUrl": "https://someDomain/someImage.png",
  "versionDate": "2017-07-30T16:01:34+00:00"
  }
]
```

## createNewMediaFileForPOI

Creates a new media file for a certain POI

**Endpoint**: /place/{uuid}/media/
**Request method**: POST
**Payload**: A JSON string containing the metadata of the media file to create

```json 
{  
  "title": "some title",
  "description": "some description",
  "assetUrl": "https://someDomain/someImage.png"
}
```

**Expected response**: The complete metadata definition of the media file.

```json 
{
  "mediaId": "d07d6ab3-4e3f-44ce-accc-b3efc96b3f04",
  "status": "active",
  "title": "some title",
  "description": "some description",
  "assetUrl": "https://someDomain/someImage.png",
  "versionDate": "2017-07-30T16:01:34+00:00",
  "versions": []
}
```

## retrieveMetadataForMediaFile

Retrieves the metadata of a particular media file, including all versions

**Endpoint**: /place/{uuid}/media/{mediaId}
**Request method**: GET
**Payload**: No
**Expected response**: The complete metadata definition of the media file.

```json 
{
  "mediaId": "d07d6ab3-4e3f-44ce-accc-b3efc96b3f04",
  "status": "active",
  "title": "some title",
  "description": "some description",
  "assetUrl": "https://someDomain/someImage.png",
  "versionDate": "2017-07-30T16:01:34+00:00",
  "versions": [
    {
      "title": "previous title",
      "description": "some description",
      "assetUrl": "https://someDomain/someImage.png",
      "versionDate": "2017-06-30T16:01:34+00:00"
    }
  ]
}
```

## updateMedataForMediaFile

Updates the metadata of a particular media file

**Endpoint**: /place/{uuid}/media/{mediaId}
**Request method**: PUT
**Payload**: A JSON string containing the metadata of the media file to update with.

```json 
{  
  "title": "some new title",
  "description": "some new description",
  "assetUrl": "https://someDomain/someNewImage.png"
}
```

**Expected response**: The complete metadata definition of the media file.

```json 
{
  "mediaId": "d07d6ab3-4e3f-44ce-accc-b3efc96b3f04",
  "status": "active",
  "title": "some new title",
  "description": "some new description",
  "assetUrl": "https://someDomain/someNewImage.png",
  "versionDate": "2017-08-30T16:01:34+00:00",
  "versions": [
    {
      "title": "previous title",
      "description": "previous description",
      "assetUrl": "https://someDomain/someOtherImage.png",
      "versionDate": "2017-06-30T16:01:34+00:00"
    }
  ]
}
```

## deleteMediaFile

Deletes a media file moving it to a moderated trash

**Endpoint**: /place/{uuid}/media/{mediaId}
**Request method**: DELETE
**Payload**: No
**Expected response**: The complete metadata definition of the media file.

```json 
{
  "mediaId": "d07d6ab3-4e3f-44ce-accc-b3efc96b3f04",
  "status": "deleted",
  "title": "some new title",
  "description": "some new description",
  "assetUrl": "https://someDomain/someNewImage.png",
  "versionDate": "2017-08-30T16:01:34+00:00",
  "versions": [
    {
      "title": "previous title",
      "description": "previous description",
      "assetUrl": "https://someDomain/someOtherImage.png",
      "versionDate": "2017-06-30T16:01:34+00:00"
    }
  ]
}
```
