const Hapi = require("@hapi/hapi");
const appRoutes = require('./routes');

const startServer = async () => {
    const apiServer = Hapi.server({
        port: 9000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                credentials: true
            }
        },
    });

    apiServer.route(appRoutes);

    await apiServer.start();
    console.log(`Server berjalan pada ${apiServer.info.uri}`);
};

try {
    startServer();
} catch (err) {
    console.log(`Aplikasi error: ${err.message}`);
}