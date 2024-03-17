import { Module } from '@nestjs/common';
import { EmployeeAccessService } from './employee-access.service';
import { Organization } from 'src/organizations/entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { LocalEmployeeAuthGuard } from './guards/local-employee-auth.guard';
import { LocalEmployeeStrategy } from './strategies/local-employee.strategy';
import { EmployeeAccessController } from './employee-access.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtEmployeeStrategy } from './strategies/jwt-employee.strategy';
import { JwtEmployeeAuthGuard } from './guards/jwt-employee-auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_EMPLOYEE_SECRET'),
          signOptions: { expiresIn: '24h' },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Organization]),
  ],
  providers: [
    EmployeeAccessService,
    LocalEmployeeStrategy,
    LocalEmployeeAuthGuard,
    JwtEmployeeStrategy,
    JwtEmployeeAuthGuard,
  ],
  controllers: [EmployeeAccessController],
})
export class EmployeeAccessModule {}
