import {
  Module,
  MiddlewareConsumer,
  BadRequestException,
  RequestMethod,
} from '@nestjs/common';
import { TenancyService } from './tenancy.service';
import { TenancyController } from './tenancy.controller';
import { Tenant } from './entities/tenant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, getConnection, createConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request } from 'express';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenancyService],
  controllers: [TenancyController],
})
export class TenancyModule {
  // middleware
  //
  constructor(
    private readonly connection: Connection,
    private readonly configService: ConfigService,
    private readonly tenantService: TenancyService,
  ) {}

  /*
   * this is use for validate a request for tenant  if the
   * tenant exist the middleware pass, if not a new connection is created
   *
   *
   *
   *
   * */

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(async (req: Request, _res: Response, next: NextFunction) => {
        //  app.setGlobalPrefix(':tenant?/api')
        const name: string = req.params['tenant'];
        const tenant: Tenant = await this.tenantService.findOne(name);

        if (!tenant) {
          throw new BadRequestException(
            'Database Connection Error',
            'This tenant does not exists',
          );
        }

        try {
          getConnection(tenant.name);
          next();
        } catch (e) {
          /*
           * if tenant does not exist, created a new tenant
           * */

          await this.connection.query(
            `CREATE DATABASE IF NOT EXISTS ${tenant.name}`,
          );

          const createdConnection: Connection = await createConnection({
            name: tenant.name, // this use Typeorm no query a tenant with a name
            type: 'mysql',
            host: this.configService.get('DB_HOST'),
            port: +this.configService.get('DB_PORT'),
            username: this.configService.get('DB_USER'),
            password: this.configService.get('DB_PASSWORD'),
            database: tenant.name,
            entities: [], // TODO: add User entity
            ssl: true,
            synchronize: true,
          });

          if (createdConnection) {
            next();
          } else {
            throw new BadRequestException(
              'Database Connection Error',
              'There is a Error with the Database!',
            );
          }
        }
      })
      .exclude({ path: '/api/tenants', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
