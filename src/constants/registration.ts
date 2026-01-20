
import { PaymentOption } from '../types/registration';

export const COLORS = {
  LEVEL_1: 'bg-emerald-500/20 border-emerald-500 text-emerald-300',
  LEVEL_2: 'bg-sky-500/20 border-sky-500 text-sky-300',
  LEVEL_3: 'bg-rose-500/20 border-rose-500 text-rose-300',
  WORKSHOP: 'bg-rose-600/30 border-rose-400 text-rose-100',
};

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    title: 'Level 1',
    sessions: '3 Sessions',
    price: '$145 CAD + HST',
    level: 'Level 1',
  },
  {
    title: 'Level 2',
    sessions: '3 Sessions',
    price: '$185 CAD + HST',
    level: 'Level 2',
  },
  {
    title: 'Level 3',
    sessions: '3 Sessions',
    price: '$225 CAD + HST',
    level: 'Level 3',
  },
  {
    title: 'Level 3 Advanced Workshop',
    sessions: 'Workshop',
    price: '$80 CAD + HST',
    level: 'Level 3 Advanced Workshop',
  },
];
