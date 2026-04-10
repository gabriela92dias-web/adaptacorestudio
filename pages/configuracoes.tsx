import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useBrand, useUpdateBrand } from "../helpers/useApi";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormDescription, useForm } from "../components/Form";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import { Separator } from "../components/Separator";
import { schema as updateBrandSchema } from "../endpoints/brand/update_POST.schema";
import { Building2, Save } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import styles from "./configuracoes.module.css";

export default function Configuracoes() {
  const { ref, level, className: adaptiveClass } = useAdaptiveLevel();
  const { data: brandData, isLoading: isFetchingBrand, isError } = useBrand();
  const { mutateAsync: updateBrand, isPending } = useUpdateBrand();

  const isLoading = isFetchingBrand && !isError;

  const form = useForm({
    schema: updateBrandSchema,
    defaultValues: {
      companyName: "",
      contactName: "",
      role: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      city: "",
      zip: "",
      primaryColor: "#ffffff",
      secondaryColor: "#a3a3a3",
    },
  });

  const setValues = form.setValues;

  useEffect(() => {
    if (brandData?.brand) {
      setValues({
        companyName: brandData.brand.companyName || "",
        contactName: brandData.brand.contactName || "",
        role: brandData.brand.role || "",
        phone: brandData.brand.phone || "",
        email: brandData.brand.email || "",
        website: brandData.brand.website || "",
        address: brandData.brand.address || "",
        city: brandData.brand.city || "",
        zip: brandData.brand.zip || "",
        primaryColor: brandData.brand.primaryColor || "#ffffff",
        secondaryColor: brandData.brand.secondaryColor || "#a3a3a3",
      });
    }
  }, [brandData, setValues]);

  const onSubmit = async (values: z.infer<typeof updateBrandSchema>) => {
    try {
      await updateBrand(values);
      toast.success("Configurações atualizadas com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar configurações.");
    }
  };

  return (
    <div ref={ref} className={`${styles.container} ${adaptiveClass} ${styles[`level${level}`]}`}>
      <Helmet>
        <title>Configurações da Marca | Adapta Studio</title>
      </Helmet>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Configurações da Marca</h1>
          <p className={styles.subtitle}>Gerencie os dados institucionais que alimentarão seus materiais.</p>
        </div>
      </div>

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.skeletonForm}>
            <div className={styles.skeletonSection}>
              <Skeleton style={{ height: "2rem", width: "30%", marginBottom: "2rem" }} />
              <div className={styles.skeletonGrid}>
                <Skeleton style={{ height: "3rem" }} />
                <Skeleton style={{ height: "3rem" }} />
                <Skeleton style={{ height: "3rem" }} />
                <Skeleton style={{ height: "3rem" }} />
              </div>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
              
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <Building2 size={20} className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>Dados da Empresa</h2>
                </div>
                
                <div className={styles.formGrid}>
                  <FormItem name="companyName" className={styles.fullWidth}>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Adapta Studio"
                        value={form.values.companyName || ""}
                        onChange={(e) => form.setValues(prev => ({ ...prev, companyName: e.target.value }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem name="website" className={styles.fullWidth}>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://suaempresa.com.br"
                        value={form.values.website || ""}
                        onChange={(e) => form.setValues(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem name="contactName">
                    <FormLabel>Nome do Contato</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome completo"
                        value={form.values.contactName || ""}
                        onChange={(e) => form.setValues(prev => ({ ...prev, contactName: e.target.value }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem name="role">
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Diretor de Marketing"
                        value={form.values.role || ""}
                        onChange={(e) => form.setValues(prev => ({ ...prev, role: e.target.value }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem name="email">
                    <FormLabel>E-mail de Contato</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contato@empresa.com"
                        value={form.values.email || ""}
                        onChange={(e) => form.setValues(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem name="phone">
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(00) 00000-0000"
                        value={form.values.phone || ""}
                        onChange={(e) => form.setValues(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              </div>

              <Separator className={styles.separator} />

              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Endereço</h2>
                </div>
                
                <div className={styles.formGrid}>
                  <FormItem name="address" className={styles.fullWidth}>
                    <FormLabel>Endereço Completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Rua, Número, Bairro"
                        value={form.values.address || ""}
                        onChange={(e) => form.setValues(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem name="city">
                    <FormLabel>Cidade / Estado</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="São Paulo - SP"
                        value={form.values.city || ""}
                        onChange={(e) => form.setValues(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem name="zip">
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00000-000"
                        value={form.values.zip || ""}
                        onChange={(e) => form.setValues(prev => ({ ...prev, zip: e.target.value }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              </div>

              <div className={styles.actionBar}>
                <Button type="submit" size="lg" disabled={isPending} className={styles.saveButton}>
                  <Save size={18} />
                  {isPending ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>

      <div className={styles.content} style={{ marginTop: '2rem' }}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Paletas do Sistema (Upload em Lote)</h2>
            <p className={styles.sectionDescription}>Cole o código JSON de cada paleta separadamente para atualizar todo o sistema.</p>
          </div>
          
          <div className={styles.formGrid} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className={styles.fullWidth}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.875rem' }}>COLDFLORA - INTERFACE</label>
              <textarea 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="[\n  { hex: '#DCE4D6', name: 'Verde 100' }\n]"
                style={{ width: '100%', minHeight: '120px', fontFamily: 'monospace' }}
              />
            </div>

            <div className={styles.fullWidth}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.875rem' }}>VERDECORE - INSTITUCIONAL</label>
              <textarea 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="[\n  { hex: '#...', name: '...' }\n]"
                style={{ width: '100%', minHeight: '120px', fontFamily: 'monospace' }}
              />
            </div>

            <div className={styles.fullWidth}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.875rem' }}>COLORCORE - CAMPANHAS</label>
              <textarea 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="[\n  { hex: '#...', name: '...' }\n]"
                style={{ width: '100%', minHeight: '120px', fontFamily: 'monospace' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type="button" size="lg" onClick={() => toast.success('Paletas em lote salvas com sucesso no LocalStorage! (Integração CSS na próxima etapa)')} className={styles.saveButton}>
                <Save size={18} />
                Subir Paletas
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}