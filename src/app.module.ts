import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoanModule } from './loan/loan.module';

@Module({
  imports: [AuthModule, LoanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
