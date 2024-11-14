const Hapi = require("@hapi/hapi");
const routes = require('./routes');

const initializeServer = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                credentials: true,
            },
        },
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

try {
    initializeServer();
} catch (error) {
    console.error("Aplikasi error: " + error.message);
}