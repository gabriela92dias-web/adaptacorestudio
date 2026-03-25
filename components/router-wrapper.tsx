/**
 * ═══════════════════════════════════════════════════════════════
 * ROUTER WRAPPER - Garantir Contextos Disponíveis
 * ═══════════════════════════════════════════════════════════════
 * 
 * Garante que os contextos (Auth, Theme, etc) estejam disponíveis
 * para todas as rotas do React Router
 */

import { RouterProvider as ReactRouterProvider, createBrowserRouter } from 'react-router';
import { AuthProvider } from '../contexts/auth-context';
import { LanguageProvider } from '../contexts/language-context';
import { ModulesProvider } from '../contexts/modules-context';
import { BrandProvider } from '../contexts/brand-context';
import { CampaignsProvider } from '../contexts/campaigns-context';
import { BrandStudioProvider } from '../contexts/brand-context';

interface RouterWrapperProps {
  router: ReturnType<typeof createBrowserRouter>;
}

/**
 * Wrapper que garante que todos os contextos estão disponíveis
 * para as rotas do React Router
 */
export function RouterWrapper({ router }: RouterWrapperProps) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ModulesProvider>
          <BrandProvider>
            <BrandStudioProvider>
              <CampaignsProvider>
                <ReactRouterProvider router={router} />
              </CampaignsProvider>
            </BrandStudioProvider>
          </BrandProvider>
        </ModulesProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

