const got = require('got')
const ibb_api = `https://data.ibb.gov.tr/`
const fs = require('fs').promises

;(async () => {
  var cont = true
  var next = null
  var locations = []

  while (cont === true) {
    var p = '/api/3/action/datastore_search?resource_id=c3eb0d72-1ce4-4983-a3a8-6b0b4b19fcb9'
    if (next !== null) {
      p = next
    }

    console.log('Request ', `${ibb_api}${p}`)
    let { body } = await got(`${ibb_api}${p}`)

    
    if (body) {
        body = JSON.parse(body)
      if (body.success && body.result.records.length > 0) { 
        locations = [...locations, ...body.result.records]
        next = body.result._links.next
        console.log('Next ', next)
        cont = true
      } else {
        cont = false
      }
    } else {
      cont = false
    }
  }

  
  await  fs.writeFile('./data/locations.json', JSON.stringify(locations, null, 2))
  console.log(`ibb'de ${locations.length} park alanı bulunmakta`)
  
})()