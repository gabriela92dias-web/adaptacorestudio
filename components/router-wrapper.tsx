/**
 * ═══════════════════════════════════════════════════════════════
 * ROUTER WRAPPER - Garantir Contextos Disponíveis
 * ═══════════════════════════════════════════════════════════════
 * 
 * Garante que os contextos (Auth, Theme, etc) estejam disponíveis
 * para todas as rotas do React Router
 */

import { RouterProvider as ReactRouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/auth-context';
import { LanguageProvider } from '../contexts/language-context';
import { ModulesProvider } from '../contexts/modules-context';
import { BrandProvider } from '../contexts/brand-context';
import { CampaignsProvider } from '../contexts/campaigns-context';

interface RouterWrapperProps {
  router: ReturnType<typeof createBrowserRouter>;
}

/**
 * Wrapper que garante que todos os contextos estão disponíveis
 * para as rotas do React Router
 * Nota: BrandProvider já inclui BrandStudioContext internamente
 */
export function RouterWrapper({ router }: RouterWrapperProps) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ModulesProvider>
          <BrandProvider>
            <CampaignsProvider>
              <ReactRouterProvider router={router} />
            </CampaignsProvider>
          </BrandProvider>
        </ModulesProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
