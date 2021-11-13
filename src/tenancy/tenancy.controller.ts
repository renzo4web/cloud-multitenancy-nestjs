import { Body, Controller, Get, Inject, Post } from '@nestjs/common';

import { CreateTenantDto } from './dto/create-tenant.dto';
import { ReadTenantDto } from './dto/read-tenant.dto';
import { TenancyService } from './tenancy.service';

@Controller('tenancy')
export class TenancyController {
  @Inject()
  private readonly tenantService: TenancyService;

  @Get()
  findAll(): Promise<ReadTenantDto[]> {
    return this.tenantService.findAll();
  }

  @Post()
  create(@Body() tenant: CreateTenantDto): Promise<ReadTenantDto> {
    return this.tenantService.create(tenant);
  }
}
