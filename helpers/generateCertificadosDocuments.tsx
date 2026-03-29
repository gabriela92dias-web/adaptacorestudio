import { BrandData, getBrandConfig, getBaseStyles, openPdf } from "./pdfUtils";

export const generateCertificadoConclusao = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const docDefinition: any = {
    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [40, 40, 40, 40],
    background: function () {
      return {
        canvas: [
          { type: "rect", x: 20, y: 20, w: 841.89 - 40, h: 595.28 - 40, lineWidth: 8, lineColor: config.primaryColor }
        ]
      };
    },
    content: [
      { text: config.companyName.toUpperCase(), fontSize: 16, color: config.secondaryColor, alignment: "center", margin: [0, 60, 0, 40] },
      { text: "CERTIFICADO DE CONCLUSÃO", fontSize: 40, bold: true, color: config.primaryColor, alignment: "center", margin: [0, 0, 0, 40] },
      { text: "Certificamos para os devidos fins que", fontSize: 18, alignment: "center", margin: [0, 0, 0, 20] },
      { text: "[ NOME DO PARTICIPANTE ]", fontSize: 28, bold: true, alignment: "center", margin: [0, 0, 0, 20] },
      { text: "concluiu com êxito o treinamento/curso específico, com carga horária de XX horas.", fontSize: 16, alignment: "center", margin: [0, 0, 0, 60] },
      {
        columns: [
          { stack: [{ text: "________________________________", alignment: "center" }, { text: "Coordenador / Instrutor", alignment: "center", fontSize: 12 }] },
          { stack: [{ text: "________________________________", alignment: "center" }, { text: config.contact, alignment: "center", fontSize: 12, bold: true }] },
        ]
      }
    ],
  };
  openPdf(docDefinition, "certificado-de-conclusao.pdf");
};

export const generateCertificadoParticipacao = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const docDefinition: any = {
    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [40, 40, 40, 40],
    background: function () {
      return {
        canvas: [
          { type: "rect", x: 30, y: 30, w: 841.89 - 60, h: 595.28 - 60, lineWidth: 2, lineColor: config.secondaryColor }
        ]
      };
    },
    content: [
      { text: "CERTIFICADO DE PARTICIPAÇÃO", fontSize: 36, bold: true, color: config.primaryColor, alignment: "center", margin: [0, 80, 0, 40] },
      { text: "Atestamos que", fontSize: 18, alignment: "center", margin: [0, 0, 0, 20] },
      { text: "[ NOME DO PARTICIPANTE ]", fontSize: 26, bold: true, alignment: "center", margin: [0, 0, 0, 20] },
      { text: `participou ativamente do evento promovido por ${config.companyName}, demonstrando engajamento e interesse.`, fontSize: 16, alignment: "center", margin: [0, 0, 0, 60] },
      { text: `São Paulo, ${new Intl.DateTimeFormat("pt-BR").format(new Date())}`, alignment: "center", fontSize: 14, margin: [0, 0, 0, 60] },
      { stack: [{ text: "________________________________", alignment: "center" }, { text: config.companyName, alignment: "center", fontSize: 12, bold: true }] }
    ],
  };
  openPdf(docDefinition, "certificado-de-participacao.pdf");
};

export const generateDiplomaExcelencia = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const docDefinition: any = {
    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [50, 50, 50, 50],
    background: function () {
      return {
        canvas: [
          { type: "rect", x: 15, y: 15, w: 841.89 - 30, h: 595.28 - 30, lineWidth: 10, lineColor: "#111111" },
          { type: "rect", x: 25, y: 25, w: 841.89 - 50, h: 595.28 - 50, lineWidth: 1, lineColor: "#666666" }
        ]
      };
    },
    content: [
      { text: "DIPLOMA DE EXCELÊNCIA", fontSize: 44, bold: true, color: "#111111", alignment: "center", margin: [0, 60, 0, 30] },
      { text: "Conferido a", fontSize: 20, alignment: "center", margin: [0, 0, 0, 20] },
      { text: "[ NOME DO PROFISSIONAL ]", fontSize: 32, bold: true, alignment: "center", margin: [0, 0, 0, 30] },
      { text: `Pelo notável desempenho, dedicação e resultados excepcionais entregues à ${config.companyName}.`, fontSize: 18, alignment: "center", margin: [0, 0, 0, 60] },
      {
        columns: [
          { text: `Emitido em: ${new Intl.DateTimeFormat("pt-BR").format(new Date())}`, alignment: "left", fontSize: 14, margin: [40, 20, 0, 0] },
          { stack: [{ text: "________________________________", alignment: "right" }, { text: "Diretoria", alignment: "right", fontSize: 14, bold: true }], margin: [0, 0, 40, 0] },
        ]
      }
    ],
  };
  openPdf(docDefinition, "diploma-de-excelencia.pdf");
};

export const generateDeclaracaoInstitucional = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const styles = getBaseStyles(config.primaryColor, config.secondaryColor);
  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [50, 80, 50, 80],
    styles,
    content: [
      { text: config.companyName, fontSize: 16, bold: true, color: config.primaryColor, alignment: "center", margin: [0, 0, 0, 50] },
      { text: "DECLARAÇÃO INSTITUCIONAL", style: "title" },
      { text: "Declaramos para os devidos fins que [ NOME DO COLABORADOR OU PARCEIRO ], inscrito no CPF sob o nº [ 000.000.000-00 ], possui vínculo ativo com a nossa instituição na qualidade de [ Cargo/Função ], desde [ Data de Início ].", style: "bodyText", fontSize: 12, margin: [0, 40, 0, 20] },
      { text: "Esta declaração é emitida a pedido do interessado, para que produza seus efeitos legais e de direito.", style: "bodyText", fontSize: 12 },
      { text: `\n\nSão Paulo, ${new Intl.DateTimeFormat("pt-BR").format(new Date())}.\n\n\n\n`, style: "bodyText", fontSize: 12, alignment: "center" },
      { stack: [{ text: "________________________________", alignment: "center" }, { text: config.contact, alignment: "center", bold: true }, { text: config.role, alignment: "center", color: config.secondaryColor }] },
    ],
  };
  openPdf(docDefinition, "declaracao-institucional.pdf");
};