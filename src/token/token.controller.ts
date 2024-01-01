import { Controller, Get, Query } from '@nestjs/common';
import { ConvertDto } from 'src/dto/convert.dto';
import { TokenService } from './token.service';
import { ConvertToken, Token } from 'src/interface/token.interface';

@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Get('top100')
  async getTop100Tokens(): Promise<Token[]> {
    return await this.tokenService.getTop100Tokens();
  }

  @Get('convert')
  async convertPrices(@Query() convertDto: ConvertDto): Promise<ConvertToken> {
    return await this.tokenService.convertCurrency(
      convertDto.sourceCrypto,
      convertDto.amount,
      convertDto.targetCurrency,
    );
  }

  @Get()
  getCurrencies(): string {
    return 'hello';
  }
}
