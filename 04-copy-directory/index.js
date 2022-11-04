const fs = require('fs/promises');
const path = require('path');
const process = require('process');

async function copyFiles () {
  try {
    const files = await fs.readdir(path.join(__dirname, './files'), {withFileTypes: true});
    await fs.rm(path.join(__dirname,'files-copy'), {recursive:true, force:true });
    await fs.mkdir(path.join(__dirname,'files-copy'), {recursive:true});


    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(__dirname, './files', file.name);
        const destPath = path.join(__dirname, './files-copy', file.name);
        await fs.copyFile(filePath, destPath);
        }
     };  
  } catch (err) {
    process.stdout.write('Error: ', err.message + '\n');
  }
};

copyFiles();
