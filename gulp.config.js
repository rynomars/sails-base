module.exports = function(){
    var api = './api/';

    var config = {
        js: [
            api + '**/*.js',
            '!' + api + '/responses/**'
            ]  
    };
    return config;
};
