/**
 * ═══════════════════════════════════════════════════════════════════
 * EXEMPLO: USO DOS PROVIDERS - PHASE 3
 * ═══════════════════════════════════════════════════════════════════
 * Demonstra integração entre ModulesProvider, BrandProvider e CampaignsProvider
 */

import { useModules } from '../../contexts/modules-context';
import { useBrand } from '../../contexts/brand-context';
import { useCampaigns } from '../../contexts/campaigns-context';
import { useLanguage } from '../../contexts/language-context';

export function ProvidersDemo() {
  const { language, setLanguage } = useLanguage();
  const { state: modulesState, setActiveModule, hasPermission } = useModules();
  const { state: brandState, setCurrentBrand } = useBrand();
  const { state: campaignsState, setFilters, getFilteredCampaigns } = useCampaigns();

  return (
    <div style={{
      background: '#1A2421',
      border: '2px solid #00D9A3',
      borderRadius: '12px',
      padding: '2rem',
      color: '#00D9A3',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
        🧪 Providers Demo
      </h2>

      {/* LANGUAGE */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', opacity: 0.9 }}>
          🌐 Language Provider
        </h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setLanguage('pt')}
            style={{
              background: language === 'pt' ? '#00D9A3' : '#141A17',
              color: language === 'pt' ? '#141A17' : '#00D9A3',
              border: '2px solid #00D9A3',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: language === 'pt' ? 'bold' : 'normal',
            }}
          >
            Português
          </button>
          <button
            onClick={() => setLanguage('en')}
            style={{
              background: language === 'en' ? '#00D9A3' : '#141A17',
              color: language === 'en' ? '#141A17' : '#00D9A3',
              border: '2px solid #00D9A3',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: language === 'en' ? 'bold' : 'normal',
            }}
          >
            English
          </button>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.7 }}>
          Idioma atual: <strong>{language}</strong>
        </p>
      </section>

      {/* MODULES */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', opacity: 0.9 }}>
          🎛️ Modules Provider
        </h3>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setActiveModule('brand')}
            style={{
              background: modulesState.activeModule === 'brand' ? '#00D9A3' : '#141A17',
              color: modulesState.activeModule === 'brand' ? '#141A17' : '#00D9A3',
              border: '2px solid #00D9A3',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            BRAND
          </button>
          <button
            onClick={() => setActiveModule('marketing')}
            style={{
              background: modulesState.activeModule === 'marketing' ? '#00D9A3' : '#141A17',
              color: modulesState.activeModule === 'marketing' ? '#141A17' : '#00D9A3',
              border: '2px solid #00D9A3',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            MARKETING
          </button>
          <button
            onClick={() => setActiveModule('tools')}
            style={{
              background: modulesState.activeModule === 'tools' ? '#00D9A3' : '#141A17',
              color: modulesState.activeModule === 'tools' ? '#141A17' : '#00D9A3',
              border: '2px solid #00D9A3',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            TOOLS
          </button>
        </div>
        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
          Módulo ativo: <strong>{modulesState.activeModule || 'nenhum'}</strong>
        </p>
        {modulesState.activeModule && (
          <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
            Pode editar? {hasPermission(modulesState.activeModule, 'edit') ? '✅' : '❌'}
          </p>
        )}
      </section>

      {/* BRAND */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', opacity: 0.9 }}>
          🎨 Brand Provider
        </h3>
        <div style={{ background: '#141A17', padding: '1rem', borderRadius: '6px' }}>
          {brandState.currentBrand ? (
            <>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Marca: <strong>{brandState.currentBrand.name}</strong>
              </p>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Cores: <strong>{(brandState.currentBrand.colors || []).length}</strong>
              </p>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Assets: <strong>{(brandState.currentBrand.assets || []).length}</strong>
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {(brandState.currentBrand.colors || []).map((color) => (
                  <div
                    key={color.id}
                    style={{
                      background: color.hex,
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      border: '2px solid #00D9A3',
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </>
          ) : (
            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Nenhuma marca selecionada</p>
          )}
        </div>
      </section>

      {/* CAMPAIGNS */}
      <section>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', opacity: 0.9 }}>
          📊 Campaigns Provider
        </h3>
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => setFilters({ status: 'active' })}
            style={{
              background: '#141A17',
              color: '#00D9A3',
              border: '2px solid #00D9A3',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              marginRight: '0.5rem',
            }}
          >
            Filtrar: Ativas
          </button>
          <button
            onClick={() => setFilters({})}
            style={{
              background: '#141A17',
              color: '#00D9A3',
              border: '2px solid #00D9A3',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Limpar Filtros
          </button>
        </div>
        <div style={{ background: '#141A17', padding: '1rem', borderRadius: '6px' }}>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Total de campanhas: <strong>{(campaignsState.campaigns || []).length}</strong>
          </p>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Campanhas filtradas: <strong>{getFilteredCampaigns().length}</strong>
          </p>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Templates disponíveis: <strong>{(campaignsState.templates || []).length}</strong>
          </p>
        </div>
      </section>
    </div>
  );
}