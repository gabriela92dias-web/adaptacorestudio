/**
 * ═══════════════════════════════════════════════════════════════════
 * HOOK DE TRADUÇÃO - useTranslations
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Hook para acessar traduções de forma tipada e eficiente
 * 
 * Uso:
 * ```tsx
 * import { useTranslations } from '@/i18n/use-translations';
 * 
 * function MyComponent() {
 *   const { t, tGroup } = useTranslations();
 *   
 *   return (
 *     <div>
 *       <h1>{t('global.welcome')}</h1>
 *       <p>{tGroup('navigation').dashboard}</p>
 *     </div>
 *   );
 * }
 * ```
 * ═══════════════════════════════════════════════════════════════════
 */

import { useLanguage } from '../contexts/language-context';
import { translations, type TranslationKey, type TranslationSubKey } from './translations';
import { useMemo } from 'react';

export function useTranslations() {
  const { language } = useLanguage();

  /**
   * Traduz uma chave específica
   * @example t('global.welcome') -> 'Bem-vindo' (PT) | 'Welcome' (EN)
   */
  const t = (path: string): string => {
    const keys = path.split('.');
    
    if (keys.length === 2) {
      const [group, key] = keys;
      const translationGroup = translations[group as TranslationKey];
      
      if (translationGroup) {
        const translation = translationGroup[key as any] as any;
        if (translation) {
          return translation[language] || translation['en'] || translation['pt'] || path;
        }
      }
    }
    
    // Fallback: retorna a própria chave se não encontrar tradução
    return path;
  };

  /**
   * Retorna um grupo inteiro de traduções já traduzido
   * OU acessa uma chave específica dentro do grupo
   * @example 
   * tGroup('navigation') -> { dashboard: 'Dashboard', home: 'Início', ... }
   * tGroup('navigation', 'dashboard') -> 'Dashboard'
   */
  const tGroup = <K extends TranslationKey>(groupKey: K, subKey?: string): any => {
    const group = translations[groupKey];
    
    if (!group) {
      return subKey ? subKey : {};
    }
    
    // Se subKey foi fornecida, retorna apenas essa tradução
    if (subKey) {
      const translation = group[subKey as TranslationSubKey<K>] as any;
      return translation ? (translation[language] || translation['en'] || translation['pt']) : subKey;
    }
    
    // Retorna o grupo inteiro traduzido (recalculado a cada mudança de idioma)
    const translatedGroup: Record<string, string> = {};
    
    for (const key in group) {
      const translation = group[key as TranslationSubKey<K>] as any;
      translatedGroup[key] = translation ? (translation[language] || translation['en'] || translation['pt']) : key;
    }
    
    return translatedGroup;
  };

  /**
   * Retorna todas as traduções do idioma atual
   */
  const tAll = () => {
    const allTranslations: Record<string, Record<string, string>> = {};
    
    for (const groupKey in translations) {
      allTranslations[groupKey] = tGroup(groupKey as TranslationKey);
    }
    
    return allTranslations;
  };

  return {
    t,           // Traduz uma chave específica
    tGroup,      // Retorna grupo de traduções
    tAll,        // Retorna todas as traduções
    language,    // Idioma atual
  };
}

/**
 * Hook simplificado para componentes que usam apenas um grupo
 * @example const nav = useTranslationGroup('navigation');
 */
export function useTranslationGroup<K extends TranslationKey>(groupKey: K) {
  const { tGroup } = useTranslations();
  return tGroup(groupKey);
}