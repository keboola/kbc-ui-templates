var fs = require("fs");
var AWS = require('aws-sdk');
var _ = require("lodash");
var zlib = require('zlib');
var uuid = require('node-uuid');

AWS.config.region = 'us-east-1';

var s3bucket = process.argv[2];
var s3path = process.argv[3];
var version = process.env.KBC_UI_TEMPLATES_REVISION;

uploadResources("dist", version);

function uploadResources(dir, version) {
    list = fs.readdirSync(dir)
    if (!list) {
        return data;
    }
    list.forEach(function (file) {
        var fileKey = "";
        if (file == 'assets.json') {
            fileKey = s3path + "/" + file
        } else {
            fileKey = s3path + "/" + version + "/" + file
        }

        var body = fs.createReadStream(dir +  "/" + file).pipe(zlib.createGzip());
        var params = {
            Bucket: s3bucket,
            Key: fileKey
        };
        var s3obj = new AWS.S3({params: params, queueSize: 1});

        var uploadOptions = {
            Body: body,
            ACL: "public-read",
            ContentType: "text/json",
            ContentEncoding: "gzip"
        };

        s3obj.upload(uploadOptions).
            send(function(err, data) {
                if (err) {
                    throw "Cannot upload file " + fileKey + ": " + err;
                } else {
                    console.log("Uploaded", data.Location);
                }
            });
    });
}
