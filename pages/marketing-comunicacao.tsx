import React, { useState, useRef, useEffect, CSSProperties } from "react";
import { Helmet } from "react-helmet";
import {
  BookOpen, Upload, Search, FileText, FileImage,
  Presentation, FileSignature, BookMarked, Download,
  Eye, Plus, FolderOpen, Lock, X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { usePermissions } from "../helpers/usePermissions";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import styles from "./marketing-comunicacao.module.css";

// ── Tipos ────────────────────────────────────────────────────────────────
type DocCategory = "todos" | "contratos" | "apresentacoes" | "cartilhas" | "relatorios" | "outros";
type DocType = "pdf" | "ppt" | "doc" | "img";

interface LibraryDoc {
  id: number;
  title: string;
  category: DocCategory;
  type: DocType;
  size: string;
  url: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
  fillVariant: number;  // 0-5
  patternVariant: number; // 0-4 (4 = sem padrão)
  tiltDeg: number;
  heightFactor: number; // 0.7–1.0
}

// ── Documentos iniciais (arquivos reais + demonstração) ──────────────────
const INITIAL_LIBRARY: LibraryDoc[] = [
  {
    id: 1,
    title: "Cartilha de Comunicação Adapta",
    category: "cartilhas",
    type: "pdf",
    size: "2.6 KB",
    url: "/biblioteca/cartilha_comunicacao_adapta.pdf",
    description: "Guia de comunicação institucional da marca Adapta.",
    uploadedBy: "Adapta",
    uploadedAt: "2026-03-01",
    fillVariant: 2,
    patternVariant: 2,
    tiltDeg: -1,
    heightFactor: 0.9,
  },
  {
    id: 2,
    title: "Manual Comunicação v2",
    category: "cartilhas",
    type: "pdf",
    size: "6.8 KB",
    url: "/biblioteca/comunicacao_adapta_v2_manual.pdf",
    description: "Manual completo de comunicação corporativa versão 2.",
    uploadedBy: "Adapta",
    uploadedAt: "2026-03-01",
    fillVariant: 0,
    patternVariant: 0,
    tiltDeg: 1,
    heightFactor: 1.0,
  },
  {
    id: 3,
    title: "Contrato Padrão de Prestação",
    category: "contratos",
    type: "doc",
    size: "890 KB",
    url: "#",
    description: "Modelo jurídico revisado para prestação de serviços.",
    uploadedBy: "Gabriela",
    uploadedAt: "2026-03-10",
    fillVariant: 3,
    patternVariant: 1,
    tiltDeg: 0,
    heightFactor: 0.88,
  },
  {
    id: 4,
    title: "Pitch Deck Q1 2026",
    category: "apresentacoes",
    type: "ppt",
    size: "12.5 MB",
    url: "#",
    description: "Apresentação institucional para novos parceiros.",
    uploadedBy: "Gabriela",
    uploadedAt: "2026-03-15",
    fillVariant: 5,
    patternVariant: 3,
    tiltDeg: -2,
    heightFactor: 0.95,
  },
  {
    id: 5,
    title: "Relatório de Marketing Mar/26",
    category: "relatorios",
    type: "pdf",
    size: "2.1 MB",
    url: "#",
    description: "Análise de campanhas e métricas do trimestre.",
    uploadedBy: "Gabriela",
    uploadedAt: "2026-03-20",
    fillVariant: 1,
    patternVariant: 4,
    tiltDeg: 0.5,
    heightFactor: 0.82,
  },
  {
    id: 6,
    title: "NDA — Modelo Padrão",
    category: "contratos",
    type: "doc",
    size: "440 KB",
    url: "#",
    description: "Acordo de confidencialidade padrão.",
    uploadedBy: "Gabriela",
    uploadedAt: "2026-02-15",
    fillVariant: 4,
    patternVariant: 0,
    tiltDeg: 1.5,
    heightFactor: 0.76,
  },
  {
    id: 7,
    title: "Proposta Comercial — Template",
    category: "apresentacoes",
    type: "ppt",
    size: "8.3 MB",
    url: "#",
    description: "Template editável para propostas de novos clientes.",
    uploadedBy: "Gabriela",
    uploadedAt: "2026-01-20",
    fillVariant: 2,
    patternVariant: 2,
    tiltDeg: -1.5,
    heightFactor: 0.93,
  },
  {
    id: 8,
    title: "Relatório Anual 2025",
    category: "relatorios",
    type: "pdf",
    size: "6.8 MB",
    url: "#",
    description: "Resultados consolidados do exercício 2025.",
    uploadedBy: "Gabriela",
    uploadedAt: "2025-12-30",
    fillVariant: 1,
    patternVariant: 1,
    tiltDeg: 0,
    heightFactor: 1.0,
  },
];

const CATEGORIES: { value: DocCategory; label: string; icon: React.ElementType }[] = [
  { value: "todos", label: "Todos", icon: BookOpen },
  { value: "contratos", label: "Contratos", icon: FileSignature },
  { value: "apresentacoes", label: "Apresentações", icon: Presentation },
  { value: "cartilhas", label: "Cartilhas", icon: BookMarked },
  { value: "relatorios", label: "Relatórios", icon: FileText },
  { value: "outros", label: "Outros", icon: FolderOpen },
];

const TYPE_ICON: Record<DocType, React.ElementType> = {
  pdf: FileText,
  ppt: Presentation,
  doc: FileSignature,
  img: FileImage,
};

// ── SVG: Muda de Cannabis ─────────────────────────────────────────────────
const CannabisPlant: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 52 76"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Vaso */}
    <path
      d="M10 52 L13 70 L39 70 L42 52 Z"
      stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
      fill="var(--surface)"
    />
    <rect
      x="8" y="47" width="36" height="7" rx="3"
      stroke="currentColor" strokeWidth="1.4"
      fill="var(--surface)"
    />
    {/* Linhas decorativas do vaso */}
    <line x1="11" y1="57" x2="41" y2="57.5" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.35" />
    <line x1="12" y1="63" x2="40" y2="63.5" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.35" />
    {/* Caule principal */}
    <path d="M26 47 Q26 38 26 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Galhos laterais */}
    <path d="M26 36 Q20 31 16 23" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M26 36 Q32 31 36 23" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    {/* Folha central (5 folíolos palmatados - característica da cannabis) */}
    {/* Folíolo central */}
    <path d="M26 24 C24 19 21 13 26 6 C31 13 28 19 26 24Z"
      stroke="currentColor" strokeWidth="0.9" fill="color-mix(in srgb, var(--primary) 20%, transparent)" strokeLinejoin="round" />
    {/* Folíolo esquerdo interno */}
    <path d="M23 21 C19 17 15 12 19 6 C23 12 23 21 23 21Z"
      stroke="currentColor" strokeWidth="0.8" fill="color-mix(in srgb, var(--primary) 15%, transparent)" strokeLinejoin="round" />
    {/* Folíolo direito interno */}
    <path d="M29 21 C33 17 37 12 33 6 C29 12 29 21 29 21Z"
      stroke="currentColor" strokeWidth="0.8" fill="color-mix(in srgb, var(--primary) 15%, transparent)" strokeLinejoin="round" />
    {/* Folíolo esquerdo externo */}
    <path d="M21 24 C16 22 11 17 15 11 C19 17 21 24 21 24Z"
      stroke="currentColor" strokeWidth="0.8" fill="color-mix(in srgb, var(--primary) 12%, transparent)" strokeLinejoin="round" />
    {/* Folíolo direito externo */}
    <path d="M31 24 C36 22 41 17 37 11 C33 17 31 24 31 24Z"
      stroke="currentColor" strokeWidth="0.8" fill="color-mix(in srgb, var(--primary) 12%, transparent)" strokeLinejoin="round" />
    {/* Folha lateral esquerda (galho) */}
    <path d="M16 23 C14 19 11 14 14 9 C17 14 16 23 16 23Z"
      stroke="currentColor" strokeWidth="0.75" fill="color-mix(in srgb, var(--primary) 10%, transparent)" strokeLinejoin="round" />
    <path d="M16 23 C12 22 9 17 12 12 C15 17 16 23 16 23Z"
      stroke="currentColor" strokeWidth="0.75" fill="color-mix(in srgb, var(--primary) 10%, transparent)" strokeLinejoin="round" />
    {/* Folha lateral direita (galho) */}
    <path d="M36 23 C38 19 41 14 38 9 C35 14 36 23 36 23Z"
      stroke="currentColor" strokeWidth="0.75" fill="color-mix(in srgb, var(--primary) 10%, transparent)" strokeLinejoin="round" />
    <path d="M36 23 C40 22 43 17 40 12 C37 17 36 23 36 23Z"
      stroke="currentColor" strokeWidth="0.75" fill="color-mix(in srgb, var(--primary) 10%, transparent)" strokeLinejoin="round" />
  </svg>
);

