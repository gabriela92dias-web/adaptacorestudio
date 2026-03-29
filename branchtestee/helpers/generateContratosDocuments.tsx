import { BrandData, getBrandConfig, getBaseStyles, openPdf } from "./pdfUtils";

export const generateContratoPrestacao = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const styles = getBaseStyles(config.primaryColor, config.secondaryColor);
  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [50, 50, 50, 50],
    styles,
    content: [
      { text: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS", style: "title" },
      { text: "Pelo presente instrumento particular, de um lado:", style: "legalText" },
      { text: `CONTRATADA: ${config.companyName}, pessoa jurídica de direito privado, sediada em ${config.address}, doravante denominada simplesmente CONTRATADA.`, style: "legalText", bold: true },
      { text: "CONTRATANTE: [NOME DO CLIENTE], [Qualificação do Cliente], doravante denominado simplesmente CONTRATANTE.", style: "legalText", bold: true },
      
      { text: "CLÁUSULA PRIMEIRA - DO OBJETO", style: "subheader" },
      { text: "1.1 O presente contrato tem como objeto a prestação de serviços especializados de consultoria e desenvolvimento por parte da CONTRATADA à CONTRATANTE.", style: "legalText" },
      { text: "1.2 Os serviços serão prestados conforme cronograma e escopo definidos em anexo, que passa a fazer parte integrante deste instrumento.", style: "legalText" },
      
      { text: "CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES DA CONTRATADA", style: "subheader", pageBreak: "before" },
      { text: "2.1 A CONTRATADA obriga-se a prestar os serviços com zelo, diligência e dentro dos prazos estipulados.", style: "legalText" },
      { text: "2.2 A CONTRATADA deverá manter absoluto sigilo sobre quaisquer informações da CONTRATANTE.", style: "legalText" },
      
      { text: "CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DA CONTRATANTE", style: "subheader", pageBreak: "before" },
      { text: "3.1 Fornecer todas as informações e materiais necessários para a execução dos serviços.", style: "legalText" },
      { text: "3.2 Efetuar os pagamentos conforme estabelecido na Cláusula Quarta.", style: "legalText" },
      
      { text: "CLÁUSULA QUARTA - DA REMUNERAÇÃO E FORMA DE PAGAMENTO", style: "subheader", pageBreak: "before" },
      { text: "4.1 Pela prestação dos serviços, a CONTRATANTE pagará à CONTRATADA o valor total estipulado na proposta comercial aprovada.", style: "legalText" },
      
      { text: "CLÁUSULA QUINTA - DO PRAZO E RESCISÃO", style: "subheader", pageBreak: "before" },
      { text: "5.1 O presente contrato terá vigência pelo período determinado no cronograma aprovado.", style: "legalText" },
      { text: "5.2 O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 30 dias.", style: "legalText" },
      
      { text: "CLÁUSULA SEXTA - DO FORO", style: "subheader", pageBreak: "before" },
      { text: "6.1 Fica eleito o foro da comarca da sede da CONTRATADA para dirimir quaisquer dúvidas oriundas deste contrato.", style: "legalText" },
      { text: "\n\nE, por estarem assim justas e contratadas, assinam o presente instrumento em 2 (duas) vias de igual teor e forma.", style: "legalText" },
      
      { text: `\n\nData: ___/___/_____\n\n`, style: "legalText", alignment: "center" },
      {
        columns: [
          { stack: [{ text: "________________________________", alignment: "center" }, { text: config.companyName, alignment: "center", bold: true }] },
          { stack: [{ text: "________________________________", alignment: "center" }, { text: "CONTRATANTE", alignment: "center", bold: true }] },
        ],
        margin: [0, 50, 0, 0],
      },
    ],
  };
  openPdf(docDefinition, "contrato-de-prestacao-de-servicos.pdf");
};

