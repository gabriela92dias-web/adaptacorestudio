// @ts-ignore
import * as pdfMake from "pdfmake/build/pdfmake";
// @ts-ignore
import * as pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).addVirtualFileSystem(pdfFonts);

export type BrandData = Record<string, any> | null | undefined;

export const getBrandConfig = (brand: BrandData) => {
  return {
    companyName: String(brand?.companyName || "Nome da Empresa"),
    primaryColor: String(brand?.primaryColor || "#171717"),
    secondaryColor: String(brand?.secondaryColor || "#666666"),
    address: brand?.address
      ? String(`${brand.address}, ${brand.city || ""} ${brand.zip || ""}`)
      : "Endereço da Empresa, Cidade, CEP",
    contact: String(brand?.contactName || "Nome do Contato"),
    role: String(brand?.role || "Cargo"),
    phone: String(brand?.phone || "+55 11 99999-9999"),
    email: String(brand?.email || "contato@empresa.com"),
    website: String(brand?.website || "www.empresa.com"),
  };
};

export const getBaseStyles = (primaryColor: string, secondaryColor: string): any => ({
  header: { fontSize: 18, bold: true, color: primaryColor, margin: [0, 0, 0, 10] },
  subheader: { fontSize: 14, bold: true, color: secondaryColor, margin: [0, 15, 0, 5] },
  bodyText: { fontSize: 10, color: "#444444", lineHeight: 1.5, margin: [0, 0, 0, 10] },
  footerText: { fontSize: 8, color: "#888888", alignment: "center" },
  title: { fontSize: 24, bold: true, alignment: "center", margin: [0, 20, 0, 20], color: primaryColor },
  legalText: { fontSize: 10, color: "#333333", lineHeight: 1.5, margin: [0, 5, 0, 15], alignment: "justify" },
});

export const createPdf = (docDefinition: any) => {
  const pdf = pdfMake.createPdf(docDefinition);
  (pdf as any).openOrDownload = (filename: string) => {
    pdf.getBlob((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, "_blank");
      if (!newWindow) {
        // Fallback to direct download if window.open returns null (e.g. popup blocked in iframe)
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  };
  return pdf;
};

export const openPdf = (docDefinition: any, filename: string) => {
  createPdf(docDefinition).openOrDownload(filename);
};