// ── SVG: Livro (estilo ilustração flat) ──────────────────────────────────
interface BookSVGProps {
  doc: LibraryDoc;
  isActive: boolean;
  onToggle: () => void;
  onClose: () => void;
  index: number;
}

const BookSVG: React.FC<BookSVGProps> = ({ doc, isActive, onToggle, onClose, index }) => {
  const patternId = `p-${doc.id}`;
  const TypeIcon = TYPE_ICON[doc.type];
  const popupRef = useRef<HTMLDivElement>(null);

  // fecha o popup ao clicar fora
  useEffect(() => {
    if (!isActive) return;
    const handle = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isActive, onClose]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (doc.url === "#") {
      toast.error("Este documento ainda não está disponível para download.");
    } else {
      window.open(doc.url, "_blank");
    }
    onClose();
  };

  return (
    <div
      className={`${styles.bookWrapper} ${styles[`fillV${doc.fillVariant}`]} ${isActive ? styles.bookWrapperActive : ""}`}
      style={{
        "--tilt": `${doc.tiltDeg}deg`,
        "--hf": doc.heightFactor,
      } as CSSProperties}
      onClick={onToggle}
      title={doc.title}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onToggle()}
    >
      {/* ─ SVG do livro ─ */}
      <svg
        viewBox="0 0 36 120"
        className={styles.bookSvg}
        aria-label={doc.title}
      >
        <defs>
          {/* Padrão geométrico discreto */}
          {doc.patternVariant === 0 && (
            <pattern id={patternId} x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
              <line x1="0" y1="4" x2="4" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
            </pattern>
          )}
          {doc.patternVariant === 1 && (
            <pattern id={patternId} x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="0.9" fill="currentColor" opacity="0.14" />
            </pattern>
          )}
          {doc.patternVariant === 2 && (
            <pattern id={patternId} x="0" y="0" width="4" height="7" patternUnits="userSpaceOnUse">
              <line x1="0" y1="3.5" x2="4" y2="3.5" stroke="currentColor" strokeWidth="0.5" opacity="0.16" />
            </pattern>
          )}
          {doc.patternVariant === 3 && (
            <pattern id={patternId} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 4h8M4 0v8" stroke="currentColor" strokeWidth="0.4" opacity="0.1" fill="none" />
            </pattern>
          )}
        </defs>

        {/* Páginas no topo (bordas arredondadas) */}
        <ellipse cx="18" cy="2.5" rx="16.5" ry="2.5"
          fill="color-mix(in srgb, var(--card) 90%, var(--muted))"
          stroke="currentColor" strokeWidth="0.9" />
        {/* Linhas de página */}
        {[5, 8, 11, 14, 22, 25, 28, 31].map((x, i) => (
          <line key={i} x1={x} y1={i < 4 ? 0.8 : 0.8} x2={x} y2={5}
            stroke="currentColor" strokeWidth="0.28" opacity="0.4" />
        ))}

        {/* Corpo do livro */}
        <rect x="1" y="2" width="34" height="116" rx="1.5"
          fill="var(--book-fill)"
          stroke="currentColor" strokeWidth="1.4" />

        {/* Padrão geométrico */}
        {doc.patternVariant < 4 && (
          <rect x="1" y="2" width="34" height="116" rx="1.5"
            fill={`url(#${patternId})`} />
        )}

        {/* Linha de lombada */}
        <line x1="7" y1="3" x2="7" y2="117"
          stroke="currentColor" strokeWidth="0.75" opacity="0.3" />

        {/* Título vertical */}
        <text
          transform="translate(20, 110) rotate(-90)"
          fill="currentColor"
          opacity="0.6"
          fontSize="6.5"
          fontFamily="var(--font-family-heading)"
          fontWeight="600"
          letterSpacing="0.05em"
          textAnchor="start"
          dominantBaseline="middle"
        >
          {doc.title.length > 20 ? doc.title.slice(0, 20) + "…" : doc.title}
        </text>
      </svg>

      {/* ─ Popup de informação ─ */}
      {isActive && (
        <div className={styles.bookPopup} ref={popupRef} onClick={(e) => e.stopPropagation()}>
          <button className={styles.popupClose} onClick={(e) => { e.stopPropagation(); onClose(); }}>
            <X size={12} />
          </button>
          <div className={styles.popupTypeIcon}>
            <TypeIcon size={18} />
          </div>
          <strong className={styles.popupTitle}>{doc.title}</strong>
          {doc.description && (
            <p className={styles.popupDesc}>{doc.description}</p>
          )}
          <div className={styles.popupMeta}>
            <Badge variant="outline" className={styles.popupBadge}>
              {doc.type.toUpperCase()}
            </Badge>
            <span className={styles.popupSize}>{doc.size}</span>
          </div>
          <div className={styles.popupActions}>
            <button className={styles.popupBtn} onClick={handleDownload} title="Baixar">
              <Download size={13} />
              <span>Baixar</span>
            </button>
            <button
              className={styles.popupBtn}
              onClick={(e) => {
                e.stopPropagation();
                if (doc.url !== "#") window.open(doc.url, "_blank");
                else toast.info("Visualização não disponível.");
                onClose();
              }}
              title="Visualizar"
            >
              <Eye size={13} />
              <span>Ver</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Componente de prateleira ─────────────────────────────────────────────
interface ShelfProps {
  docs: LibraryDoc[];
  activeDocId: number | null;
  onToggle: (id: number) => void;
  onClosePopup: () => void;
  showPlant: boolean;
}

const Shelf: React.FC<ShelfProps> = ({ docs, activeDocId, onToggle, onClosePopup, showPlant }) => (
  <div className={styles.shelfOuter}>
    <div className={styles.booksRow}>
      {docs.slice(0, 5).map((doc, i) => (
        <BookSVG
          key={doc.id}
          doc={doc}
          index={i}
          isActive={activeDocId === doc.id}
          onToggle={() => onToggle(doc.id)}
          onClose={onClosePopup}
        />
      ))}

      {/* Planta decorativa (muda de cannabis) */}
      {showPlant && docs.length >= 3 && (
        <div className={styles.plantSlot}>
          <CannabisPlant className={styles.plantSvg} />
        </div>
      )}

      {docs.slice(5).map((doc, i) => (
        <BookSVG
          key={doc.id}
          doc={doc}
          index={i + 5}
          isActive={activeDocId === doc.id}
          onToggle={() => onToggle(doc.id)}
          onClose={onClosePopup}
        />
      ))}
    </div>
    {/* Tábua da prateleira */}
    <div className={styles.shelfPlank} />
  </div>
);

// ── Componente Principal ──────────────────────────────────────────────────
export default function MarketingComunicacao() {
  const { ref, level, className: adaptiveClass } = useAdaptiveLevel();
  const { isResponsavel } = usePermissions();
  const [docs, setDocs] = useState<LibraryDoc[]>(INITIAL_LIBRARY);
  const [activeDocId, setActiveDocId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<DocCategory>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  let nextId = useRef(docs.length + 1);

  const filteredDocs = docs.filter((d) => {
    const matchesCat = activeCategory === "todos" || d.category === activeCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Agrupa por categoria para as prateleiras
  const shelfGroups = CATEGORIES.filter((c) => c.value !== "todos").map((cat) => ({
    ...cat,
    docs: filteredDocs.filter((d) => d.category === cat.value),
  })).filter((g) => g.docs.length > 0 || activeCategory === g.value);

  const visibleGroups = activeCategory === "todos"
    ? shelfGroups.filter((g) => g.docs.length > 0)
    : shelfGroups.filter((g) => g.value === activeCategory);

  const addFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() as DocType | undefined;
    const type: DocType = ["pdf", "ppt", "doc", "img"].includes(ext || "") ? (ext as DocType) : "pdf";
    const newDoc: LibraryDoc = {
      id: nextId.current++,
      title: file.name.replace(/\.[^.]+$/, ""),
      category: "outros",
      type,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      url: URL.createObjectURL(file),
      description: undefined,
      uploadedBy: "Você",
      uploadedAt: new Date().toISOString().slice(0, 10),
      fillVariant: nextId.current % 6,
      patternVariant: nextId.current % 5,
      tiltDeg: ((nextId.current % 5) - 2) * 0.8,
      heightFactor: 0.82 + (nextId.current % 4) * 0.06,
    };
    setDocs((prev) => [...prev, newDoc]);
    toast.success(`"${newDoc.title}" adicionado à biblioteca!`);
  };

  const handleUploadClick = () => {
    if (!isResponsavel) {
      toast.error("Apenas administradores e responsáveis podem fazer upload.");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isResponsavel) {
      toast.error("Apenas administradores e responsáveis podem fazer upload.");
      return;
    }
    const file = e.dataTransfer.files?.[0];
    if (file) addFile(file);
  };

  const toggleDoc = (id: number) =>
    setActiveDocId((prev) => (prev === id ? null : id));

  return (
    <div
      ref={ref}
      className={`${styles.page} ${adaptiveClass} ${styles[`level${level}`]}`}
    >
      <Helmet>
        <title>Biblioteca | Adapta Studio</title>
      </Helmet>

      {/* ── HEADER ── */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBox}>
            <BookOpen size={26} />
          </div>
          <div>
            <h1 className={styles.title}>Biblioteca Oficial</h1>
            <p className={styles.subtitle}>
              Repositório central de documentos institucionais, contratos, apresentações e cartilhas.
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          {isResponsavel ? (
            <Button variant="primary" className={styles.uploadBtn} onClick={handleUploadClick}>
              <Upload size={15} />
              Fazer Upload
            </Button>
          ) : (
            <span className={styles.lockNote}>
              <Lock size={13} />
              Upload restrito a responsáveis
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.pptx,.ppt,.docx,.doc,.png,.jpg"
            style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) addFile(f); }}
          />
        </div>
      </div>

      {/* ── BUSCA + FILTROS ── */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar documento…"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                className={`${styles.filterBtn} ${activeCategory === cat.value ? styles.filterBtnActive : ""}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                <Icon size={13} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── DROP ZONE (só para responsáveis) ── */}
      {isResponsavel && (
        <div
          className={`${styles.dropZone} ${isDragging ? styles.dropping : ""}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <Plus size={18} className={styles.dropIcon} />
          <span className={styles.dropText}>Arraste um arquivo ou clique para adicionar</span>
          <span className={styles.dropHint}>PDF, PPTX, DOCX, PNG — até 50 MB</span>
        </div>
      )}

      {/* ── ESTANTE ── */}
      <div className={styles.shelving}>
        {filteredDocs.length === 0 && (
          <div className={styles.empty}>
            <BookOpen size={44} className={styles.emptyIcon} />
            <p>Nenhum documento encontrado.</p>
          </div>
        )}

        {visibleGroups.map((group, gIdx) => {
          const GroupIcon = group.icon;
          return (
            <div key={group.value} className={styles.shelfSection}>
              {/* Rótulo da categoria */}
              <div className={styles.shelfLabel}>
                <GroupIcon size={14} />
                <span>{group.label}</span>
                <span className={styles.shelfCount}>{group.docs.length}</span>
              </div>

              <Shelf
                docs={group.docs}
                activeDocId={activeDocId}
                onToggle={toggleDoc}
                onClosePopup={() => setActiveDocId(null)}
                showPlant={gIdx % 2 === 0}
              />
            </div>
          );
        })}
      </div>

      {/* ── LISTA COMPACTA ── */}
      {filteredDocs.length > 0 && (
        <details className={styles.listSection}>
          <summary className={styles.listToggle}>
            Todos os documentos ({filteredDocs.length})
          </summary>
          <div className={styles.listTable}>
            {filteredDocs.map((doc) => {
              const Icon = TYPE_ICON[doc.type];
              return (
                <div key={doc.id} className={styles.listRow}>
                  <Icon size={15} className={styles.listRowIcon} />
                  <div className={styles.listRowInfo}>
                    <span className={styles.listRowTitle}>{doc.title}</span>
                    <span className={styles.listRowMeta}>{doc.size} · {doc.uploadedAt}</span>
                  </div>
                  <Badge variant="outline" className={styles.listBadge}>{doc.type.toUpperCase()}</Badge>
                  <div className={styles.listRowActions}>
                    <button
                      className={styles.listBtn}
                      title="Baixar"
                      onClick={() =>
                        doc.url !== "#"
                          ? window.open(doc.url, "_blank")
                          : toast.error("Arquivo não disponível.")
                      }
                    >
                      <Download size={13} />
                    </button>
                    <button
                      className={styles.listBtn}
                      title="Visualizar"
                      onClick={() =>
                        doc.url !== "#"
                          ? window.open(doc.url, "_blank")
                          : toast.info("Visualização não disponível.")
                      }
                    >
                      <Eye size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}