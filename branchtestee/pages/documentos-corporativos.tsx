import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FileText, FileEdit, IdCard, FileSignature, Award, FileDown, Info } from "lucide-react";
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
  { id: 2, name: "Envelope Corporativo", format: "DL (220x110mm)", desc: "Envelope padrão para correspondências institucionais.", shapeClass: styles.shapeEnvelope, orientation: "Paisagem", generatorKey: "generateEnvelope" as const },
  { id: 3, name: "Pasta de Apresentação", format: "A4 Dobrado", desc: "Pasta com bolsa interna para entrega de documentos e propostas.", shapeClass: styles.shapeFolder, orientation: "Retrato", generatorKey: "generatePastaApresentacao" as const },
  { id: 4, name: "Bloco de Notas", format: "Formato A5", desc: "Bloco de anotações com pauta e marca d'água.", shapeClass: styles.shapeNotepad, orientation: "Retrato", generatorKey: "generateBlocoNotas" as const },
  { id: 5, name: "Capa de Relatório", format: "Formato A4", desc: "Capa padrão para relatórios e documentos extensos.", shapeClass: styles.shapeA4Cover, orientation: "Retrato", generatorKey: "generateCapaRelatorio" as const },
];

const CARTOES_TEMPLATES = [
  { id: 1, name: "Cartão Clássico Horizontal", dims: "90x50mm", desc: "Layout tradicional frente e verso com dados de contato.", shapeClass: styles.shapeCardHorizontal, generatorKey: "generateCartaoHorizontal" as const },
  { id: 2, name: "Cartão Moderno Vertical", dims: "50x90mm", desc: "Design minimalista e elegante em orientação vertical.", shapeClass: styles.shapeCardVertical, generatorKey: "generateCartaoVertical" as const },
  { id: 3, name: "Cartão Premium Quadrado", dims: "65x65mm", desc: "Formato diferenciado para destaque e memorabilidade.", shapeClass: styles.shapeCardSquare, generatorKey: "generateCartaoQuadrado" as const },
  { id: 4, name: "Cartão Digital (vCard)", dims: "Digital", desc: "Cartão otimizado para smartphones, compartilhável por link.", shapeClass: styles.shapeCardDigital, generatorKey: "generateCartaoDigital" as const },
];

const CONTRATOS_TEMPLATES = [
  { id: 1, name: "Contrato de Prestação de Serviço", pages: "6 páginas", desc: "Modelo jurídico completo para prestação de serviços a terceiros.", generatorKey: "generateContratoPrestacao" as const },
  { id: 2, name: "Proposta Comercial", pages: "4 páginas", desc: "Estrutura persuasiva para apresentação de escopo e valores.", generatorKey: "generatePropostaComercial" as const },
  { id: 3, name: "Termo de Confidencialidade (NDA)", pages: "3 páginas", desc: "Documento padrão para proteção de informações sigilosas.", generatorKey: "generateNDA" as const },
  { id: 4, name: "Ordem de Serviço", pages: "2 páginas", desc: "Formulário operacional para registro e autorização de demandas.", generatorKey: "generateOrdemServico" as const },
  { id: 5, name: "Briefing de Projeto", pages: "3 páginas", desc: "Questionário estruturado para coleta de requisitos e kickoff.", generatorKey: "generateBriefing" as const },
];

const CERTIFICADOS_TEMPLATES = [
  { id: 1, name: "Certificado de Conclusão", orient: "Paisagem", desc: "Design clássico com moldura para cursos e treinamentos.", shapeClass: styles.shapeCertLandscape, generatorKey: "generateCertificadoConclusao" as const },
  { id: 2, name: "Certificado de Participação", orient: "Paisagem", desc: "Modelo dinâmico para workshops e eventos corporativos.", shapeClass: styles.shapeCertLandscape, generatorKey: "generateCertificadoParticipacao" as const },
  { id: 3, name: "Diploma de Excelência", orient: "Paisagem", desc: "Layout premium para reconhecimento e premiações.", shapeClass: styles.shapeCertLandscape, generatorKey: "generateDiplomaExcelencia" as const },
  { id: 4, name: "Declaração Institucional", orient: "Retrato", desc: "Documento oficial simples para comprovações diversas.", shapeClass: styles.shapeA4, generatorKey: "generateDeclaracaoInstitucional" as const },
];

type GeneratorKey = typeof PAPELARIA_TEMPLATES[number]["generatorKey"] | typeof CARTOES_TEMPLATES[number]["generatorKey"] | typeof CONTRATOS_TEMPLATES[number]["generatorKey"] | typeof CERTIFICADOS_TEMPLATES[number]["generatorKey"];

