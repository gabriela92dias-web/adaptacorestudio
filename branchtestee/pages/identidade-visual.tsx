import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useBrand, useUpdateBrand } from "../helpers/useApi";
import { Form, FormItem, FormLabel, FormControl, FormMessage, useForm } from "../components/Form";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Slider } from "../components/Slider";
import { Skeleton } from "../components/Skeleton";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../components/DropdownMenu";
import { schema as updateBrandSchema } from "../endpoints/brand/update_POST.schema";
import { useLogoExport } from "../helpers/useLogoExport";
import { Shuffle, Save, Palette, Download } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import styles from "./identidade-visual.module.css";

// Helper to generate random hex color favoring grayscale/muted tones as per design requirement,
// but since the user might want colorful logos on their brand, we allow full spectrum hex.
const generateRandomHex = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
};

export default function IdentidadeVisual() {
  const { ref, level, className: adaptiveClass } = useAdaptiveLevel();
  const { data: brandData, isLoading } = useBrand();
  const { mutateAsync: updateBrand, isPending } = useUpdateBrand();
  const { exportLogoAsSVG, exportLogoAsPNG } = useLogoExport();

  const form = useForm({
    schema: updateBrandSchema,
    defaultValues: {
      logoBgColor: "#171717",
      logoBgOpacity: 1,
      logoPlusColor: "#ffffff",
      logoPlusOpacity: 1,
      logoAdColor: "#ffffff",
      logoAdOpacity: 1,
    },
  });

  const setValues = form.setValues;

  useEffect(() => {
    if (brandData?.brand) {
      const brand = brandData.brand;
      setValues((prev) => ({
        ...prev,
        logoBgColor: brand.logoBgColor || "#171717",
        logoBgOpacity: brand.logoBgOpacity !== null && brand.logoBgOpacity !== undefined ? Number(brand.logoBgOpacity) : 1,
        logoPlusColor: brand.logoPlusColor || "#ffffff",
        logoPlusOpacity: brand.logoPlusOpacity !== null && brand.logoPlusOpacity !== undefined ? Number(brand.logoPlusOpacity) : 1,
        logoAdColor: brand.logoAdColor || "#ffffff",
        logoAdOpacity: brand.logoAdOpacity !== null && brand.logoAdOpacity !== undefined ? Number(brand.logoAdOpacity) : 1,
      }));
    }
  }, [brandData, setValues]);

  const onSubmit = async (values: z.infer<typeof updateBrandSchema>) => {
    try {
      await updateBrand(values);
      toast.success("Identidade visual salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar identidade visual.");
    }
  };

  const randomizeColors = () => {
    form.setValues((prev) => ({
      ...prev,
      logoBgColor: generateRandomHex(),
      logoPlusColor: generateRandomHex(),
      logoAdColor: generateRandomHex(),
    }));
  };

  const {
    logoBgColor, logoBgOpacity,
    logoPlusColor, logoPlusOpacity,
    logoAdColor, logoAdOpacity
  } = form.values;

  const exportParams = {
    logoBgColor: logoBgColor || "#171717",
    logoBgOpacity: logoBgOpacity !== undefined ? logoBgOpacity : 1,
    logoPlusColor: logoPlusColor || "#ffffff",
    logoPlusOpacity: logoPlusOpacity !== undefined ? logoPlusOpacity : 1,
    logoAdColor: logoAdColor || "#ffffff",
    logoAdOpacity: logoAdOpacity !== undefined ? logoAdOpacity : 1,
  };

  const handleExportSVG = () => {
    exportLogoAsSVG(exportParams);
  };

  const handleExportPNG = (size: number) => {
    exportLogoAsPNG(exportParams, size).catch(() => {
      toast.error("Erro ao exportar PNG.");
    });
  };

  return (
    <div ref={ref} className={`${styles.pageContainer} ${adaptiveClass} ${styles[`level${level}`]}`}>
      <Helmet>
        <title>Identidade Visual | Adapta Studio</title>
      </Helmet>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Identidade Visual</h1>
          <p className={styles.subtitle}>Ajuste as cores e opacidades de cada camada do logo da sua marca.</p>
        </div>
        <div className={styles.headerActions}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isPending || isLoading}>
                <Download size={16} />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportSVG}>Exportar como SVG</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportPNG(1024)}>Exportar como PNG (1024px)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportPNG(2048)}>Exportar como PNG (2048px)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={randomizeColors} disabled={isPending || isLoading}>
            <Shuffle size={16} />
            Randomizar
          </Button>
          <Button onClick={() => form.handleSubmit(onSubmit)({ preventDefault: () => {} } as React.FormEvent)} disabled={isPending || isLoading}>
            <Save size={16} />
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <div className={styles.container}>
        {/* Left Side: Logo Preview */}
        <div className={styles.previewPanel}>
          <div className={styles.previewContainer}>
            {isLoading ? (
              <Skeleton style={{ width: "100%", height: "100%", borderRadius: "var(--radius-lg)" }} />
            ) : (
              <svg 
                className={styles.svgLogo}
                viewBox="0 0 263.76 280.36" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Checkboard background pattern for transparency visualization */}
                <defs>
                  <pattern id="checkerboard" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="#141414" />
                    <rect width="10" height="10" fill="#1f1f1f" />
                    <rect x="10" y="10" width="10" height="10" fill="#1f1f1f" />
                  </pattern>
                </defs>
                <rect width="263.76" height="280.36" fill="url(#checkerboard)" />
                
                {/* Fundo */}
                <path fill={logoBgColor} opacity={logoBgOpacity} style={{ transition: 'all 0.3s ease' }} d="M263.76,74.72v130.91c0,3.33-1.77,6.41-4.65,8.09l-112.39,65.37c-2.91,1.69-6.5,1.69-9.41,0L24.97,213.73c-2.88-1.68-4.65-4.76-4.65-8.09V74.74c0-3.33,1.77-6.41,4.65-8.09L137.36,1.27c2.91-1.69,6.5-1.69,9.41,0l112.33,65.36c2.88,1.68,4.65,4.76,4.65,8.09Z"/>
                
                {/* Plus */}
                <polygon fill={logoPlusColor} opacity={logoPlusOpacity} style={{ transition: 'all 0.3s ease' }} points="92.99 149.38 71.29 149.38 71.28 170.56 53.51 170.56 53.51 149.39 31.81 149.38 31.81 132.67 53.5 132.67 53.51 111.38 71.28 111.38 71.29 132.67 92.99 132.67 92.99 149.38"/>

                {/* A */}
                <path fill={logoAdColor} opacity={logoAdOpacity} style={{ transition: 'all 0.3s ease' }} d="M155.31,82.59h-18.84l-4.8.22c-2.98.61-5.76,1.7-8.34,3.25-4.25,2.56-7.31,6.35-9.16,11.36l-29.85,81.4-6.95,18.94h28.61l7.21-21.18h48.58l6.9,21.18h29.12l-42.48-115.17ZM120.23,153.85l15.54-45.64c.09-.54.33-.97.71-1.29.38-.34.86-.5,1.41-.5s1,.14,1.38.41c.39.27.69.73.9,1.38l14.56,45.64h-34.5Z"/>

                {/* D */}
                <path fill={logoAdColor} opacity={logoAdOpacity} style={{ transition: 'all 0.3s ease' }} d="M204.76,197.77c3.83-.97,7.56-2.27,11.16-3.98,11.8-5.47,20.92-15.05,25.65-27.18,2.83-6.82,3.93-13.93,4.52-21.37v-7.89c-.48-7.36-1.75-14.62-4.51-21.59-4.99-12.62-14.57-22.41-27.01-27.82-6.94-3.01-14.2-4.61-21.8-5.34h-37.46l42.48,115.16M220.83,152.29c-2.41,9.51-8.82,17.04-17.82,20.87-4.08,1.74-8.57,3.1-12.98,3.56l-26.31-71.33,22.29.41c5.67.01,11.07,1.06,16.25,3.14,9.33,3.74,15.99,11.4,18.51,21.14,1.89,7.3,1.91,14.9.06,22.21Z"/>
              </svg>
            )}
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className={styles.controlsPanel}>
          <div className={styles.controlsHeader}>
            <Palette size={20} className={styles.controlsIcon} />
            <h2 className={styles.controlsTitle}>Camadas do Logo</h2>
          </div>

          {isLoading ? (
            <div className={styles.skeletonControls}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.controlGroup}>
                  <Skeleton style={{ height: "1.5rem", width: "40%", marginBottom: "1rem" }} />
                  <Skeleton style={{ height: "2.5rem", marginBottom: "1rem" }} />
                  <Skeleton style={{ height: "1.5rem" }} />
                </div>
              ))}
            </div>
          ) : (
            <Form {...form}>
              <form className={styles.form}>
                
                {/* Fundo */}
                <div className={styles.controlGroup}>
                  <h3 className={styles.groupTitle}>Fundo</h3>
                  <div className={styles.colorInputRow}>
                    <div 
                      className={styles.colorPreview} 
                      style={{ backgroundColor: logoBgColor }}
                    />
                    <FormItem name="logoBgColor" className={styles.flex1}>
                      <FormControl>
                        <Input
                          type="text"
                          value={form.values.logoBgColor || ""}
                          onChange={(e) => form.setValues(prev => ({ ...prev, logoBgColor: e.target.value }))}
                          placeholder="#HexCode"
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                  <FormItem name="logoBgOpacity">
                    <div className={styles.sliderHeader}>
                      <FormLabel>Opacidade</FormLabel>
                      <span className={styles.sliderValue}>{Math.round((form.values.logoBgOpacity || 0) * 100)}%</span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[form.values.logoBgOpacity !== undefined ? form.values.logoBgOpacity * 100 : 100]}
                        onValueChange={(vals: any[]) => form.setValues(prev => ({ ...prev, logoBgOpacity: vals[0] / 100 }))}
                        max={100}
                        step={1}
                      />
                    </FormControl>
                  </FormItem>
                </div>

                {/* Símbolo + */}
                <div className={styles.controlGroup}>
                  <h3 className={styles.groupTitle}>Símbolo (+)</h3>
                  <div className={styles.colorInputRow}>
                    <div 
                      className={styles.colorPreview} 
                      style={{ backgroundColor: logoPlusColor }}
                    />
                    <FormItem name="logoPlusColor" className={styles.flex1}>
                      <FormControl>
                        <Input
                          type="text"
                          value={form.values.logoPlusColor || ""}
                          onChange={(e) => form.setValues(prev => ({ ...prev, logoPlusColor: e.target.value }))}
                          placeholder="#HexCode"
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                  <FormItem name="logoPlusOpacity">
                    <div className={styles.sliderHeader}>
                      <FormLabel>Opacidade</FormLabel>
                      <span className={styles.sliderValue}>{Math.round((form.values.logoPlusOpacity || 0) * 100)}%</span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[form.values.logoPlusOpacity !== undefined ? form.values.logoPlusOpacity * 100 : 100]}
                        onValueChange={(vals: any[]) => form.setValues(prev => ({ ...prev, logoPlusOpacity: vals[0] / 100 }))}
                        max={100}
                        step={1}
                      />
                    </FormControl>
                  </FormItem>
                </div>

                {/* Texto AD */}
                <div className={styles.controlGroup}>
                  <h3 className={styles.groupTitle}>Texto (AD)</h3>
                  <div className={styles.colorInputRow}>
                    <div 
                      className={styles.colorPreview} 
                      style={{ backgroundColor: logoAdColor }}
                    />
                    <FormItem name="logoAdColor" className={styles.flex1}>
                      <FormControl>
                        <Input
                          type="text"
                          value={form.values.logoAdColor || ""}
                          onChange={(e) => form.setValues(prev => ({ ...prev, logoAdColor: e.target.value }))}
                          placeholder="#HexCode"
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                  <FormItem name="logoAdOpacity">
                    <div className={styles.sliderHeader}>
                      <FormLabel>Opacidade</FormLabel>
                      <span className={styles.sliderValue}>{Math.round((form.values.logoAdOpacity || 0) * 100)}%</span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[form.values.logoAdOpacity !== undefined ? form.values.logoAdOpacity * 100 : 100]}
                        onValueChange={(vals: any[]) => form.setValues(prev => ({ ...prev, logoAdOpacity: vals[0] / 100 }))}
                        max={100}
                        step={1}
                      />
                    </FormControl>
                  </FormItem>
                </div>

              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}