import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { TenancyModule } from './tenancy/tenancy.module';

@Module({
  imports: [
    TenancyModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      async useFactory(config: ConfigService) {
        return {
          type: 'mysql',
          host: config.get('DB_HOST'),
          username: config.get('DB_USER'),
          password: config.get('DB_PASSWORD'),
          port: +config.get('DB_PORT'),
          database: config.get('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true, // ONLY ON DEVELOPMENT
          ssl: true,
        } as ConnectionOptions;
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
