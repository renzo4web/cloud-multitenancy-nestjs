import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { ReadTenantDto } from './dto/read-tenant.dto';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenancyService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async findAll(): Promise<ReadTenantDto[]> {
    const tenants = await this.tenantRepository.find();

    return tenants.map((tenant) => plainToClass(ReadTenantDto, tenant));
  }

  async findOne(name: string): Promise<ReadTenantDto> {
    return await this.tenantRepository.findOne({ name });
  }

  async create(tenant: CreateTenantDto): Promise<ReadTenantDto> {
    const createdTenant = await this.tenantRepository.save(tenant);

    return plainToClass(ReadTenantDto, createdTenant);
  }
}
