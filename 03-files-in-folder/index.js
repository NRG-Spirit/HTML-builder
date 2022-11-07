const fs = require('fs/promises');
const path = require('path');
const process = require('process');

async function getFiles () {
  try {
    const files = await fs.readdir(path.join(__dirname, './secret-folder'), {withFileTypes: true});
      for (const file of files) {
        if (file.isFile()) {
          let filePath = path.join(__dirname, './secret-folder', file.name);
          let ext = path.extname(filePath);
          let name = file.name.replace(ext, '');
          let size = (await fs.stat(filePath)).size;
          process.stdout.write(name + ' - ' + ext.slice(1) + ' - ' + size + 'b' + '\n');
        }
     }; 
  } catch (err) {
    process.stdout.write('Error: ' + err.message + '\n');
  }
};

getFiles();