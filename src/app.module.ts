import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './module-users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UtilitiesModule } from './module-utilities/utilities.module';
import { AuthModule } from './module-auth/auth.module';
import { DomainsModule } from './module-domains/domains.module';
import { ProjectsModule } from './module-projects/projects.module';
import { ChatgptModule } from './module-chatgpt/chatgpt.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: ['dist/**/*.entity{,ts,.js}'],
        autoLoadEntities: true,
        synchronize: false,
        retryDelay: 3000,
        retryAttempts: 10
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    UtilitiesModule,
    AuthModule,
    DomainsModule,
    ProjectsModule,
    ChatgptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
