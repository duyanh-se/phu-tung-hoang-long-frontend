// Optional bootstrap from a local NestJS build. Never starts its services or DB.
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

async function main() {
  const backend = resolve(process.argv[2] || "../phu-tung-hoang-long-backend");
  const backendRequire = createRequire(resolve(backend, "package.json"));
  backendRequire("reflect-metadata");
  const { Module } = backendRequire("@nestjs/common");
  const { NestFactory } = backendRequire("@nestjs/core");
  const { SwaggerModule, DocumentBuilder } = backendRequire("@nestjs/swagger");
  const files = [
    "app",
    "auth/auth",
    "categories/categories",
    "contact-requests/contact-requests",
    "manufacturers/manufacturers",
    "products/products",
    "uploads/uploads",
    "users/users",
  ];
  const controllers = files.flatMap((file) =>
    Object.values(
      backendRequire(resolve(backend, `dist/${file}.controller.js`)),
    ),
  );
  const tokens = new Set(
    controllers.flatMap(
      (controller) =>
        Reflect.getMetadata("design:paramtypes", controller) || [],
    ),
  );
  class SchemaModule {}
  Module({
    controllers,
    providers: [...tokens].map((provide) => ({ provide, useValue: {} })),
  })(SchemaModule);
  const app = await NestFactory.create(SchemaModule, {
    logger: false,
    abortOnError: false,
  });
  try {
    app.setGlobalPrefix("api/v1");
    const schema = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle("Phụ Tùng Hoàng Long API")
        .setVersion("1.0.0")
        .addBearerAuth()
        .build(),
    );
    schema["x-schema-source"] =
      "Offline snapshot from local backend dist; refresh with npm run api:generate when backend is available.";
    mkdirSync("openapi", { recursive: true });
    writeFileSync(
      "openapi/schema.json",
      JSON.stringify(schema, null, 2) + "\n",
    );
    console.log(
      `Exported ${Object.keys(schema.paths).length} paths from local backend build (no server/database started).`,
    );
  } finally {
    await app.close();
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
