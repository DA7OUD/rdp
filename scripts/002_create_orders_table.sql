CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES public.users(id) NOT NULL,
    send_amount NUMERIC(20, 8) NOT NULL,
    send_currency VARCHAR(10) NOT NULL,
    receive_amount NUMERIC(20, 8) NOT NULL,
    receive_currency VARCHAR(10) NOT NULL,
    recipient_address VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- e.g., 'pending', 'processing', 'completed', 'failed'
    transaction_id VARCHAR(255), -- Blockchain transaction ID for the outgoing transfer
    deposit_address VARCHAR(255) -- The address the user needs to send crypto to for this order
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_deposit_address ON public.orders (deposit_address);
