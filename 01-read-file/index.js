const fs = require('fs');
const path = require('path');
 
let stream = new fs.ReadStream(path.join(__dirname, 'text.txt'), {encoding: 'utf8'});
let data = '';

stream.on('readable', function() {
  let chunk = stream.read();
  if (chunk != null) {
    data += chunk;
  }
});

stream.on('end', function(){
  console.log(data)
});

stream.on('error', error => {
  console.log('Error: ' + error.message)
});