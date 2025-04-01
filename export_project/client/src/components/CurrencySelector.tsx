import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DollarSign, ChevronDown } from 'lucide-react';
import { useI18n, SupportedCurrency } from '@/i18n';

type Currency = {
  code: SupportedCurrency;
  name: string;
  symbol: string;
};

const currencies: Currency[] = [
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' }
];

export function CurrencySelector() {
  const { currency, setCurrency, t } = useI18n();
  const [open, setOpen] = useState(false);
  
  const currentCurrency = currencies.find(c => c.code === currency) || currencies[0];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
          <DollarSign className="h-4 w-4" />
          <span className="hidden md:inline-block">
            {currentCurrency.code}
          </span>
          <span className="md:hidden">
            {currentCurrency.symbol}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => {
              setCurrency(curr.code);
              setOpen(false);
            }}
            className={`flex items-center gap-2 ${currency === curr.code ? 'font-medium' : ''}`}
          >
            <span className="text-sm w-6">{curr.symbol}</span>
            <span>{curr.code}</span>
            <span className="text-xs text-muted-foreground ml-1">
              ({curr.name})
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}