export const generatePropostaComercial = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const styles = getBaseStyles(config.primaryColor, config.secondaryColor);
  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [50, 50, 50, 50],
    styles,
    content: [
      { text: "PROPOSTA COMERCIAL", style: "title", margin: [0, 200, 0, 20] },
      { text: `Preparada para: [Nome do Cliente]\nPor: ${config.companyName}\nData: ${new Intl.DateTimeFormat("pt-BR").format(new Date())}`, alignment: "center", style: "bodyText" },
      
      { text: "1. RESUMO EXECUTIVO", style: "subheader", pageBreak: "before" },
      { text: "Esta proposta tem como objetivo apresentar a solução desenvolvida pela nossa equipe para atender às necessidades específicas da sua empresa, focando em resultados mensuráveis e excelência na execução.", style: "bodyText" },
      
      { text: "2. ESCOPO DO PROJETO", style: "subheader" },
      { text: "O escopo inclui o planejamento, desenvolvimento e implementação das soluções descritas, garantindo alinhamento com os objetivos estratégicos.", style: "bodyText" },
      
      { text: "3. CRONOGRAMA", style: "subheader", pageBreak: "before" },
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto"],
          body: [
            [{ text: "Fase do Projeto", bold: true, fillColor: "#f2f2f2" }, { text: "Prazo", bold: true, fillColor: "#f2f2f2" }],
            ["1. Imersão e Briefing", "Semana 1"],
            ["2. Desenvolvimento da Solução", "Semanas 2 a 4"],
            ["3. Revisão e Ajustes", "Semana 5"],
            ["4. Entrega Final", "Semana 6"],
          ],
        },
        margin: [0, 10, 0, 20],
      },
      
      { text: "4. INVESTIMENTO", style: "subheader", pageBreak: "before" },
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto"],
          body: [
            [{ text: "Descrição", bold: true, fillColor: "#f2f2f2" }, { text: "Valor (R$)", bold: true, fillColor: "#f2f2f2" }],
            ["Desenvolvimento do Projeto Base", "R$ 0.000,00"],
            ["Implementação e Setup", "R$ 0.000,00"],
            [{ text: "TOTAL", bold: true }, { text: "R$ 0.000,00", bold: true }],
          ],
        },
        margin: [0, 10, 0, 20],
      },
      { text: "5. TERMOS E CONDIÇÕES\nProposta válida por 15 dias a partir da data de emissão. Pagamento em 50% no aceite e 50% na entrega.", style: "bodyText" },
    ],
  };
  openPdf(docDefinition, "proposta-comercial.pdf");
};

export const generateNDA = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const styles = getBaseStyles(config.primaryColor, config.secondaryColor);
  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [50, 50, 50, 50],
    styles,
    content: [
      { text: "ACORDO DE CONFIDENCIALIDADE (NDA)", style: "title" },
      { text: `Pelo presente instrumento, ${config.companyName} (REVELADORA) e [NOME DA PARTE] (RECEPTORA), acordam o seguinte:`, style: "legalText" },
      
      { text: "1. OBJETO E DEFINIÇÕES", style: "subheader" },
      { text: "1.1 Para os fins deste Acordo, 'Informação Confidencial' significa toda e qualquer informação técnica, financeira ou comercial disponibilizada pela Reveladora.", style: "legalText" },
      
      { text: "2. OBRIGAÇÕES DE CONFIDENCIALIDADE", style: "subheader", pageBreak: "before" },
      { text: "2.1 A Parte Receptora concorda em manter absoluto sigilo sobre as Informações Confidenciais, não as divulgando a terceiros sem prévio consentimento por escrito.", style: "legalText" },
      { text: "2.2 A Parte Receptora utilizará as Informações Confidenciais apenas para o propósito estrito de avaliar uma possível parceria de negócios.", style: "legalText" },
      
      { text: "3. PRAZO E PENALIDADES", style: "subheader", pageBreak: "before" },
      { text: "3.1 As obrigações de confidencialidade estipuladas neste Acordo permanecerão em vigor por um período de 5 (cinco) anos.", style: "legalText" },
      { text: "3.2 Em caso de quebra de confidencialidade, a Parte infratora estará sujeita ao pagamento de perdas e danos.", style: "legalText" },
      {
        columns: [
          { stack: [{ text: "________________________________", alignment: "center" }, { text: config.companyName, alignment: "center", bold: true }] },
          { stack: [{ text: "________________________________", alignment: "center" }, { text: "RECEPTORA", alignment: "center", bold: true }] },
        ],
        margin: [0, 80, 0, 0],
      },
    ],
  };
  openPdf(docDefinition, "acordo-de-confidencialidade.pdf");
};

