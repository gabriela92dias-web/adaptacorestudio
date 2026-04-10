import React from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText, FileEdit, IdCard, FileSignature, Award, FileDown, Info,
  Layers, Mail, MonitorPlay, Presentation
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/Tabs";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { useDocumentGenerator } from "../helpers/useDocumentGenerator";
import { useBrand } from "../helpers/useApi";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import styles from "./documentos-corporativos.module.css";

const PAPELARIA_TEMPLATES = [
  { id: 1, name: "Papel Timbrado Oficial", format: "Formato A4", desc: "Papel timbrado padrão com cabeçalho e rodapé da marca.", shapeClass: styles.shapeA4, orientation: "Retrato", generatorKey: "generatePapelTimbrado" as const },
  { id: 2, name: "Relatório Corporativo", format: "Formato A4", desc: "Capa e estrutura padrão para relatórios e documentos extensos.", shapeClass: styles.shapeDocument, orientation: "Retrato", generatorKey: "generateCapaRelatorio" as const },
  { id: 3, name: "Contrato de Prestação de Serviço", format: "Formato A4", desc: "Modelo jurídico completo para prestação de serviços a terceiros.", shapeClass: styles.shapeDocument, orientation: "Retrato", generatorKey: "generateContratoPrestacao" as const },
  { id: 4, name: "Certificado de Conclusão", format: "Paisagem", desc: "Design clássico com moldura para cursos e treinamentos.", shapeClass: styles.shapeCertLandscape, orientation: "Paisagem", generatorKey: "generateCertificadoConclusao" as const },
];

const CARTOES_TEMPLATES = [
  { id: 1, name: "Cartão Clássico Horizontal", dims: "90x50mm", desc: "Layout tradicional frente e verso com dados de contato.", shapeClass: styles.shapeCardHorizontal, generatorKey: "generateCartaoHorizontal" as const },
  { id: 2, name: "Cartão Moderno Vertical", dims: "50x90mm", desc: "Design minimalista e elegante em orientação vertical.", shapeClass: styles.shapeCardVertical, generatorKey: "generateCartaoVertical" as const },
  { id: 3, name: "Cartão Premium Quadrado", dims: "65x65mm", desc: "Formato diferenciado para destaque e memorabilidade.", shapeClass: styles.shapeCardSquare, generatorKey: "generateCartaoQuadrado" as const },
  { id: 4, name: "Cartão Digital (vCard)", dims: "Digital", desc: "Cartão otimizado para smartphones, compartilhável por link.", shapeClass: styles.shapeCardDigital, generatorKey: "generateCartaoDigital" as const },
];

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

type GeneratorKey = typeof PAPELARIA_TEMPLATES[number]["generatorKey"] | typeof CARTOES_TEMPLATES[number]["generatorKey"] | typeof CONTRATOS_TEMPLATES[number]["generatorKey"] | typeof CERTIFICADOS_TEMPLATES[number]["generatorKey"];

