import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { calculateLeaveQuota } from './utils/leave-quota.util';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(dto: CreateEmployeeDto) {
    const existing = await this.employeeRepository.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException(
        `An employee with email "${dto.email}" already exists`,
      );
    }

    const employee = this.employeeRepository.create(dto);
    const saved = await this.employeeRepository.save(employee);

    return this.attachLeaveQuota(saved);
  }

  async findAll(department?: string) {
    const where = department ? { department } : {};
    const employees = await this.employeeRepository.find({ where });
    return employees.map((employee) => this.attachLeaveQuota(employee));
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException(`Employee with id "${id}" not found`);
    }

    return this.attachLeaveQuota(employee);
  }

  private attachLeaveQuota(employee: Employee) {
    return {
      ...employee,
      leaveQuota: calculateLeaveQuota(employee.joiningDate),
    };
  }
}