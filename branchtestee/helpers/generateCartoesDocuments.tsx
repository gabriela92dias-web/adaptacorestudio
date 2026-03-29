import { BrandData, getBrandConfig, openPdf } from "./pdfUtils";

export const generateCartaoHorizontal = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const docDefinition: any = {
    pageSize: { width: 255.1, height: 141.7 }, // 90x50mm
    pageMargins: [15, 15, 15, 15],
    content: [
      { text: config.companyName, fontSize: 14, bold: true, color: config.primaryColor },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 50, y2: 0, lineWidth: 2, lineColor: config.secondaryColor }], margin: [0, 5, 0, 20] },
      {
        stack: [
          { text: config.contact, fontSize: 12, bold: true },
          { text: config.role, fontSize: 8, color: config.secondaryColor, margin: [0, 0, 0, 10] },
          { text: config.phone, fontSize: 7 },
          { text: config.email, fontSize: 7 },
          { text: config.website, fontSize: 7 },
        ],
        alignment: "right",
        margin: [0, 10, 0, 0],
      },
    ],
  };
  openPdf(docDefinition, "cartao-de-visita-horizontal.pdf");
};

export const generateCartaoVertical = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const docDefinition: any = {
    pageSize: { width: 141.7, height: 255.1 }, // 50x90mm
    pageMargins: [15, 15, 15, 15],
    content: [
      { text: config.companyName, fontSize: 12, bold: true, color: config.primaryColor, alignment: "center", margin: [0, 10, 0, 40] },
      { text: config.contact, fontSize: 12, bold: true, alignment: "center" },
      { text: config.role, fontSize: 8, color: config.secondaryColor, alignment: "center", margin: [0, 0, 0, 20] },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 111, y2: 0, lineWidth: 0.5, lineColor: "#ccc" }], margin: [0, 0, 0, 15] },
      { text: config.phone, fontSize: 7, alignment: "center", margin: [0, 0, 0, 3] },
      { text: config.email, fontSize: 7, alignment: "center", margin: [0, 0, 0, 3] },
      { text: config.website, fontSize: 7, alignment: "center" },
    ],
  };
  openPdf(docDefinition, "cartao-de-visita-vertical.pdf");
};

export const generateCartaoQuadrado = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const docDefinition: any = {
    pageSize: { width: 184.2, height: 184.2 }, // 65x65mm
    pageMargins: [20, 20, 20, 20],
    content: [
      { text: "+AD", fontSize: 20, bold: true, color: config.primaryColor, alignment: "center", margin: [0, 15, 0, 20] },
      { text: config.contact, fontSize: 10, bold: true, alignment: "center" },
      { text: config.role, fontSize: 7, color: config.secondaryColor, alignment: "center", margin: [0, 0, 0, 15] },
      { text: config.phone, fontSize: 7, alignment: "center" },
      { text: config.website, fontSize: 7, alignment: "center" },
    ],
  };
  openPdf(docDefinition, "cartao-de-visita-quadrado.pdf");
};

export const generateCartaoDigital = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const docDefinition: any = {
    pageSize: { width: 280, height: 500 }, // Mobile-like portrait
    pageMargins: [20, 30, 20, 30],
    background: function () {
      return {
        canvas: [{ type: "rect", x: 0, y: 0, w: 280, h: 500, color: "#111111" }],
      };
    },
    content: [
      { text: config.companyName, fontSize: 22, bold: true, color: "#ffffff", alignment: "center", margin: [0, 20, 0, 40] },
      {
        qr: config.website || "https://adapta.studio",
        fit: 120,
        alignment: "center",
        margin: [0, 0, 0, 40] as [number, number, number, number],
        foreground: "#ffffff",
        background: "#111111"
      },
      { text: config.contact, fontSize: 16, bold: true, color: "#ffffff", alignment: "center" },
      { text: config.role, fontSize: 10, color: "#888888", alignment: "center", margin: [0, 5, 0, 20] },
      { text: config.phone, fontSize: 12, color: "#ffffff", alignment: "center", margin: [0, 0, 0, 10] },
      { text: config.email, fontSize: 10, color: "#cccccc", alignment: "center", margin: [0, 0, 0, 5] },
      { text: config.website, fontSize: 10, color: "#cccccc", alignment: "center" },
    ],
  };
  openPdf(docDefinition, "cartao-de-visita-digital.pdf");
};