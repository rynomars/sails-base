module.exports = {
    models: {
        connection: 'localDiskDb',
        migrate: 'drop'
    },
    client: {
        domain: 'http://localhost:9000/'
    }
};
