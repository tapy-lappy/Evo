import { Pipe, PipeTransform } from '@angular/core';
import { Currency } from '../Models/currency';

@Pipe({ name: "currencyFormat" })
export class CurrencyFormatPipe implements PipeTransform
{
    transform(currency: Currency, index?: number): string
    {
        //https://basarat.gitbooks.io/typescript/content/docs/template-strings.html
        let result = index !== undefined ? `${index}. ` : '';
        return `${result}${currency.Code} (${currency.Symbol})`;
    }
}