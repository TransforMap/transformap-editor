var fixtures = require('./fixtures.js')

//hook and modify 'responseText' of 'example2.txt'
xhook.after(function(request, response) {

  if (request.method === "GET"){

    // /place/{uuid}/media
    if(request.url.match(".*?/place/(.*)/media")){
      response.status = 200;
      response.text = JSON.stringify(fixtures.listOfMediaFilesForPOI)
    }

    // /media/{uuid}
    if(request.url.match(".*?/media/(.*)")){
      response.status = 200;
      response.text = JSON.stringify(fixtures.mediaFileMetadataComplete)
    }

  }else if (request.method === "POST"){

    // /media
    if(request.url.match(".*?/media/")){
      response.status = 201;
      response.text = JSON.stringify(fixtures.mediaFileMetadataComplete)
    }

    // /place
    if(request.url.match(".*?/place/")){
      //TBD
    }

  }else if (request.method === "PUT"){

    // /media/{uuid}
    if(request.url.match(".*?/media/(.*)")){
      response.status = 200;
      response.text = JSON.stringify(fixtures.mediaFileMetadataComplete)
    }

    // /place/{uuid}
    if(request.url.match(".*?/place/(.*)")){
      response.status = 200;
      //TBD
    }

  }else if (request.method === "DELETE"){

    // /media/{uuid}
    if(request.url.match(".*?/media/(.*)")){
      response.status = 200;
      response.text = JSON.stringify(fixtures.mediaFileMetadataCompleteDeleted)
    }

    // /place/{uuid}
    if(request.url.match(".*?/place/(.*)")){
      response.status = 200;
      //TBD
    }
  }

})
