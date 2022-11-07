const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');
const process = require('process');

async function getBundle () {
  try {
    const files = await readdir(path.join(__dirname, './styles'), {withFileTypes: true});
    const bundle = fs.WriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
    for (const file of files) {
        if (file.isFile()) {
          let filePath = path.join(__dirname, './styles', file.name);
          let ext = path.extname(filePath);
          if (ext === '.css') {
            let stream = new fs.ReadStream(path.join(__dirname, './styles', file.name));
            stream.pipe(bundle);
          }
        }
     }; 
  } catch (err) {
    process.stdout.write('Error: ' + err.message + '\n');
  }
};

getBundle();