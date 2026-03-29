import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Megaphone, Layers, Mail, MonitorPlay, Presentation, FileText } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/Tabs";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import styles from "./marketing-comunicacao.module.css";

const SOCIAL_TEMPLATES = [
  { id: 1, name: "Post Institucional", platform: "Instagram", dims: "1080x1080", ratio: "1/1" },
  { id: 2, name: "Carrossel de Produto", platform: "Instagram", dims: "1080x1080", ratio: "1/1" },
  { id: 3, name: "Story Promocional", platform: "Instagram", dims: "1080x1920", ratio: "9/16" },
  { id: 4, name: "Post de Engajamento", platform: "Facebook", dims: "1080x1080", ratio: "1/1" },
  { id: 5, name: "Reels Cover", platform: "Instagram", dims: "1080x1920", ratio: "9/16" },
  { id: 6, name: "Capa LinkedIn", platform: "LinkedIn", dims: "1584x396", ratio: "4/1" },
];

const EMAIL_TEMPLATES = [
  { id: 1, name: "Newsletter Mensal", desc: "Template para atualizações mensais com seções de notícias e destaques." },
  { id: 2, name: "Lançamento de Produto", desc: "Layout focado em conversão para novos produtos." },
  { id: 3, name: "Boas-Vindas", desc: "Sequência inicial para novos assinantes ou clientes." },
  { id: 4, name: "Promoção", desc: "E-mail de oferta com destaque para desconto e call-to-action." },
];

const AD_TEMPLATES = [
  { id: 1, name: "Banner Display", dims: "728x90", width: 728, height: 90 },
  { id: 2, name: "Quadrado", dims: "300x300", width: 300, height: 300 },
  { id: 3, name: "Retângulo Médio", dims: "300x250", width: 300, height: 250 },
  { id: 4, name: "Skyscraper", dims: "160x600", width: 160, height: 600 },
  { id: 5, name: "Mobile", dims: "320x50", width: 320, height: 50 },
];

const PRES_TEMPLATES = [
  { id: 1, name: "Pitch Deck Corporativo", slides: 12 },
  { id: 2, name: "Relatório Trimestral", slides: 8 },
  { id: 3, name: "Proposta Comercial", slides: 10 },
];

