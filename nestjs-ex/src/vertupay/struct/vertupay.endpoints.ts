export const VertupayEndpoints = {
  PAYIN_BALANCE: 'https://api.dylamicapi.com/fund_in/balance.api',
  PAYIN_LIST: 'https://api.dylamicapi.com/fund_in/transaction_detail.api',
  PAYOUT_LIST: 'https://api.dylamicapi.com/fund_out/transaction_detail.api',
} as const;

//type VertupayEndpointKeys = keyof typeof VertupayEndpoints; // Create a type of the keys
