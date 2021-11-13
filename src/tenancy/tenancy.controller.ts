import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateTenantDto } from './dto/create-tenant.dto';
import { ReadTenantDto } from './dto/read-tenant.dto';
import { TenancyService } from './tenancy.service';

@Controller('tenants')
export class TenancyController {
  constructor(private readonly tenantService: TenancyService) {}

  @Get()
  findAll(): Promise<ReadTenantDto[]> {
    return this.tenantService.findAll();
  }

  @Post()
  create(@Body() tenant: CreateTenantDto): Promise<ReadTenantDto> {
    return this.tenantService.create(tenant);
  }
}
