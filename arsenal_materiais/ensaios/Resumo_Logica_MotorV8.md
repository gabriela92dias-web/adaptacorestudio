# Matriz de Decisão (Rules Engine) - Motor V8

Este documento descreve a lógica estrutural (JavaScript Mock) embarcada nos Ensaios de Versão (v1.1.0) para validar o comportamento do Cérebro Determinístico do Motor V8. 

A IA atua apenas no **Passo 1** (Extração de DNA). A partir do **Passo 2**, o fluxo é puramente matemático e baseado em dependências (Hooks).

---

## 1. Passo: Extração de DNA (Input Classifier)
O sistema analisa o "prompt" do usuário em linguagem natural e detecta padrões cruciais para montar o ecossistema da campanha.

- **Variavel: DIREÇÃO**
  - Se contiver `["interno", "colaborador", "rh"]` ➔ **Configura:** `INTERNO`
  - Se contiver `["b2b", "corporativo", "empresas"]` ➔ **Configura:** `B2B / EXTERNO`
  - Caso Padrão ➔ **Configura:** `B2C / EXTERNO`

- **Variavel: EXPERIÊNCIA**
  - Se contiver `["presencial", "físico", "evento", "local"]` ➔ **Configura:** `FÍSICA`
  - Caso Padrão (ou palavras como `online, digital, live`) ➔ **Configura:** `ONLINE / DIGITAL`

---

## 2. Passo: Injeção na Governança (Funil Progressivo)
As etapas de aprovação (Layered Governance) são montadas dinamicamente com base no DNA extraído:

| Layer (Camada) | Lógica Condicional | Hook Mandatório Gerado (Aprovação Exigida) |
| :--- | :--- | :--- |
| **Layer 1 (Root)** | Constante para TODAS as campanhas | Visto da Diretoria / Orçamentário |
| **Layer 2 (Compliance)** | Se `EXP == FÍSICA` | Documentação de Responsabilidade Civil & Vistoria |
| **Layer 2 (Compliance)** | Se `EXP == DIGITAL` | Revisão de Termos de Uso (LGPD) e Privacidade |

---

## 3. Passo: Roteamento de Trilhas (Split Painel L/R)
Os módulos de ação são designados às equipes correspondentes, evitando que setores desnecessários sejam ativados.

| Condição Mapeada | Ação Lado A (Equipe Interna) | Ação Lado B (Público Externo) |
| :--- | :--- | :--- |
| **Se `DIR == INTERNO`** | Material Intranet, Treinamento de Líderes | *(Inativo / Ocioso)* |
| **Se `DIR == EXTERNO`** | Alinhamento Comercial / Briefing Vendas | Tráfego Pago, Landing Pages, Ads |
| **Caso Híbrido** | Engajamento de Safra | Réguas de E-mail de Lançamento |

---

## 4. Passo: Gatilhos Lúdicos / Módulos Específicos
Componentes flutuantes que só são anexados à arquitetura sob condições muito específicas do escopo logístico.

| Se o "DNA" detectar... | O Motor Instancia o Módulo... | E exige o Hook (Documento Vital)... |
| :--- | :--- | :--- |
| **Evento Presencial** | Gestão de Staff, Operativa de Locação | Alvará da Prefeitura (Obrigatório) |
| **Ação 100% Online** | Plataforma de Streaming, Setup de Nuvem | Licenças de Servidor e Software |

---

## 5. Passo: Painel de Monitoramento (Logs)
Ao final, todos os Hooks exigidos pelos Blocos de 2 a 4 são catalogados na grande Tabela Central. O Motor V8 agora aguarda a ação paralela dos departamentos responsáveis para "Dar o Check" nas travas do funil e liberar a campanha para disparo.
