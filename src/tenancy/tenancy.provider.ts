import { Provider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Connection, getConnection } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { Request } from 'express';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

/*
 * The porpuse of this provider is to use @Inject(TENANT_CONNECTION)
 * and get the TENANT_CONNECTION
 * */

export const TenantProvider: Provider = {
  provide: TENANT_CONNECTION,
  inject: [REQUEST, Connection],
  scope: Scope.REQUEST,
  useFactory: async (req: Request, connection: Connection) => {
    const name: string = req.params['tenant'];

    const tenant: Tenant = await connection
      .getRepository(Tenant)
      .findOne({ where: { name } });

    return getConnection(tenant.name);
  },
};
