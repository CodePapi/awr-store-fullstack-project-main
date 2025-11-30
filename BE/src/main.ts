import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastify from 'fastify';
import { patchNestJsSwagger } from 'nestjs-zod';
import { AppModule } from 'src/modules/app/app.module';
import packageJson from '../package.json';
import { GenericOperationResponse } from './common/schemas/generic-operation-response.schema';

patchNestJsSwagger();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastify()),
  );
  app.enableCors({
    origin: 'http://localhost:5173', //in the real world, I would add this into the .env
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle(packageJson.name)
    .build();
  const swaggerDocumentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig, {
      extraModels: [GenericOperationResponse],
    });
  SwaggerModule.setup('api', app, swaggerDocumentFactory);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
