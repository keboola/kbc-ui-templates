var fs = require("fs");
var rmdir = require('rmdir-recursive').sync;
var _ = require("lodash");

var resourcesFolder = process.argv[2];

resources = loadResources(resourcesFolder);
materializeResources(resources, "dist");

// Materialize files in build dir
function materializeResources(resources, dir) {
    rmdir(dir, false);
    fs.mkdirSync(dir);
    _.forEach(resources, function(resource, key) {
        console.log("Building", key);
        fs.writeFileSync(dir + "/" + key + ".json", JSON.stringify(resource));
    });
}

function loadResources(dir) {
    var resources = {};
    list = fs.readdirSync(dir);
    // load all directories in resources level
    list.forEach(function (file) {
        stat = fs.statSync(dir + '/' + file);
        if (stat.isDirectory()) {
            resources[file] = {};
            var fullPath = dir + '/' + file;
            var resourceName = file;
            resources[file] = addResource(fullPath, resourceName);
        }
    });
    return resources;
}


function addResource(path, name) {
    data =  {
        "schemas": addResourceItem(path, name, "schemas"),
        "templates": addResourceItem(path, name, "templates")
    };
    data.templates["params"] = addTemplates(path, name, "params");
    return data;
}

function addTemplates(path, name, templateType) {
    var data = [];
    if (!fs.existsSync(path + "/templates/" + templateType)) {
        return;
    }
    console.log("Loading", name, "templates", templateType);
    list = fs.readdirSync(path + "/templates/" + templateType)
    if (!list) {
        return data;
    }
    list.forEach(function (file) {
        // skip nonjson files
        if (file.substr(-5) != '.json') {
            return;
        }
        // skip meta files
        if (file.substr(-10) == '.meta.json') {
            return;
        }

        templateName = file.substr(0, file.length - 5);

        filePath = path + "/templates/" + templateType + "/" + file;
        metaFilePath = path + "/templates/" + templateType + "/" + templateName + ".meta.json";

        try {
            templateData = JSON.parse(fs.readFileSync(filePath, "utf8").trim());
            templateMeta = JSON.parse(fs.readFileSync(metaFilePath, "utf8").trim());
            templateMeta.params = templateData;
            data.push(templateMeta);
        } catch (e) {
            throw "Cannot parse " + filePath + ": " + e;
        }
    });
    return data;

}

function addResourceItem(path, name, resourceType) {
    var data = {};
    if (!fs.existsSync(path + "/" + resourceType)) {
        return data;
    }
    console.log("Loading", name, resourceType);
    // load all directories in resources level
    list = fs.readdirSync(path + "/" + resourceType)
    if (!list) {
        return data;
    }
    list.forEach(function (file) {
        if (file.substr(-5) != '.json') {
            return;
        }
        schemaName = file.substr(0, file.length - 5);

        filePath = path + "/" + resourceType + "/" + file;
        try {
            data[schemaName] = JSON.parse(fs.readFileSync(filePath, "utf8").trim());
        } catch (e) {
            throw "Cannot parse " + filePath + ": " + e;
        }
    });
    return data;
}


