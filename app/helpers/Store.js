const electron = require('electron');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
import Log from './Logger';

class Store
{
  constructor(db_name)
  {
      this.database_name = db_name;
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getAppPath();// getPath('documents');
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    // const userDataPath = electron.app;
    // const dir = path.join(userDataPath, '/bms-db/');
    mkdirp(userDataPath + '/data/', (err) =>
    {
      if(err)
      {
        return Log('error', err.message);
      }
      
      this.path = path.join(userDataPath + '/data/', db_name + '.json');
    });
    
    this.data = {};
    parseDataFile(this.path)
    .then(data => this.data=data)
    .catch(err => Log('error', err.message));
  }
  
  // This will just return the property on the `data` object
  get(key)
  {
    console.log('get from key: ', key);
    return this.data[key];
  }

  getAll()
  {
    console.log('get: ', this.database_name);
    return this.data[this.database_name];
  }
  
  // ...and this will set it
  set(key, val)
  {
    this.data[key] = val;
    // Wait, I thought using the node.js' synchronous APIs was bad form?
    // We're not writing a server so there's not nearly the same IO demand on the process
    // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
    // we might lose that data. Note that in a real app, we would try/catch this.
    fs.writeFileSync(this.path, JSON.stringify(this.data));
    Log('info', 'successfully persisted new record to local collection [' + this.database_name + '].');
    console.log('wrote ['+key+'] with data: ', val, ' \nto: ', this.path);
  }
}

const parseDataFile = (filePath) => new Promise((resolve, reject) =>
{
    console.log('attempting to read file from local fs');
    // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
    // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    // const data = fs.readFileSync(filePath);
    fs.readFile(filePath, (err, data) =>
    {
        if(err)
        {
            return reject(err);
        }
        console.log('>>>>>>fs data: ', data);
        return resolve(JSON.parse(data));
    });
});

// expose the class
export default Store;