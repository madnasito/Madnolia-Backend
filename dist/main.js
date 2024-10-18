"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const port = process.env.PORT || 3000;
console.log(`Launching NestJS app on port ${port}, URL: http://0.0.0.0:${port}`);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map