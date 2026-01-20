
import { PaymentOption } from '../types/registration';

export const COLORS = {
  LEVEL_1: 'bg-emerald-500/20 border-emerald-500 text-emerald-300',
  LEVEL_2: 'bg-sky-500/20 border-sky-500 text-sky-300',
  LEVEL_3: 'bg-rose-500/20 border-rose-500 text-rose-300',
  WORKSHOP: 'bg-rose-600/30 border-rose-400 text-rose-100',
};

// Stripe Payment Links - Direct links to Stripe hosted checkout pages
export const STRIPE_PAYMENT_LINKS = {
  level1: 'https://buy.stripe.com/28E4gzf6ZeYD6r68EY5c400',
  level2: 'https://buy.stripe.com/28E8wP7ExbMr3eUcVe5c401',
  level3: 'https://buy.stripe.com/aFa00j6AtaIn9DicVe5c402',
  level3_workshop: 'https://buy.stripe.com/aFacN57ExeYD2aQg7q5c403',
};

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    title: 'Level 1',
    sessions: '3 Sessions',
    price: '$145 CAD + HST',
    level: 'Level 1',
    paymentLink: STRIPE_PAYMENT_LINKS.level1,
  },
  {
    title: 'Level 2',
    sessions: '3 Sessions',
    price: '$185 CAD + HST',
    level: 'Level 2',
    paymentLink: STRIPE_PAYMENT_LINKS.level2,
  },
  {
    title: 'Level 3',
    sessions: '3 Sessions',
    price: '$225 CAD + HST',
    level: 'Level 3',
    paymentLink: STRIPE_PAYMENT_LINKS.level3,
  },
  {
    title: 'Level 3 Advanced Workshop',
    sessions: 'Workshop',
    price: '$80 CAD + HST',
    level: 'Level 3 Advanced Workshop',
    paymentLink: STRIPE_PAYMENT_LINKS.level3_workshop,
  },
];
