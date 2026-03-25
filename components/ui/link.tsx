import { Link as RouterLink, type LinkProps } from "react-router-dom";
import { forwardRef } from "react";

// Estende LinkProps para aceitar qualquer prop do Figma Inspector no TypeScript
interface ExtendedLinkProps extends LinkProps {
  [key: string]: any;
}

export const Link = forwardRef<HTMLAnchorElement, ExtendedLinkProps>(
  (props, ref) => {
    // Filtra props de inspeção do Figma (qualquer prop que comece com _fg, case-insensitive)
    const cleanProps = Object.keys(props).reduce((acc, key) => {
      if (!key.toLowerCase().startsWith('_fg')) {
        acc[key] = props[key];
      }
      return acc;
    }, {} as any);

    return <RouterLink ref={ref} {...cleanProps as LinkProps} />;
  },
);

Link.displayName = "Link";

// Re-exporta o tipo para uso externo
export type { LinkProps };