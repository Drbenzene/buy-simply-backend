import { BadRequestException, Injectable } from '@nestjs/common';
import { loans, staffAccounts } from 'utils/constants';
import { Roles } from 'utils/enums';
import { PageOptionsDto } from 'utils/pagination/pageOptionsDto.dto';

@Injectable()
export class LoanService {
  async getLoans(staffId: number, pageOptionsDto: PageOptionsDto) {
    const { status } = pageOptionsDto;
    const staff = staffAccounts.find((staff) => staff.id === Number(staffId));
    const staffRole = staff?.role;
    let loansCopy = loans;

    console.log(staffRole, 'STAFF ROLE');

    //IF THE STATUS QUERY IS PARSED, FILTER THE LOANS BY STATUS
    if (status) {
      console.log('Status:', status);
      loansCopy = loansCopy.filter((loan) => loan.status === status);
    }
    console.log(loansCopy, 'AFTERR');

    //ROLE BASE ACCESS CONTROL
    if (staffRole === Roles.ADMIN) {
      loansCopy.map((loan) => {
        const { amount, ...rest } = loan;
        return rest;
      });
    } else {
      return loansCopy;
    }
  }

  /**
   *
   * @param userEmail
   * @returns {Promise<Loan[]>} - Returns an array of loans for a specific user
   */
  async getUserLoans(userEmail: string) {
    return loans.filter(
      (loan) =>
        loan?.applicant.email?.toLowerCase() === userEmail?.toLowerCase(),
    );
  }

  /**
   *
   * @returns {Promise<Loan[]>} - Returns an array of expired loans
   */
  async getExpiredLoans() {
    return loans.filter((loan) => {
      const maturityDate = new Date(loan.maturityDate);
      return maturityDate < new Date();
    });
  }

  /**
   *
   * @param id
   * @returns {Promise<{message: string}>} - Returns a message indicating the success of the operation
   */
  deleteLoan(id: string) {
    const loanIndex = loans.findIndex((loan) => loan.id === id);
    if (loanIndex === -1) {
      throw new BadRequestException('Loan not found');
    }
    loans.splice(loanIndex, 1);
    return {
      message: 'Loan deleted successfully',
    };
  }
}
