import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import {
  BookOpen, Upload, Search, Filter, FileText, FileImage,
  Presentation, FileSignature, BookMarked, Download, Eye,
  Plus, FolderOpen, Lock, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { usePermissions } from "../helpers/usePermissions";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import styles from "./marketing-comunicacao.module.css";

// ── Tipos ──────────────────────────────────────────────────────────────
type DocCategory = "todos" | "contratos" | "apresentacoes" | "cartilhas" | "relatorios" | "outros";

type LibraryDoc = {
  id: number;
  title: string;
  category: DocCategory;
  type: "pdf" | "ppt" | "doc" | "img";
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
  color: string;
  spine: string;
};

// ── Dados mockados ─────────────────────────────────────────────────────
const MOCK_DOCS: LibraryDoc[] = [
  { id: 1, title: "Manual da Marca Adapta", category: "cartilhas", type: "pdf", size: "4.2 MB", uploadedBy: "Gabriela", uploadedAt: "2026-03-01", description: "Guia completo de uso de marca, tipografia e paleta de cores.", color: "#2D6A4F", spine: "#1B4332" },
  { id: 2, title: "Contrato Padrão de Prestação", category: "contratos", type: "doc", size: "890 KB", uploadedBy: "Gabriela", uploadedAt: "2026-03-10", description: "Modelo jurídico revisado pelo escritório.", color: "#1D3557", spine: "#0D1B2A" },
  { id: 3, title: "Pitch Deck Q1 2026", category: "apresentacoes", type: "ppt", size: "12.5 MB", uploadedBy: "Gabriela", uploadedAt: "2026-03-15", description: "Apresentação institucional para novos parceiros.", color: "#6B2D6B", spine: "#3D1A3D" },
  { id: 4, title: "Relatório de Marketing Mar/26", category: "relatorios", type: "pdf", size: "2.1 MB", uploadedBy: "Gabriela", uploadedAt: "2026-03-20", description: "Análise de campanhas e métricas do trimestre.", color: "#B5451B", spine: "#7A2D0F" },
  { id: 5, title: "Cartilha de Redes Sociais", category: "cartilhas", type: "pdf", size: "3.7 MB", uploadedBy: "Gabriela", uploadedAt: "2026-02-28", description: "Diretrizes para postagens em Instagram, LinkedIn e Facebook.", color: "#155B7B", spine: "#0A3A52" },
  { id: 6, title: "NDA — Modelo Padrão", category: "contratos", type: "doc", size: "440 KB", uploadedBy: "Gabriela", uploadedAt: "2026-02-15", description: "Acordo de confidencialidade padrão.", color: "#374151", spine: "#1F2937" },
  { id: 7, title: "Proposta Comercial — Template", category: "apresentacoes", type: "ppt", size: "8.3 MB", uploadedBy: "Gabriela", uploadedAt: "2026-01-20", description: "Template editável para propostas de novos clientes.", color: "#5B21B6", spine: "#3B0764" },
  { id: 8, title: "Relatório Anual 2025", category: "relatorios", type: "pdf", size: "6.8 MB", uploadedBy: "Gabriela", uploadedAt: "2025-12-30", description: "Resultados consolidados do exercício 2025.", color: "#92400E", spine: "#6B2D0E" },
];

const CATEGORIES: { value: DocCategory; label: string; icon: React.ElementType }[] = [
  { value: "todos", label: "Todos", icon: BookOpen },
  { value: "contratos", label: "Contratos", icon: FileSignature },
  { value: "apresentacoes", label: "Apresentações", icon: Presentation },
  { value: "cartilhas", label: "Cartilhas", icon: BookMarked },
  { value: "relatorios", label: "Relatórios", icon: FileText },
  { value: "outros", label: "Outros", icon: FolderOpen },
];

const TYPE_ICON: Record<LibraryDoc["type"], React.ElementType> = {
  pdf: FileText,
  ppt: Presentation,
  doc: FileSignature,
  img: FileImage,
};

const TYPE_COLOR: Record<LibraryDoc["type"], string> = {
  pdf: "#E44C30",
  ppt: "#D04A16",
  doc: "#2B7BEB",
  img: "#16A34A",
};

// ── Componente Principal ───────────────────────────────────────────────
export default function MarketingComunicacao() {
  const { ref, level, className: adaptiveClass } = useAdaptiveLevel();
  const { isResponsavel } = usePermissions();
  const [activeCategory, setActiveCategory] = useState<DocCategory>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocs = MOCK_DOCS.filter((doc) => {
    const matchesCategory = activeCategory === "todos" || doc.category === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Agrupa por categoria para montar as prateleiras
  const shelvesByCategory = CATEGORIES.filter(c => c.value !== "todos").map(cat => ({
    ...cat,
    docs: filteredDocs.filter(d => d.category === cat.value),
  })).filter(shelf => shelf.docs.length > 0 || activeCategory === "todos");

  const displayedShelves = activeCategory === "todos"
    ? shelvesByCategory.filter(s => s.docs.length > 0)
    : shelvesByCategory.filter(s => s.value === activeCategory);

  const handleUploadClick = () => {
    if (!isResponsavel) {
      toast.error("Apenas administradores e responsáveis podem fazer upload.");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`"${file.name}" adicionado à biblioteca com sucesso!`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isResponsavel) {
      toast.error("Apenas administradores e responsáveis podem fazer upload.");
      return;
    }
    const file = e.dataTransfer.files?.[0];
    if (file) {
      toast.success(`"${file.name}" adicionado à biblioteca com sucesso!`);
    }
  };

  return (
    <div ref={ref} className={`${styles.libraryContainer} ${adaptiveClass} ${styles[`level${level}`]}`}>
      <Helmet>
        <title>Biblioteca | Adapta Studio</title>
      </Helmet>

      {/* ── HEADER ── */}
      <div className={styles.libraryHeader}>
        <div className={styles.libraryTitleGroup}>
          <div className={styles.libraryIconBox}>
            <BookOpen size={28} />
          </div>
          <div>
            <h1 className={styles.libraryTitle}>Biblioteca Oficial</h1>
            <p className={styles.librarySubtitle}>
              Repositório central de documentos institucionais, contratos, apresentações e cartilhas.
            </p>
          </div>
        </div>

        <div className={styles.libraryActions}>
          {isResponsavel && (
            <Button
              variant="default"
              className={styles.uploadButton}
              onClick={handleUploadClick}
            >
              <Upload size={16} />
              Fazer Upload
            </Button>
          )}
          {!isResponsavel && (
            <div className={styles.lockBadge}>
              <Lock size={14} />
              <span>Upload restrito a administradores</span>
            </div>
          )}
        </div>
      </div>

      {/* ── SEARCH + FILTERS ── */}
      <div className={styles.libraryControls}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar documento..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.categoryFilters}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                className={`${styles.categoryBtn} ${activeCategory === cat.value ? styles.categoryBtnActive : ""}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ZONA DE UPLOAD ── */}
      {isResponsavel && (
        <div
          className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ""}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <Plus size={20} className={styles.dropZoneIcon} />
          <span className={styles.dropZoneText}>Arraste um arquivo ou clique para adicionar</span>
          <span className={styles.dropZoneHint}>PDF, PPTX, DOCX, PNG — até 50 MB</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.pptx,.ppt,.docx,.doc,.png,.jpg"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      )}

      {/* ── ESTANTE DE LIVROS ── */}
      <div className={styles.shelving}>
        {displayedShelves.length === 0 && (
          <div className={styles.emptyState}>
            <BookOpen size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>Nenhum documento encontrado.</p>
          </div>
        )}

        {displayedShelves.map((shelf) => {
          const ShelfIcon = shelf.icon;
          return (
            <div key={shelf.value} className={styles.shelf}>
              {/* Rótulo da prateleira */}
              <div className={styles.shelfLabel}>
                <ShelfIcon size={15} className={styles.shelfLabelIcon} />
                <span>{shelf.label}</span>
                <span className={styles.shelfCount}>{shelf.docs.length}</span>
              </div>

              {/* Prateleira */}
              <div className={styles.shelfBoard}>
                {/* Decoração da madeira */}
                <div className={styles.shelfWood} />

                {/* Livros */}
                <div className={styles.booksRow}>
                  {shelf.docs.map((doc) => {
                    const DocTypeIcon = TYPE_ICON[doc.type];
                    return (
                      <div key={doc.id} className={styles.bookWrapper}>
                        {/* Livro */}
                        <div
                          className={styles.book}
                          style={{ "--book-color": doc.color, "--book-spine": doc.spine } as React.CSSProperties}
                          title={doc.title}
                        >
                          {/* Lombada */}
                          <div className={styles.bookSpine}>
                            <span className={styles.bookSpineTitle}>{doc.title}</span>
                          </div>

                          {/* Capa (visível no hover) */}
                          <div className={styles.bookCover}>
                            <div className={styles.bookCoverInner}>
                              <div
                                className={styles.bookTypeIcon}
                                style={{ color: TYPE_COLOR[doc.type] }}
                              >
                                <DocTypeIcon size={20} />
                              </div>
                              <span className={styles.bookCoverTitle}>{doc.title}</span>
                              {doc.description && (
                                <span className={styles.bookCoverDesc}>{doc.description}</span>
                              )}
                              <div className={styles.bookCoverMeta}>
                                <Badge variant="outline" className={styles.bookTypeBadge}>
                                  {doc.type.toUpperCase()}
                                </Badge>
                                <span className={styles.bookSize}>{doc.size}</span>
                              </div>
                              <div className={styles.bookCoverActions}>
                                <button className={styles.bookActionBtn} title="Visualizar" onClick={() => toast.info(`Abrindo "${doc.title}"…`)}>
                                  <Eye size={14} />
                                </button>
                                <button className={styles.bookActionBtn} title="Baixar" onClick={() => toast.success(`Download de "${doc.title}" iniciado.`)}>
                                  <Download size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sombra do livro */}
                        <div className={styles.bookShadow} />
                      </div>
                    );
                  })}

                  {/* Slot de upload na prateleira (só para responsáveis) */}
                  {isResponsavel && (
                    <div className={styles.addBookSlot} onClick={handleUploadClick} title="Adicionar documento">
                      <Plus size={18} className={styles.addBookIcon} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LISTA de documentos (view compacta) ── */}
      {filteredDocs.length > 0 && (
        <div className={styles.docsList}>
          <div className={styles.docsListHeader}>
            <ChevronDown size={14} />
            <span>Todos os documentos ({filteredDocs.length})</span>
          </div>
          <div className={styles.docsTable}>
            {filteredDocs.map((doc) => {
              const Icon = TYPE_ICON[doc.type];
              return (
                <div key={doc.id} className={styles.docsRow}>
                  <div className={styles.docsRowIcon} style={{ color: TYPE_COLOR[doc.type] }}>
                    <Icon size={16} />
                  </div>
                  <div className={styles.docsRowInfo}>
                    <span className={styles.docsRowTitle}>{doc.title}</span>
                    <span className={styles.docsRowMeta}>{doc.size} · {doc.uploadedAt}</span>
                  </div>
                  <Badge variant="outline" className={styles.docsRowBadge}>
                    {doc.type.toUpperCase()}
                  </Badge>
                  <div className={styles.docsRowActions}>
                    <button className={styles.docsBtn} onClick={() => toast.info(`Abrindo "${doc.title}"…`)} title="Visualizar">
                      <Eye size={14} />
                    </button>
                    <button className={styles.docsBtn} onClick={() => toast.success(`Download iniciado.`)} title="Baixar">
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}