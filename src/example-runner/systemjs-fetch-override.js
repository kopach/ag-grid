var mockedFiles = [];

var originalFetch = System.fetch;

System.fetch = function(metadata) {
    var requestedFile = metadata.name;

    var mockedFile = mockedFiles.find(function(mockedFile) {
        return requestedFile.endsWith(mockedFile.name);
    });

    if (mockedFile) {
        return mockedFile.content;
    } else {
        return originalFetch.apply(this, Array.prototype.slice.call(arguments));
    }
};

function registerMockedFile(file, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var content = file.transform ? file.transform(xhr.responseText) : xhr.responseText;

            mockedFiles.push({name: file.name, content: content});

            callback();
        }
    };

    xhr.open('GET', file.url, true);
    xhr.send(null);
}

function registerMockedFiles(files, callback) {
    function next() {
        if (!files.length) {
            callback();
        } else {
            registerMockedFile(files.shift(), next);
        }
    }

    next();
}