export const generateOrdemServico = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const styles = getBaseStyles(config.primaryColor, config.secondaryColor);
  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    styles,
    content: [
      {
        columns: [
          { text: "ORDEM DE SERVIÇO (O.S.)", style: "title", alignment: "left" },
          { text: `Nº 0001\nData: ${new Intl.DateTimeFormat("pt-BR").format(new Date())}`, alignment: "right", margin: [0, 20, 0, 0], bold: true },
        ]
      },
      { text: "1. DADOS DO CLIENTE", style: "subheader" },
      {
        table: {
          widths: ["30%", "70%"],
          body: [
            ["Nome / Razão Social:", ""],
            ["CNPJ / CPF:", ""],
            ["Endereço:", ""],
            ["Contato / E-mail:", ""],
          ]
        },
        margin: [0, 10, 0, 20]
      },
      { text: "2. DESCRIÇÃO DO SERVIÇO", style: "subheader" },
      {
        table: {
          widths: ["100%"],
          heights: [150],
          body: [[{ text: "Descreva o serviço detalhadamente...", color: "#999" }]]
        },
        margin: [0, 10, 0, 20]
      },
      { text: "3. PRAZOS E VALORES", style: "subheader", pageBreak: "before" },
      {
        table: {
          widths: ["50%", "50%"],
          body: [
            ["Data de Início:", ""],
            ["Previsão de Entrega:", ""],
            ["Valor Total:", ""],
            ["Condição de Pagamento:", ""],
          ]
        },
        margin: [0, 10, 0, 40]
      },
      { text: "TERMO DE ACEITE", bold: true, alignment: "center", margin: [0, 0, 0, 10] },
      { text: "Autorizo a execução dos serviços descritos acima conforme condições estipuladas.", alignment: "center", fontSize: 10 },
      {
        columns: [
          { stack: [{ text: "________________________________", alignment: "center" }, { text: "Assinatura do Cliente", alignment: "center", bold: true, fontSize: 10 }] },
          { stack: [{ text: "________________________________", alignment: "center" }, { text: config.companyName, alignment: "center", bold: true, fontSize: 10 }] },
        ],
        margin: [0, 60, 0, 0],
      },
    ],
  };
  openPdf(docDefinition, "ordem-de-servico.pdf");
};

export const generateBriefing = (brand: BrandData) => {
  const config = getBrandConfig(brand);
  const styles = getBaseStyles(config.primaryColor, config.secondaryColor);
  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [50, 50, 50, 50],
    styles,
    content: [
      { text: "BRIEFING DE PROJETO", style: "title" },
      { text: `Empresa responsável: ${config.companyName}\n\nEste documento tem o objetivo de coletar informações essenciais para o sucesso do projeto.`, style: "bodyText" },
      
      { text: "1. INFORMAÇÕES GERAIS DA EMPRESA", style: "subheader" },
      { text: "Qual é a história resumida da empresa?", bold: true, margin: [0, 10, 0, 5] },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 495, y2: 0, lineColor: "#ccc" }], margin: [0, 20, 0, 20] },
      { text: "Quais são os principais produtos ou serviços oferecidos?", bold: true, margin: [0, 10, 0, 5] },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 495, y2: 0, lineColor: "#ccc" }], margin: [0, 20, 0, 20] },
      
      { text: "2. OBJETIVOS DO PROJETO", style: "subheader", pageBreak: "before" },
      { text: "Qual o objetivo principal deste projeto?", bold: true, margin: [0, 10, 0, 5] },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 495, y2: 0, lineColor: "#ccc" }], margin: [0, 20, 0, 20] },
      { text: "Existem objetivos secundários?", bold: true, margin: [0, 10, 0, 5] },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 495, y2: 0, lineColor: "#ccc" }], margin: [0, 20, 0, 20] },
      
      { text: "3. PÚBLICO-ALVO E CONCORRÊNCIA", style: "subheader", pageBreak: "before" },
      { text: "Quem é o seu cliente ideal (perfil demográfico e comportamental)?", bold: true, margin: [0, 10, 0, 5] },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 495, y2: 0, lineColor: "#ccc" }], margin: [0, 20, 0, 20] },
      { text: "Quem são os principais concorrentes diretos?", bold: true, margin: [0, 10, 0, 5] },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 495, y2: 0, lineColor: "#ccc" }], margin: [0, 20, 0, 20] },
    ],
  };
  openPdf(docDefinition, "briefing.pdf");
};