export default function MarketingComunicacao() {
  const { ref, level, className: adaptiveClass } = useAdaptiveLevel();

  const handleUseTemplate = () => {
    toast.success("Template selecionado! Em breve estará disponível para edição.");
  };

  return (
    <div ref={ref} className={`${styles.pageContainer} ${adaptiveClass} ${styles[`level${level}`]}`}>
      <Helmet>
        <title>Biblioteca Oficial | Adapta Studio</title>
      </Helmet>

      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.iconContainer}>
            <Megaphone size={32} />
          </div>
          <div>
            <h1 className={styles.title}>Biblioteca Oficial</h1>
            <p className={styles.subtitle}>
              Gere posts para redes sociais, e-mail marketing, anúncios e apresentações.
            </p>
          </div>
        </div>

        <div className={styles.statsBar}>
          <span>24 Templates</span>
          <span className={styles.statsDot}>·</span>
          <span>4 Categorias</span>
          <span className={styles.statsDot}>·</span>
          <span>5 Formatos de Anúncio</span>
        </div>
      </div>

      <div className={styles.content}>
        <Tabs defaultValue="redes-sociais">
          <TabsList className={styles.tabsList}>
            <TabsTrigger value="redes-sociais" className={styles.tabTrigger}>
              <Layers size={16} className={styles.tabIcon} />
              Redes Sociais
            </TabsTrigger>
            <TabsTrigger value="email" className={styles.tabTrigger}>
              <Mail size={16} className={styles.tabIcon} />
              E-mail Marketing
            </TabsTrigger>
            <TabsTrigger value="anuncios" className={styles.tabTrigger}>
              <MonitorPlay size={16} className={styles.tabIcon} />
              Anúncios
            </TabsTrigger>
            <TabsTrigger value="apresentacoes" className={styles.tabTrigger}>
              <Presentation size={16} className={styles.tabIcon} />
              Apresentações
            </TabsTrigger>
            <TabsTrigger value="documentos" className={styles.tabTrigger}>
              <FileText size={16} className={styles.tabIcon} />
              Documentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documentos" className={styles.tabContent}>
            <div className={styles.grid}>
              {/* Card - Assinatura de Email */}
              <div className={styles.card}>
                <div className={styles.previewContainer}>
                  <div className={`${styles.previewShape} ${styles.shapeDigital}`} style={{ border: '2px dashed var(--primary)', width: "80%", height: "80%" }}>
                    <div style={{ padding: '20px', textAlign: 'center' }}>⚙️ Gerador Dinâmico</div>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <Badge variant="secondary" className={styles.formatBadge}>Digital</Badge>
                  </div>
                  <h3 className={styles.cardTitle}>Assinatura de E-mail</h3>
                  <p className={styles.cardDescription}>Gerador HTML interativo com a identidade corporativa.</p>
                  <Link to="/tools/documentos" style={{ width: '100%' }}>
                    <Button variant="default" className={styles.actionButton} style={{ width: '100%', marginTop: '1rem' }}>Acessar Gerador</Button>
                  </Link>
                </div>
              </div>

              {/* Card - Foto de Perfil */}
              <div className={styles.card}>
                <div className={styles.previewContainer}>
                  <div className={`${styles.previewShape} ${styles.shapeDigital}`} style={{ border: '2px dashed var(--primary)', borderRadius: '50%', width: "100px", height: "100px" }}>
                    <div style={{ padding: '20px', textAlign: 'center' }}>⚙️ Avatar</div>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <Badge variant="secondary" className={styles.formatBadge}>Digital</Badge>
                  </div>
                  <h3 className={styles.cardTitle}>Foto de Perfil Corporativa</h3>
                  <p className={styles.cardDescription}>Crie avatares padronizados para o time.</p>
                  <Link to="/tools/visual" style={{ width: '100%' }}>
                    <Button variant="default" className={styles.actionButton} style={{ width: '100%', marginTop: '1rem' }}>Personalizar</Button>
                  </Link>
                </div>
              </div>

              {/* Card - Produtos e Embalagens */}
              <div className={styles.card}>
                <div className={styles.previewContainer}>
                  <div className={`${styles.previewShape} ${styles.shapeDigital}`} style={{ border: '2px dashed var(--primary)', width: "80%", height: "80%" }}>
                    <div style={{ padding: '20px', textAlign: 'center' }}>⚙️ Embalagens 3D</div>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <Badge variant="secondary" className={styles.formatBadge}>Design & Print</Badge>
                  </div>
                  <h3 className={styles.cardTitle}>Produtos & Embalagens</h3>
                  <p className={styles.cardDescription}>Design de rótulos 3D, caixas e exportação de pedidos.</p>
                  <Link to="/tools/produtos" style={{ width: '100%' }}>
                    <Button variant="default" className={styles.actionButton} style={{ width: '100%', marginTop: '1rem' }}>Abrir Ferramenta</Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="redes-sociais" className={styles.tabContent}>
            <div className={styles.grid}>
              {SOCIAL_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className={styles.card}>
                  <div className={styles.previewContainer}>
                    <div
                      className={styles.aspectPreview}
                      style={{ aspectRatio: tpl.ratio }}
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <Badge variant="secondary" className={styles.platformBadge}>
                        {tpl.platform}
                      </Badge>
                      <span className={styles.dimensionsText}>{tpl.dims}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{tpl.name}</h3>
                    <Button
                      variant="outline"
                      className={styles.actionButton}
                      onClick={handleUseTemplate}
                    >
                      Usar Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="email" className={styles.tabContent}>
            <div className={styles.grid}>
              {EMAIL_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className={styles.card}>
                  <div className={styles.previewContainer}>
                    <div className={styles.emailPreview}>
                      <div className={styles.emailSkeletonHeader} />
                      <div className={styles.emailSkeletonBody} />
                      <div className={styles.emailSkeletonBodyShort} />
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{tpl.name}</h3>
                    <p className={styles.cardDescription}>{tpl.desc}</p>
                    <Button
                      variant="outline"
                      className={styles.actionButton}
                      onClick={handleUseTemplate}
                    >
                      Personalizar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="anuncios" className={styles.tabContent}>
            <div className={styles.grid}>
              {AD_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className={styles.card}>
                  <div className={styles.previewContainer}>
                    <div
                      className={styles.adPreview}
                      style={{
                        aspectRatio: `${tpl.width}/${tpl.height}`,
                        maxWidth: tpl.width > 200 ? "80%" : "40%",
                        maxHeight: "80%",
                      }}
                    >
                      <span className={styles.adPreviewText}>{tpl.dims}</span>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <span className={styles.dimensionsText}>{tpl.dims}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{tpl.name}</h3>
                    <Button
                      variant="outline"
                      className={styles.actionButton}
                      onClick={handleUseTemplate}
                    >
                      Criar Anúncio
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="apresentacoes" className={styles.tabContent}>
            <div className={styles.grid}>
              {PRES_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className={styles.card}>
                  <div className={styles.previewContainer}>
                    <div className={styles.presentationPreview}>
                      <div className={styles.presSidebar} />
                      <div className={styles.presMain} />
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <Badge variant="outline">{tpl.slides} slides</Badge>
                      <span className={styles.dimensionsText}>16:9</span>
                    </div>
                    <h3 className={styles.cardTitle}>{tpl.name}</h3>
                    <Button
                      variant="outline"
                      className={styles.actionButton}
                      onClick={handleUseTemplate}
                    >
                      Abrir Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}