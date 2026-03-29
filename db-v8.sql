-- Tabela base da campanha gerada (DNA)
CREATE TABLE IF NOT EXISTS public.v8_campaigns (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    direcao TEXT,
    experiencia TEXT,
    objetivo_primario TEXT,
    segmento_publico TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para os módulos do Motor V8
CREATE TABLE IF NOT EXISTS public.v8_modules (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    campaign_id TEXT NOT NULL REFERENCES public.v8_campaigns(id) ON DELETE CASCADE,
    bloco INTEGER,
    nome TEXT NOT NULL,
    descricao TEXT,
    status TEXT DEFAULT 'on',
    owner TEXT,
    cost NUMERIC(12,2),
    due_date TIMESTAMP WITH TIME ZONE,
    ok BOOLEAN DEFAULT false,
    ok_trigger TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para os Soft Gates restritivos
CREATE TABLE IF NOT EXISTS public.v8_gates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    campaign_id TEXT NOT NULL REFERENCES public.v8_campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    critical BOOLEAN DEFAULT true,
    ok BOOLEAN DEFAULT false,
    artifact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