export default function DocumentosCorporativos() {
  const { ref, level, className: adaptiveClass } = useAdaptiveLevel();
  const generators = useDocumentGenerator();
  const { data: brandResponse } = useBrand();

  const handleGeneratePdf = (key: GeneratorKey) => {
    try {
      const generator = generators[key];
      if (generator) {
        generator(brandResponse?.brand);
        toast.success("Documento gerado com sucesso!");
      } else {
        toast.error("Gerador não encontrado para este template.");
      }
    } catch (error) {
      console.error("Erro ao gerar PDF", error);
      toast.error("Ocorreu um erro ao gerar o documento.");
    }
  };

  return (
    <div ref={ref} className={`${styles.pageContainer} ${adaptiveClass} ${styles[`level${level}`]}`}>
      <Helmet>
        <title>Documentos Corporativos | Adapta Studio</title>
      </Helmet>

      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.iconContainer}>
            <FileText size={32} />
          </div>
          <div>
            <h1 className={styles.title}>Documentos Corporativos</h1>
            <p className={styles.subtitle}>
              Crie papéis timbrados, cartões de visita, apresentações e documentos institucionais.
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
          <span>18 Templates</span>
          <span className={styles.statsDot}>·</span>
          <span>4 Categorias</span>
          <span className={styles.statsDot}>·</span>
          <span>Formatos A4, Cartão e Digital</span>
        </div>
      </div>

      <div className={styles.content}>
        <Tabs defaultValue="papelaria">
          <TabsList className={styles.tabsList}>
            <TabsTrigger value="geradores" className={styles.tabTrigger}>
              <Award size={16} className={styles.tabIcon} />
              Geradores & Especiais
            </TabsTrigger>
            <TabsTrigger value="papelaria" className={styles.tabTrigger}>
              <FileEdit size={16} className={styles.tabIcon} />
              Papelaria
            </TabsTrigger>
            <TabsTrigger value="cartoes" className={styles.tabTrigger}>
              <IdCard size={16} className={styles.tabIcon} />
              Cartões de Visita
            </TabsTrigger>
            <TabsTrigger value="contratos" className={styles.tabTrigger}>
              <FileSignature size={16} className={styles.tabIcon} />
              Contratos & Propostas
            </TabsTrigger>
            <TabsTrigger value="certificados" className={styles.tabTrigger}>
              <Award size={16} className={styles.tabIcon} />
              Certificados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="geradores" className={styles.tabContent}>
            <div className={styles.grid}>
              {/* Card - Assinatura de Email */}
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
                    <Button variant="default" className={`${styles.actionButton} ${styles.btnFullWidthMt}`}>Acessar Gerador</Button>
                  </Link>
                </div>
              </div>

              {/* Card - Foto de Perfil */}
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
                    <Button variant="default" className={`${styles.actionButton} ${styles.btnFullWidthMt}`}>Personalizar</Button>
                  </Link>
                </div>
              </div>

              {/* Card - Produtos e Embalagens */}
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
                    <Button variant="default" className={`${styles.actionButton} ${styles.btnFullWidthMt}`}>Abrir Ferramenta</Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

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
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <Badge variant="secondary" className={styles.formatBadge}>
                        {tpl.orientation}
                      </Badge>
                      <span className={styles.dimensionsText}>{tpl.format}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{tpl.name}</h3>
                    <p className={styles.cardDescription}>{tpl.desc}</p>
                    <Button
                      variant="outline"
                      className={styles.actionButton}
                      onClick={() => handleGeneratePdf(tpl.generatorKey)}
                    >
                      <FileDown size={16} />
                      Gerar PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

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
                    <Button
                      variant="outline"
                      className={styles.actionButton}
                      onClick={() => handleGeneratePdf(tpl.generatorKey)}
                    >
                      <FileDown size={16} />
                      Gerar PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contratos" className={styles.tabContent}>
            <div className={styles.grid}>
              {CONTRATOS_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className={styles.card}>
                  <div className={styles.previewContainer}>
                    <div className={`${styles.previewShape} ${styles.shapeDocument}`}>
                      <div className={`${styles.skelLine} ${styles.skelLineW70MB}`} />
                      <div className={styles.skelLine} />
                      <div className={styles.skelLine} />
                      <div className={styles.skelLine} />
                      <div className={`${styles.skelLine} ${styles.short}`} />
                      
                      <div className={`${styles.skelLine} ${styles.skelMT12}`} />
                      <div className={styles.skelLine} />
                      <div className={`${styles.skelLine} ${styles.short}`} />
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <Badge variant="outline">{tpl.pages}</Badge>
                      <span className={styles.dimensionsText}>A4</span>
                    </div>
                    <h3 className={styles.cardTitle}>{tpl.name}</h3>
                    <p className={styles.cardDescription}>{tpl.desc}</p>
                    <Button
                      variant="outline"
                      className={styles.actionButton}
                      onClick={() => handleGeneratePdf(tpl.generatorKey)}
                    >
                      <FileDown size={16} />
                      Gerar PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certificados" className={styles.tabContent}>
            <div className={styles.grid}>
              {CERTIFICADOS_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className={styles.card}>
                  <div className={styles.previewContainer}>
                    <div className={`${styles.previewShape} ${tpl.shapeClass}`}>
                      {tpl.shapeClass === styles.shapeA4 && (
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
                      <Badge variant="secondary" className={styles.formatBadge}>
                        {tpl.orient}
                      </Badge>
                    </div>
                    <h3 className={styles.cardTitle}>{tpl.name}</h3>
                    <p className={styles.cardDescription}>{tpl.desc}</p>
                    <Button
                      variant="outline"
                      className={styles.actionButton}
                      onClick={() => handleGeneratePdf(tpl.generatorKey)}
                    >
                      <FileDown size={16} />
                      Gerar PDF
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