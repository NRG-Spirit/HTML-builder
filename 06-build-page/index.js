const readdir = require('fs/promises');
const fsp = require('fs/promises');
const path = require('path');
const process = require('process');
const fs = require('fs');

async function buildPage () {

      /*----- create dir -----*/
  await fsp.rm(path.join(__dirname,'project-dist'), {recursive:true, force:true });
  await fsp.mkdir(path.join(__dirname,'project-dist'), {recursive:true}); 
  
  /*----- css -----*/
  try { 
    const files = await fsp.readdir(path.join(__dirname, './styles'), {withFileTypes: true});
    const styles = fs.WriteStream(path.join(__dirname, 'project-dist', 'style.css'));
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(__dirname, './styles', file.name);
        const ext = path.extname(filePath);
        if (ext === '.css') {
          const stream = new fs.ReadStream(path.join(__dirname, './styles', file.name));
          stream.pipe(styles);
        }
      }
    };
  } catch (err) {
    process.stdout.write('Error: ' + err.message + '\n'); 
  };   

  /*----- html -----*/
  try { 
    const templateReadstream = new fs.ReadStream(path.join(__dirname, 'template.html'), { encoding: 'utf-8' });
    const componentsList = await fsp.readdir(path.join(__dirname, './components'), { withFileTypes: true });

    templateReadstream.on('data', (chunk) => {
       for (const file of componentsList) {
        const componentPath = path.join(__dirname, './components', file.name);
        const ext = path.extname(componentPath);
        if (ext === '.html') {
          const componentName = path.parse(componentPath).name;
          const componentReadStream = new fs.ReadStream(componentPath, { encoding: 'utf-8' });
          const HTMLWriteStream = fs.WriteStream(path.join(__dirname, 'project-dist', 'index.html'));
          componentReadStream.on('data', (cont) => {
            chunk = chunk.replaceAll(`{{${componentName}}}`, cont); 
            HTMLWriteStream.write(chunk);  
          });
        }
      }
    });
  } catch (err) {
    process.stdout.write('Error: ' + err.message + '\n'); 
  };   

  /*----- assets -----*/
  let src = path.join(__dirname, 'assets');
  let dest = path.join(__dirname, 'project-dist', 'assets');

  const copyAssets = async (src, dest) => {
    try {
      await fsp.mkdir(dest, {recursive:true});
      const assets = await fsp.readdir(src, {withFileTypes: true});
      for (const asset of assets) {
        const srcPath = path.join(src, asset.name);
        const destPath = path.join(dest, asset.name);
        if (asset.isFile()) {
          await fsp.copyFile(srcPath, destPath);
        } else {
          copyAssets(srcPath, destPath);
        }
      }; 
    }
    catch (err) {
      process.stdout.write('Error: ' + err.message + '\n');
    };
  };

  copyAssets(src, dest);
};

buildPage();