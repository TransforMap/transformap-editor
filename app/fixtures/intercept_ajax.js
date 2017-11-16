var fixtures = require('./fixtures.js')

xhook.after(function(request, response) {

  if (request.method === "GET"){

    // /place/{uuid}
    if(request.url.match(".*?/place/(.*)")){
      response.status = 200;
      response.text = JSON.stringify(fixtures.placeMetadata);
    }

    // /place/{uuid}/media
    if(request.url.match(".*?/place/(.*)/media")){
      response.status = 200;
      response.text = JSON.stringify(fixtures.listOfMediaFilesForPOI);
    }

    // /media/{uuid}
    if(request.url.match(".*?/media/(.*)")){
      response.status = 200;
      response.text = JSON.stringify(fixtures.mediaFileMetadataComplete);
    }

    // /media/{uuid}/versions
    if(request.url.match(".*?/media/(.*)/versions")){
      response.status = 200;
      response.text = JSON.stringify(fixtures.listOfMediaFileVersions);
    }

    // /auth/
    if(request.url.match(".*?/auth/")){
      response.status = 200;
      utils.setCookie("connect.sid","123456789");
    }

    // /users/{userId}
    if(request.url.match(".*?/users/(.*)")){
      response.status = 200;
      response.text = JSON.stringify(fixtures.user);
    }

  }else if (request.method === "POST"){

    // /media
    if(request.url.match(".*?/media/")){
      response.status = 201;
      response.text = JSON.stringify(fixtures.mediaFileMetadataComplete);
    }

    // /media
    if(request.url.match(".*?/media/(.*)/versions")){
      response.status = 201;
      response.text = JSON.stringify(fixtures.listOfMediaFileVersionsUpdate);
    }

    // /place
    if(request.url.match(".*?/place/")){
      //TBD
    }

  }else if (request.method === "PUT"){

    // /media/{uuid}
    if(request.url.match(".*?/media/(.*)")){
      response.status = 200;
      response.text = JSON.stringify(fixtures.mediaFileMetadataComplete);
    }

    // /place/{uuid}
    if(request.url.match(".*?/place/(.*)")){
      response.status = 200;
      //TBD
    }

    // /users/{userId}
    if(request.url.match(".*?/users/(.*)")){
      response.status = 200;
      response.text = JSON.stringify(fixtures.user);
    }

  }else if (request.method === "DELETE"){

    // /place/{uuid}
    if(request.url.match(".*?/place/(.*)")){
      response.status = 200;
      //TBD
    }

    // /media/{uuid}
    if(request.url.match(".*?/place/(.*)/media/(.*)")){
      response.status = 200;
      response.text = JSON.stringify(fixtures.placeMetadata);
    }

    // /auth/{token}
    if(request.url.match(".*?/auth/(.*)")){
      response.status = 200;
    }
  }

});
