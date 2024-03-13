import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ToiletsModule } from './toilets/toilets.module';
import { RestroomsModule } from './restrooms/restrooms.module';
import { OrganizationsModule } from './organizations/organizations.module';
import typeorm from './database/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
      inject: [ConfigService],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
    AuthModule,
    UsersModule,
    ToiletsModule,
    RestroomsModule,
    OrganizationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
