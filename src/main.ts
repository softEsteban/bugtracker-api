import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Swagger settings
  const config = new DocumentBuilder()
    .setTitle('Mantis Bug Tracker')
    .setDescription('A Nestjs and MongoDB API for a bug tracker project')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha'
    },
    customSiteTitle: 'Bug Tracker API | Docs'
  });



  await app.listen(3000);
}
bootstrap();
