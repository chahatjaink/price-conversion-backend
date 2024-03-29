import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ConvertToken, Token } from 'src/interface/token.interface';

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService) {}

  apiUrl = this.configService.get<string>('apiUrl');
  headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  async getTop100Tokens(): Promise<Token[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          per_page: 100,
          page: 1,
          sparkline: false,
        },
        headers: this.headers,
      });

      const top100 = response.data.map((token) => ({
        id: token.id,
        symbol: token.symbol,
        name: token.name,
        image: token.image,
        current_price: token.current_price,
      }));

      return top100;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Top100 tokens api failed',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async convertCurrency(
    sourceCrypto: string,
    amount: number,
    targetCurrency: string,
  ): Promise<ConvertToken> {
    try {
      const response = await axios.get(`${this.apiUrl}/simple/price`, {
        params: {
          ids: sourceCrypto,
          vs_currencies: targetCurrency,
          precision: 5,
        },
        headers: this.headers,
      });

      const exchangeRate = response.data[sourceCrypto][targetCurrency];
      const convertedAmount = amount * exchangeRate;

      return {
        sourceCrypto,
        amount,
        targetCurrency,
        convertedAmount,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Conversion API failed',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async getCurrencies(): Promise<Array<string>> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/simple/supported_vs_currencies`,
        {
          headers: this.headers,
        },
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Currencies api failed',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
