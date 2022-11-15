import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './module-users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  // MongooseModule.forRoot(process.env.MONGO_CONNECTION)
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_CONNECTION')
      })
    }),
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
