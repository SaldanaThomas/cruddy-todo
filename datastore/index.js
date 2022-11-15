const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var toDoFile = path.join(exports.dataDir, id + '.txt');
    fs.writeFile(toDoFile, text, (err) => {
      if (err) {
        throw ('error writing counter');
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  let storage = [];
  fs.readdir(exports.dataDir, (err, items) => {
    items.forEach( (item) => {
      let id = item.slice(0, -4);
      storage.push({'id': id, 'text': id});
    });
    callback(null, storage);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', 'utf8', (err, data) => {
    if (!data) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {'id': id, 'text': data});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, {'id': id, 'text': text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(exports.dataDir + '/' + id + '.txt', (err) => {
    if (err) {
      // report an error if item not found
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
