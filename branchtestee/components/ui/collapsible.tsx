"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

// Função helper para filtrar props do Figma
// Remove TODOS os props que começam com _fg (case-insensitive)
function filterFigmaProps<T extends Record<string, any>>(props: T): Partial<T> {
  const cleanProps: any = {};
  
  for (const key in props) {
    // Ignora props que começam com _fg (inspeção do Figma)
    if (!key.toLowerCase().startsWith('_fg')) {
      cleanProps[key] = props[key];
    }
  }
  
  return cleanProps;
}

const Collapsible = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>((props, ref) => {
  const cleanProps = filterFigmaProps(props);
  return <CollapsiblePrimitive.Root ref={ref} data-slot="collapsible" {...cleanProps} />;
});
Collapsible.displayName = "Collapsible";

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger> & {
    asChild?: boolean;
  }
>((props, ref) => {
  const { asChild, children, ...rest } = props;
  const cleanProps = filterFigmaProps(rest);
  
  // Se asChild for true, clona o child e filtra as props do Figma dele também
  if (asChild && React.isValidElement(children)) {
    const childProps = filterFigmaProps(children.props || {});
    const cleanChild = React.cloneElement(children, childProps as any);
    
    return (
      <CollapsiblePrimitive.CollapsibleTrigger
        ref={ref}
        asChild
        data-slot="collapsible-trigger"
        {...cleanProps}
      >
        {cleanChild}
      </CollapsiblePrimitive.CollapsibleTrigger>
    );
  }
  
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      ref={ref}
      data-slot="collapsible-trigger"
      asChild={asChild}
      {...cleanProps}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleTrigger>
  );
});
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>((props, ref) => {
  const cleanProps = filterFigmaProps(props);
  return (
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      data-slot="collapsible-content"
      {...cleanProps}
    />
  );
});
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };