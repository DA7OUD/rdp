CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    address VARCHAR(255) UNIQUE NOT NULL,
    currency VARCHAR(10) NOT NULL,
    is_admin_wallet BOOLEAN DEFAULT TRUE,
    user_id UUID REFERENCES public.users(id)
);

-- Add an index for faster lookups by address and currency
CREATE INDEX IF NOT EXISTS idx_wallets_address_currency ON public.wallets (address, currency);
