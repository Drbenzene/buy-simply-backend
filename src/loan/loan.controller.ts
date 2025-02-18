import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { PageOptionsDto } from 'utils/pagination/pageOptionsDto.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedStaff } from 'src/auth/decorators/current-user.decorator';
import { StaffAccount } from 'utils/types';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Roles as Role } from 'utils/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('loans')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Get('')
  async getLoans(
    @Query() pageOptionsDto: PageOptionsDto,
    @AuthenticatedStaff() staff: StaffAccount,
  ) {
    console.log('Staff:', staff);
    return this.loanService.getLoans(staff.id, pageOptionsDto);
  }

  @Get('/expired')
  async getExpiredLoans() {
    return this.loanService.getExpiredLoans();
  }

  @Get(':userEmail')
  async getUserLoans(@Param('userEmail') userEmail: string) {
    return this.loanService.getUserLoans(userEmail);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':loanId/delete')
  remove(@Param('loanId') id: string) {
    return this.loanService.deleteLoan(id);
  }
}
