var fs = require("fs");
var AWS = require('aws-sdk');
var _ = require("lodash");
var zlib = require('zlib');
var uuid = require('node-uuid');


var s3bucket = process.argv[2];
var s3path = process.argv[3];
var version = process.env.KBC_UI_TEMPLATES_REVISION;

buildAssetsFile("dist", version);

function buildAssetsFile(dir, version) {
    var assets = {};
    list = fs.readdirSync(dir)
    if (!list) {
        return data;
    }
    list.forEach(function (file) {
        if (file != 'assets.json') {
            var key = file.substr(0, file.length - 5);
            assets[key] = "https://s3.amazonaws.com/" + s3bucket + "/" + s3path + "/" + version + "/" + file;
        }
    });
    console.log("Writing assets file", dir + "/assets.json");
    fs.writeFileSync(dir + "/assets.json", JSON.stringify(assets));
}

