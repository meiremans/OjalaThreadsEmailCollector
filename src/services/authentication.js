var basicAuth = require('basic-auth');

exports.BasicAuthentication = function(request, response, next) {

    function unauthorized(response) {
        response.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return response.send(401);
    };

    var user = basicAuth(request);

    if (!user || !user.name || !user.pass) {
        return unauthorized(response);
    };

    if ((user.name === process.env.USERNAME && user.pass === process.env.PASSWORD)) {
        return next();
    } else {
        return unauthorized(response);
    };

};