var fs = require("fs");
var rmdir = require('rmdir-recursive').sync;
var _ = require("lodash");

var resourcesFolder = process.argv[2];

var resources = loadResources(resourcesFolder);
var sharedDefinitions = loadSharedDefinitions(resourcesFolder + "/default/shared");

materializeResources(resources, sharedDefinitions, "dist");

// Load shared definitions
function loadSharedDefinitions(dir) {
    var shared = {};
    var list = fs.readdirSync(dir);
    // load all directories in resources level
    list.forEach(function (file) {
        var stat = fs.statSync(dir + '/' + file);
        if (stat.isFile()) {
            var name = file.substr(0, file.length - 5);
            shared[name] = {};
            console.log("Loading shared definition " + name);
            var definitions = loadJSONFile(dir + '/' + file);
            var keys = Object.keys(definitions);
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == 'definitions') {
                    throw new Error('Remote definitions not supported')
                }
                shared[name][keys[i]] = definitions[keys[i]];
            }

        }
    });
    return shared;
}

// Materialize files in build dir
function materializeResources(resources, sharedDefinitions, dir) {
    rmdir(dir, false);
    fs.mkdirSync(dir);
    _.forEach(resources, function(resource, key) {
        console.log("Building", key);

        // add shared definitions
        var sharedDefinitionKeys = Object.keys(sharedDefinitions);
        if (!resource.schemas.params) {
            resource.schemas.params = {};
        }
        if (!resource.schemas.params.definitions) {
            resource.schemas.params.definitions = {};
        }
        
        if (!resource.schemas.api) {
            resource.schemas.api = {};
        }
        if (!resource.schemas.api || !resource.schemas.api.definitions) {
            resource.schemas.api.definitions = {};
        }

        // Inject shared definitions into params and api
        for (var i = 0; i < sharedDefinitionKeys.length; i++) {
            if (resource.schemas.params.definitions[sharedDefinitionKeys[i]]) {
                throw "Shared definition " + sharedDefinitionKeys[i] + " already found in `params` " + key;
            } else {
                resource.schemas.params.definitions[sharedDefinitionKeys[i]] = sharedDefinitions[sharedDefinitionKeys[i]];
            }
            if (resource.schemas.api.definitions[sharedDefinitionKeys[i]]) {
                throw "Shared definition " + sharedDefinitionKeys[i] + " already found in `api` " + key;
            } else {
                resource.schemas.api.definitions[sharedDefinitionKeys[i]] = sharedDefinitions[sharedDefinitionKeys[i]];
            }
        }

        // replace absolute references
        var re = /("\$ref":")[^#][^"]*\/([^/]+).json/g;
        var stringified = JSON.stringify(resource);
        if (stringified.match(re)) {
            stringified = stringified.replace(re, '$1#/definitions/$2');
            // test replaced JSON
            JSON.parse(stringified);
        }
        fs.writeFileSync(dir + "/" + key + ".json", stringified);
    });
}

function loadResources(dir) {
    var resources = {};
    var list = fs.readdirSync(dir);
    // load all directories in resources level
    list.forEach(function (file) {
        var stat = fs.statSync(dir + '/' + file);
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
    var data =  {
        "schemas": addResourceItem(path, name, "schemas"),
        "templates": addResourceItem(path, name, "templates")
    };
    data.templates["jobs"] = addTemplates(path, name, "jobs");
    return data;
}

function addTemplates(path, name, templateType) {
    var data = [];
    if (!fs.existsSync(path + "/templates/" + templateType)) {
        return;
    }
    console.log("Loading", name, "templates", templateType);
    var list = fs.readdirSync(path + "/templates/" + templateType)
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

        var templateName = file.substr(0, file.length - 5);

        var filePath = path + "/templates/" + templateType + "/" + file;
        var metaFilePath = path + "/templates/" + templateType + "/" + templateName + ".meta.json";


        var templateData = loadJSONFile(filePath);
        var templateMeta = loadJSONFile(metaFilePath);
        templateMeta.jobs = templateData;

        try {
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
    var list = fs.readdirSync(path + "/" + resourceType)
    if (!list) {
        return data;
    }
    list.forEach(function (file) {
        if (file.substr(-5) != '.json') {
            return;
        }
        var schemaName = file.substr(0, file.length - 5);
        var filePath = path + "/" + resourceType + "/" + file;
        data[schemaName] = loadJSONFile(filePath);
    });
    return data;
}

function loadJSONFile(file) {
    if (file.substr(-5) != '.json') {
        throw file + " not a JSON file";
    }
    try {
        return JSON.parse(fs.readFileSync(file, "utf8").trim());
    } catch (e) {
        throw Error("Cannot parse " + file + ": " + e);
    }
}


