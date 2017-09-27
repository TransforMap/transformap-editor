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

## getPOI

Gets the metadata of a certain POI

**Endpoint**: /place/{uuid}
**Request method**: GET
**Payload**: A JSON string containing the metadata of the POI

```json
{
  "type":"Feature",
  "properties":{
    "name":"Bulgarian Food Bank",
    "addr:country":"BG",
    "addr:street":"бул. Васил Левски",
    "addr:housenumber":"106",
    "addr:postcode":"1000",
    "addr:city":"София",
    "POI_TYPE":"food bank",
    "amenity":"social_facility",
    "description:bg":"Организацията работи като свързващо звено между хранителната индустрия и социалните организации, за да увеличи многократно достъпа до хранително подпомагане в България. Тя създава системи за сигурност и контрол на храните, които постъпват като дарения.",
    "website":"http://bgfoodbank.org",
    "contact:email":"contact@bgfoodbank.org",
    "organic":"no",
    "fair-trade":"no",
    "regional":"yes",
    "free_keywords":"food bank;food waste",
    "SSEDAS_PARTNER":"BILS",
    "description":"The organisation acts as an interface between the food industry and social welfare organisations to increase access to food aid in Bulgaria. It sets up routines for guaranteeing that donated food is safe and properly managed.",
    "type_of_initiative":"foodbank; recycling_foodwaste",
    "contact:phone":"+3592 953 4100",
    "social_facility":"food_bank",
    "media_files": "6abf3336-4441-458f-a24f-ed76f7f53533; e59ade98-5e41-4455-ab78-d3ccf040ef2e"
  },
  "geometry":{
    "type":"Point",
    "coordinates":[23.33513259888,42.69809702239]
  },
  "_id":"2c10b95ea433712f0b06a3f7d310e7d5"
}
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
