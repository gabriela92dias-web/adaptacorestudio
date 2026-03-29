import { BrandData, getBrandConfig, getBaseStyles, openPdf } from "./pdfUtils";

export const generatePapelTimbrado = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const styles = getBaseStyles(config.primaryColor, config.secondaryColor);
  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [40, 120, 40, 80],
    header: {
      margin: [40, 40, 40, 0],
      columns: [
        { text: "+AD", fontSize: 24, bold: true, color: config.primaryColor, width: 80 },
        {
          stack: [
            { text: config.companyName, bold: true, fontSize: 12, alignment: "right", color: config.primaryColor },
            { text: config.address, fontSize: 8, alignment: "right", color: config.secondaryColor },
            { text: `${config.phone} | ${config.email}`, fontSize: 8, alignment: "right", color: config.secondaryColor },
          ],
        },
      ],
    },
    content: [
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: config.primaryColor }] },
      { text: "\n\nSão Paulo, 10 de Outubro de 2024.\n\n", style: "bodyText" },
      { text: "Assunto: Referência Comercial\n\n", style: "subheader" },
      { text: "Prezado(a) Senhor(a),\n\n", style: "bodyText" },
      { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n", style: "bodyText" },
      { text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n", style: "bodyText" },
      { text: "Atenciosamente,\n\n", style: "bodyText" },
      { text: "____________________________________\n", margin: [0, 40, 0, 0] },
      { text: config.contact, bold: true, fontSize: 10 },
      { text: config.role, fontSize: 9, color: config.secondaryColor },
    ],
    footer: {
      margin: [40, 20, 40, 20],
      stack: [
        { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: "#cccccc" }] },
        { text: `\n${config.website}  |  ${config.companyName}`, style: "footerText" },
      ],
    },
    styles,
  };
  openPdf(docDefinition, "papel-timbrado.pdf");
};

export const generateEnvelope = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const docDefinition: any = {
    pageSize: { width: 623.6, height: 311.8 }, // DL Envelope points
    pageMargins: [30, 30, 30, 30],
    content: [
      {
        stack: [
          { text: config.companyName, fontSize: 14, bold: true, color: config.primaryColor },
          { text: config.address, fontSize: 10, color: config.secondaryColor },
          { text: config.website, fontSize: 10, color: config.secondaryColor },
        ],
        absolutePosition: { x: 30, y: 30 },
      },
      {
        stack: [
          { text: "A/C: Nome do Destinatário", fontSize: 14, bold: true },
          { text: "Endereço do Destinatário, 123", fontSize: 12 },
          { text: "Bairro, Cidade - Estado", fontSize: 12 },
          { text: "CEP: 00000-000", fontSize: 12 },
        ],
        absolutePosition: { x: 300, y: 150 },
      },
    ],
  };
  openPdf(docDefinition, "envelope.pdf");
};

export const generatePastaApresentacao = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    background: function () {
      return {
        canvas: [{ type: "rect", x: 0, y: 0, w: 595.28, h: 841.89, color: "#f8f9fa" }],
      };
    },
    content: [
      {
        stack: [
          { text: "+AD", fontSize: 40, bold: true, color: config.primaryColor, alignment: "center" },
          { text: config.companyName.toUpperCase(), fontSize: 28, bold: true, color: config.primaryColor, alignment: "center", margin: [0, 20, 0, 10] },
          { text: "Apresentação Institucional", fontSize: 16, color: config.secondaryColor, alignment: "center" },
        ],
        margin: [0, 250, 0, 0],
      },
      {
        stack: [
          { canvas: [{ type: "line", x1: 200, y1: 0, x2: 315, y2: 0, lineWidth: 2, lineColor: config.primaryColor }], alignment: "center", margin: [0, 0, 0, 10] },
          { text: `${config.website} | ${config.phone}`, fontSize: 10, alignment: "center", color: config.secondaryColor },
          { text: config.address, fontSize: 9, alignment: "center", color: config.secondaryColor },
        ],
        absolutePosition: { x: 40, y: 750 },
      },
    ],
  };
  openPdf(docDefinition, "pasta-de-apresentacao.pdf");
};

export const generateBlocoNotas = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const lines = Array.from({ length: 22 }).map(() => ({
    canvas: [{ type: "line", x1: 0, y1: 0, x2: 340, y2: 0, lineWidth: 0.5, lineColor: "#dddddd" }],
    margin: [0, 20, 0, 0] as [number, number, number, number],
  }));

  const docDefinition: any = {
    pageSize: "A5",
    pageMargins: [40, 40, 40, 40],
    content: [
      {
        columns: [
          { text: config.companyName, fontSize: 12, bold: true, color: config.primaryColor },
          { text: "Data: ___/___/_____", fontSize: 10, alignment: "right", color: config.secondaryColor },
        ],
        margin: [0, 0, 0, 20],
      },
      ...lines,
      {
        text: config.website,
        fontSize: 8,
        alignment: "center",
        color: config.secondaryColor,
        absolutePosition: { x: 40, y: 560 },
      },
    ],
  };
  openPdf(docDefinition, "bloco-de-notas.pdf");
};

export const generateCapaRelatorio = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [50, 50, 50, 50],
    content: [
      { text: config.companyName, fontSize: 16, bold: true, color: config.primaryColor, alignment: "right" },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 495, y2: 0, lineWidth: 4, lineColor: config.primaryColor }], margin: [0, 250, 0, 20] },
      { text: "RELATÓRIO EXECUTIVO", fontSize: 36, bold: true, color: config.primaryColor },
      { text: "Análise de Resultados e Planejamento Estratégico", fontSize: 14, color: config.secondaryColor, margin: [0, 10, 0, 0] },
      {
        stack: [
          { text: `Preparado por: ${config.contact}`, fontSize: 12 },
          { text: `Data: ${new Intl.DateTimeFormat("pt-BR").format(new Date())}`, fontSize: 12 },
        ],
        absolutePosition: { x: 50, y: 700 },
      },
    ],
  };
  openPdf(docDefinition, "capa-de-relatorio.pdf");
};