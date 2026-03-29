// Typography Showcase - Demonstração visual do sistema tipográfico ADAPTA
// 🔤 Baseado em Type Scale (typescale.com) - Ratio 1.250 (Major Third)

export function TypographyShowcase() {
  const scaleTokens = [
    { token: '--text-4xl', size: '3.052rem', px: '48.8px', label: 'Display / Hero', leading: '--leading-tight (1.1)' },
    { token: '--text-3xl', size: '2.441rem', px: '39px', label: 'Display Titles', leading: '--leading-tight (1.1)' },
    { token: '--text-2xl', size: '1.953rem', px: '31.25px', label: 'H1 Titles', leading: '--leading-snug (1.2)' },
    { token: '--text-xl', size: '1.563rem', px: '25px', label: 'H2 Subtitles', leading: '--leading-snug (1.2)' },
    { token: '--text-lg', size: '1.250rem', px: '20px', label: 'H3 Subtitles', leading: '--leading-normal (1.4)' },
    { token: '--text-md', size: '1.125rem', px: '18px', label: 'H4 / Lead', leading: '--leading-normal (1.4)' },
    { token: '--text-base', size: '1.000rem', px: '16px', label: 'Body (Base)', leading: '--leading-normal (1.4)', highlight: true },
    { token: '--text-sm', size: '0.800rem', px: '12.8px', label: 'Small Text', leading: '--leading-relaxed (1.6)' },
    { token: '--text-xs', size: '0.640rem', px: '10.24px', label: 'Captions', leading: '--leading-relaxed (1.6)' },
  ];

  const semanticTokens = [
    { token: '--text-display', maps: '--text-4xl', use: 'Hero, landing pages' },
    { token: '--text-heading-1', maps: '--text-2xl', use: 'Títulos principais de página' },
    { token: '--text-heading-2', maps: '--text-xl', use: 'Subtítulos de seção' },
    { token: '--text-heading-3', maps: '--text-lg', use: 'Subtítulos de card' },
    { token: '--text-heading-4', maps: '--text-md', use: 'Subtítulos pequenos' },
    { token: '--text-body', maps: '--text-base', use: 'Corpo de texto padrão' },
    { token: '--text-body-small', maps: '--text-sm', use: 'Textos secundários' },
    { token: '--text-caption', maps: '--text-xs', use: 'Metadados, timestamps' },
  ];

  const labelTokens = [
    { token: '--label-title', size: '0.625rem', pt: '~7.5pt', use: 'Título do produto' },
    { token: '--label-subtitle', size: '0.458rem', pt: '~5.5pt', use: 'Subtítulo, composição' },
    { token: '--label-body', size: '0.417rem', pt: '~5pt', use: 'Corpo de texto' },
    { token: '--label-small', size: '0.333rem', pt: '~4pt', use: 'Textos pequenos' },
    { token: '--label-tiny', size: '0.292rem', pt: '~3.5pt', use: 'Legal, marcas' },
  ];

  const weights = [
    { token: '--font-weight-normal', value: '400', use: 'Corpo de texto' },
    { token: '--font-weight-medium', value: '500', use: 'UI elements' },
    { token: '--font-weight-semibold', value: '600', use: 'Subtítulos' },
    { token: '--font-weight-bold', value: '700', use: 'Títulos' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-semibold mb-1">Sistema Tipográfico ADAPTA</h1>
        <p className="text-sm text-muted-foreground">
          Baseado em Type Scale · Ratio 1.250 (Major Third) · Base 16px
        </p>
      </div>

      {/* Escala de Tamanhos */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Escala de Tamanhos</h2>
          <p className="text-xs text-muted-foreground">
            Tokens de tamanho de fonte seguindo a proporção 1.250
          </p>
        </div>

        <div className="grid gap-3">
          {scaleTokens.map((item) => (
            <div
              key={item.token}
              className={`border rounded-lg p-4 transition-all hover:border-primary/50 ${
                item.highlight ? 'bg-primary/5 border-primary/30' : 'bg-card'
              }`}
            >
              <div className="flex items-baseline justify-between mb-2">
                <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {item.token}
                </code>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>{item.size}</span>
                  <span>·</span>
                  <span>{item.px}</span>
                  <span>·</span>
                  <span className="font-mono text-[10px]">{item.leading}</span>
                </div>
              </div>
              <div
                style={{
                  fontSize: `var(${item.token})`,
                  fontWeight: item.token.includes('4xl') || item.token.includes('3xl') || item.token.includes('2xl') 
                    ? 'var(--font-weight-semibold)' 
                    : 'var(--font-weight-normal)',
                  lineHeight: item.token.includes('4xl') || item.token.includes('3xl')
                    ? 'var(--leading-tight)'
                    : item.token.includes('2xl') || item.token.includes('xl')
                    ? 'var(--leading-snug)'
                    : item.token.includes('xs') || item.token.includes('sm')
                    ? 'var(--leading-relaxed)'
                    : 'var(--leading-normal)'
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tokens Semânticos */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Tokens Semânticos</h2>
          <p className="text-xs text-muted-foreground">
            Use estes tokens em vez dos tokens de escala brutos
          </p>
        </div>

        <div className="grid gap-2">
          {semanticTokens.map((item) => (
            <div
              key={item.token}
              className="border rounded-lg p-3 bg-card hover:border-primary/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {item.token}
                </code>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">→</span>
                  <code className="font-mono text-muted-foreground">{item.maps}</code>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{item.use}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tokens para Label Generator */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Tokens para Label Generator</h2>
          <p className="text-xs text-muted-foreground">
            Tokens específicos para impressão @ 300 DPI
          </p>
        </div>

        <div className="grid gap-2">
          {labelTokens.map((item) => (
            <div
              key={item.token}
              className="border rounded-lg p-3 bg-card hover:border-primary/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {item.token}
                </code>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>{item.size}</span>
                  <span>·</span>
                  <span>{item.pt} @ 300dpi</span>
                  <span>·</span>
                  <span>{item.use}</span>
                </div>
              </div>
              <div
                style={{
                  fontSize: `var(${item.token})`,
                  fontFamily: "'Montserrat', sans-serif"
                }}
              >
                Exemplo de texto para impressão
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Font Weights */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Font Weights</h2>
          <p className="text-xs text-muted-foreground">
            Pesos de fonte estruturados para hierarquia clara
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {weights.map((item) => (
            <div
              key={item.token}
              className="border rounded-lg p-3 bg-card hover:border-primary/50 transition-all"
            >
              <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded block mb-2">
                {item.token}
              </code>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs text-muted-foreground">{item.value}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{item.use}</span>
              </div>
              <div
                style={{
                  fontWeight: `var(${item.token})`,
                  fontSize: 'var(--text-lg)'
                }}
              >
                Exemplo Aa
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exemplo Prático */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Exemplo Prático</h2>
          <p className="text-xs text-muted-foreground">
            Combinação de tokens em um layout real
          </p>
        </div>

        <div className="border rounded-lg p-6 bg-card space-y-4">
          <h1 style={{ 
            fontSize: 'var(--text-heading-1)', 
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--leading-snug)'
          }}>
            Título Principal da Página
          </h1>
          
          <h2 style={{ 
            fontSize: 'var(--text-heading-2)', 
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--leading-snug)'
          }}>
            Subtítulo da Seção
          </h2>
          
          <p style={{ 
            fontSize: 'var(--text-body)', 
            fontWeight: 'var(--font-weight-normal)',
            lineHeight: 'var(--leading-normal)',
            maxWidth: '65ch'
          }}>
            Este é um parágrafo de exemplo usando o token <code className="text-xs font-mono bg-primary/10 px-1 py-0.5 rounded">--text-body</code>. 
            Demonstra como o texto corpo se comporta com line-height otimizado para legibilidade. 
            O comprimento ideal de linha é mantido em cerca de 65 caracteres para conforto visual.
          </p>

          <p style={{ 
            fontSize: 'var(--text-body-small)', 
            fontWeight: 'var(--font-weight-normal)',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: '65ch'
          }}>
            <span className="text-muted-foreground">
              Texto secundário usando <code className="text-xs font-mono bg-primary/10 px-1 py-0.5 rounded">--text-body-small</code> com 
              line-height relaxado para melhor legibilidade em tamanhos menores.
            </span>
          </p>

          <p style={{ 
            fontSize: 'var(--text-caption)', 
            fontWeight: 'var(--font-weight-normal)',
            lineHeight: 'var(--leading-relaxed)'
          }}>
            <span className="text-muted-foreground">
              Metadados e timestamps · Publicado em 11/03/2026 · Categoria: Design System
            </span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t pt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Ferramenta: <a href="https://typescale.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Type Scale</a> · 
          Documentação completa: <code className="font-mono bg-primary/10 px-1 py-0.5 rounded">/TYPOGRAPHY_TOKENS.md</code>
        </p>
      </div>
    </div>
  );
}
