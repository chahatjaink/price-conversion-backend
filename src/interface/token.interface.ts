export interface Token {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}
export interface ConvertToken {
  sourceCrypto: string;
  amount: number;
  targetCurrency: string;
  convertedAmount: number;
}