export default function DocumentosCorporativos() {
  const navigate = useNavigate();
  const { ref, level, className: adaptiveClass } = useAdaptiveLevel();
  const generators = useDocumentGenerator();
  const { data: brandResponse } = useBrand();

  const handleGeneratePdf = (key: GeneratorKey, docName?: string) => {
    try {
      const generator = generators[key];
      if (generator) {
        generator(brandResponse?.brand);
        toast.success("Documento gerado com sucesso!", {
          description: "Deseja salvar este documento na Biblioteca Oficial?",
          action: {
            label: "Adicionar à Biblioteca",
            onClick: () => {
              // Navega para a Biblioteca com contexto de upload
              window.location.href = "/marketing-comunicacao";
              toast.info("Abra a Biblioteca e faça o upload do arquivo gerado.");
            },
          },
          duration: 8000,
        });
      } else {
        toast.error("Gerador não encontrado para este template.");
      }
    } catch (error) {
      console.error("Erro ao gerar PDF", error);
      toast.error("Ocorreu um erro ao gerar o documento.");
    }
  };

  const handleUseTemplate = () => {
    toast.success("Template selecionado! Em breve estará disponível para edição.");
  };

  return (
    <div ref={ref} className={`${styles.pageContainer} ${adaptiveClass} ${styles[`level${level}`]}`}>
      <Helmet>
        <title>Documentos | Adapta Studio</title>
      </Helmet>

      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.iconContainer}>
            <FileText size={32} />
          </div>
          <div>
            <h1 className={styles.title}>Documentos</h1>
            <p className={styles.subtitle}>
              Crie e gerencie documentos corporativos, templates de comunicação e materiais de marketing.
            </p>
          </div>
        </div>

        <div className={styles.banner}>
          <Info size={16} className={styles.bannerIcon} />
          <span>
            Os documentos são gerados com os dados da marca configurados em{" "}
            <Link to="/configuracoes" className={styles.bannerLink}>Configurações</Link>.
          </span>
        </div>

        <div className={styles.statsBar}>
          <span>35+ Templates</span>
          <span className={styles.statsDot}>·</span>
          <span>8 Categorias</span>
          <span className={styles.statsDot}>·</span>
          <span>Formatos A4, Digital, Social e Anúncios</span>
        </div>
      </div>

      <div className={styles.content}>
        <Tabs defaultValue="geradores">
          <TabsList className={styles.tabsList}>
            <TabsTrigger value="geradores" className={styles.tabTrigger}>
              <Award size={16} className={styles.tabIcon} />
              Gerar doc
            </TabsTrigger>
            <TabsTrigger value="papelaria" className={styles.tabTrigger}>
              <FileEdit size={16} className={styles.tabIcon} />
              Papelaria
            </TabsTrigger>
            <TabsTrigger value="cartoes" className={styles.tabTrigger}>
              <IdCard size={16} className={styles.tabIcon} />
              Cartões de Visita
            </TabsTrigger>
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
          </TabsList>

          {/* ── GERAR DOC ── */}
          <TabsContent value="geradores" className={styles.tabContent}>
            <div className={styles.grid}>
              <div className={styles.card}>
                <div className={styles.previewContainer}>
                  <div className={`${styles.previewShape} ${styles.shapeDigital} ${styles.shapeDigitalBorder}`}>
                    <div className={styles.previewInnerText}>🖥️ Apresentação</div>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <Badge variant="secondary" className={styles.formatBadge}>Tela (16:9)</Badge>
                  </div>
                  <h3 className={styles.cardTitle}>Construtor de Slides</h3>
                  <p className={styles.cardDescription}>Crie apresentações profissionais e interativas gerando blocos de slides.</p>
                  <Link to="/tools/gerar-doc/slide-padrao" className={styles.btnFullWidth}>
                    <Button variant="primary" className={`${styles.actionButton} ${styles.btnFullWidthMt}`}>Começar a Construir</Button>
                  </Link>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.previewContainer}>
                  <div className={`${styles.previewShape} ${styles.shapeDigital} ${styles.shapeDigitalBorder}`}>
                    <div className={styles.previewInnerText}>⚙️ Gerador Dinâmico</div>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <Badge variant="secondary" className={styles.formatBadge}>Digital</Badge>
                  </div>
                  <h3 className={styles.cardTitle}>Assinatura de E-mail</h3>
                  <p className={styles.cardDescription}>Gerador HTML interativo com a identidade corporativa.</p>
                  <Link to="/tools/documentos" className={styles.btnFullWidth}>
                    <Button variant="primary" className={`${styles.actionButton} ${styles.btnFullWidthMt}`}>Acessar Gerador</Button>
                  </Link>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.previewContainer}>
                  <div className={`${styles.previewShape} ${styles.shapeDigital} ${styles.shapeDigitalAvatar}`}>
                    <div className={styles.previewInnerText}>⚙️ Avatar</div>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <Badge variant="secondary" className={styles.formatBadge}>Digital</Badge>
                  </div>
                  <h3 className={styles.cardTitle}>Foto de Perfil Corporativa</h3>
                  <p className={styles.cardDescription}>Crie avatares padronizados para o time.</p>
                  <Link to="/tools/visual" className={styles.btnFullWidth}>
                    <Button variant="primary" className={`${styles.actionButton} ${styles.btnFullWidthMt}`}>Personalizar</Button>
                  </Link>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.previewContainer}>
                  <div className={`${styles.previewShape} ${styles.shapeDigital} ${styles.shapeDigitalBorder}`}>
                    <div className={styles.previewInnerText}>⚙️ Embalagens 3D</div>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <Badge variant="secondary" className={styles.formatBadge}>Design & Print</Badge>
                  </div>
                  <h3 className={styles.cardTitle}>Produtos & Embalagens</h3>
                  <p className={styles.cardDescription}>Design de rótulos 3D, caixas e exportação de pedidos.</p>
                  <Link to="/tools/produtos" className={styles.btnFullWidth}>
                    <Button variant="primary" className={`${styles.actionButton} ${styles.btnFullWidthMt}`}>Abrir Ferramenta</Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── PAPELARIA ── */}
          <TabsContent value="papelaria" className={styles.tabContent}>
            <div className={styles.grid}>
              {PAPELARIA_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className={styles.card}>
                  <div className={styles.previewContainer}>
                    <div className={`${styles.previewShape} ${tpl.shapeClass}`}>
                      {tpl.shapeClass === styles.shapeA4 && (
                        <>
                          <div className={`${styles.skelLine} ${styles.skelLineHM}`} />
                          <div className={styles.skelLine} />
                          <div className={styles.skelLine} />
                          <div className={`${styles.skelLine} ${styles.short}`} />
                        </>
                      )}
                      {tpl.shapeClass === styles.shapeDocument && (
                        <>
                          <div className={`${styles.skelLine} ${styles.skelLineW70MB}`} />
                          <div className={styles.skelLine} />
                          <div className={styles.skelLine} />
                          <div className={styles.skelLine} />
                          <div className={`${styles.skelLine} ${styles.short}`} />
                          <div className={`${styles.skelLine} ${styles.skelMT12}`} />
                          <div className={styles.skelLine} />
                          <div className={`${styles.skelLine} ${styles.short}`} />
                        </>
                      )}
                      {tpl.shapeClass === styles.shapeCertLandscape && (
                        <div className={styles.flexCenterColW100}>
                          <div className={`${styles.skelLine} ${styles.skelLineW50MB}`} />
                          <div className={`${styles.skelLine} ${styles.skelLineW80}`} />
                          <div className={`${styles.skelLine} ${styles.skelLineW80}`} />
                          <div className={`${styles.skelLine} ${styles.skelLineW60}`} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <Badge variant="secondary" className={styles.formatBadge}>{tpl.orientation}</Badge>
                      <span className={styles.dimensionsText}>{tpl.format}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{tpl.name}</h3>
                    <p className={styles.cardDescription}>{tpl.desc}</p>
                    <Button variant="outline" className={styles.actionButton} onClick={() => handleGeneratePdf(tpl.generatorKey)}>
                      <FileDown size={16} />
                      Gerar PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ── CARTÕES ── */}
          <TabsContent value="cartoes" className={styles.tabContent}>
            <div className={styles.grid}>
              {CARTOES_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className={styles.card}>
                  <div className={styles.previewContainer}>
                    <div className={`${styles.previewShape} ${tpl.shapeClass}`}>
                      {tpl.shapeClass !== styles.shapeCardDigital && (
                        <>
                          <div className={`${styles.skelLine} ${styles.skelLineW40}`} />
                          <div className={`${styles.skelLine} ${styles.skelLineW20}`} />
                          <div className={`${styles.skelLine} ${styles.skelLineW30}`} />
                          <div className={`${styles.skelLine} ${styles.skelLineW30}`} />
                        </>
                      )}
                      {tpl.shapeClass === styles.shapeCardDigital && (
                        <div className={styles.flexCenterCol}>
                          <div className={styles.skelAvatar} />
                          <div className={`${styles.skelLine} ${styles.skelLineW80}`} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <span className={styles.dimensionsText}>{tpl.dims}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{tpl.name}</h3>
                    <p className={styles.cardDescription}>{tpl.desc}</p>
                    <Button variant="outline" className={styles.actionButton} onClick={() => handleGeneratePdf(tpl.generatorKey)}>
                      <FileDown size={16} />
                      Gerar PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ── REDES SOCIAIS ── */}
          <TabsContent value="redes-sociais" className={styles.tabContent}>
            <div className={styles.grid}>
              {SOCIAL_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className={styles.card}>
                  <div className={styles.previewContainer}>
                    <div className={styles.aspectPreview} style={{ aspectRatio: tpl.ratio }} />
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <Badge variant="secondary" className={styles.platformBadge}>{tpl.platform}</Badge>
                      <span className={styles.dimensionsText}>{tpl.dims}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{tpl.name}</h3>
                    <Button variant="outline" className={styles.actionButton} onClick={handleUseTemplate}>
                      Usar Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ── E-MAIL MARKETING ── */}
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
                    <Button variant="outline" className={styles.actionButton} onClick={handleUseTemplate}>
                      Personalizar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ── ANÚNCIOS ── */}
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
                    <Button variant="outline" className={styles.actionButton} onClick={handleUseTemplate}>
                      Criar Anúncio
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