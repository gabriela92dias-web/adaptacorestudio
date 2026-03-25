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
  const { data: brandData, isLoading } = useBrand();
  const { mutateAsync: updateBrand, isPending } = useUpdateBrand();

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
    } catch (error) {
      toast.error("Erro ao salvar configurações.");
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
    </div>
  );
}