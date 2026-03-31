import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Download, Plus, Filter, Pencil, Trash2, DollarSign, FileCheck, CheckCircle, Clock } from "lucide-react";
import { useBudgetItems, useProjects, useDeleteBudgetItem } from "../helpers/useCoreActApi";
import { Skeleton } from "../components/Skeleton";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Progress } from "../components/Progress";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "../components/Dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/Sheet";
import { BudgetItemForm } from "../components/BudgetItemForm";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import styles from "./coreact.orcamento.module.css";

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

export default function CoreActOrcamento() {
  const { data: budgetData, isLoading: isLoadingBudget, isError: isErrorBudget } = useBudgetItems();
  const { data: projectsData, isLoading: isLoadingProjects, isError: isErrorProjects } = useProjects();
  const deleteBudget = useDeleteBudgetItem();
  
  const [activeFilter, setActiveFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);

  const isLoading = (isLoadingBudget || isLoadingProjects) && !isErrorBudget && !isErrorProjects;

  const { stats, filteredItems, categoriesBreakdown, projectsBreakdown, categories, filterCounts } = useMemo(() => {
    if (!budgetData || !projectsData) return { stats: null, filteredItems: [], categoriesBreakdown: [], projectsBreakdown: [], categories: [], filterCounts: { all: 0, proj: {} as Record<string, number>, cat: {} as Record<string, number> } };

    const items = budgetData.budgetItems;
    let predicted = 0;
    let contracted = 0;
    let paid = 0;
    let pendingPayments = 0;

    const catMap: Record<string, number> = {};
    const projMap: Record<string, number> = {};
    const catSet = new Set<string>();

    const counts = { all: items.length, proj: {} as Record<string, number>, cat: {} as Record<string, number> };

    items.forEach(item => {
      const p = Number(item.predictedAmount || 0);
      const c = Number(item.contractedAmount || 0);
      const pa = Number(item.paidAmount || 0);
      
      predicted += p;
      contracted += c;
      paid += pa;
      if (item.status === 'pending') pendingPayments++;

      catSet.add(item.category);
      catMap[item.category] = (catMap[item.category] || 0) + c;
      
      counts.cat[item.category] = (counts.cat[item.category] || 0) + 1;
      
      if (item.projectName) {
        projMap[item.projectName] = (projMap[item.projectName] || 0) + c;
        counts.proj[item.projectName] = (counts.proj[item.projectName] || 0) + 1;
      }
    });

    const pendingAmount = Math.max(0, contracted - paid);

    const stats = {
      predicted, contracted, paid, pendingAmount, pendingPayments,
      itemCount: items.length,
      contractedPct: predicted > 0 ? (contracted / predicted) * 100 : 0,
      paidPct: contracted > 0 ? (paid / contracted) * 100 : 0
    };

    const categoriesBreakdown = Object.entries(catMap)
      .map(([name, amount]) => ({ name, amount, pct: contracted > 0 ? (amount / contracted) * 100 : 0 }))
      .sort((a,b) => b.amount - a.amount);

    const projectsBreakdown = Object.entries(projMap)
      .map(([name, amount]) => ({ name, amount, pct: contracted > 0 ? (amount / contracted) * 100 : 0 }))
      .sort((a,b) => b.amount - a.amount);

    const filteredItems = items.filter(item => {
      if (activeFilter === "all") return true;
      if (item.projectName === activeFilter) return true;
      if (item.category === activeFilter) return true;
      return false;
    });

    return { stats, filteredItems, categoriesBreakdown, projectsBreakdown, categories: Array.from(catSet), filterCounts: counts };
  }, [budgetData, projectsData, activeFilter]);

  const { ref, level, className: adaptiveClass } = useAdaptiveLevel({
    itemCount: filteredItems ? filteredItems.length : 0
  });

  if (isLoading) {
    return (
       <div ref={ref} className={`${styles.container} ${adaptiveClass} ${styles[`level${level}`]}`}>
         <div className={styles.header}>
            <Skeleton style={{ width: 300, height: 40 }} />
         </div>
         <div className={styles.kpiGrid}>
            {[1,2,3,4].map(i => <Skeleton key={i} style={{ height: 120 }} />)}
         </div>
         <div className={styles.splitLayout}>
            <Skeleton style={{ height: 500 }} />
            <Skeleton style={{ height: 500 }} />
         </div>
      </div>
    );
  }

  const safeStats = stats || {
    predicted: 0, contracted: 0, paid: 0, pendingAmount: 0, pendingPayments: 0,
    itemCount: 0, contractedPct: 0, paidPct: 0
  };

  const handleExport = () => {
    toast.success("Relatório exportado com sucesso (simulado)");
  };

  const confirmDelete = () => {
    if (!deletingItem) return;
    deleteBudget.mutate({ id: deletingItem.id }, {
      onSuccess: () => {
        toast.success("Item de orçamento excluído com sucesso!");
        setDeletingItem(null);
      },
      onError: (err) => {
        toast.error(`Erro ao excluir: ${err.message}`);
      }
    });
  };

  return (
    <div ref={ref} className={`${styles.container} ${adaptiveClass} ${styles[`level${level}`]}`}>
      <Helmet><title>CoreStudio | Orçamento</title></Helmet>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Controle de Orçamento</h1>
          <p className={styles.subtitle}>Gestão financeira por projeto e centro de custo</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" onClick={handleExport}><Download size={16} /> Exportar</Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus size={16} /> Novo Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Item de Orçamento</DialogTitle>
              </DialogHeader>
              <BudgetItemForm mode="create" onSuccess={() => setIsCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeaderRow}>
            <span className={styles.kpiLabel}>Previsão Total</span>
            <div className={styles.kpiIconWrapper}><DollarSign size={16} /></div>
          </div>
          <div className={styles.kpiValue}>{formatCurrency(safeStats.predicted)}</div>
          <span className={styles.kpiSub}>{safeStats.itemCount} itens</span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeaderRow}>
            <span className={styles.kpiLabel}>Contratado</span>
            <div className={styles.kpiIconWrapper}><FileCheck size={16} /></div>
          </div>
          <div className={styles.kpiValue}>{formatCurrency(safeStats.contracted)}</div>
          <span className={styles.kpiSub}>{Math.round(safeStats.contractedPct)}% do previsto</span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeaderRow}>
            <span className={styles.kpiLabel}>Pago</span>
            <div className={styles.kpiIconWrapper}><CheckCircle size={16} /></div>
          </div>
          <div className={styles.kpiValue}>{formatCurrency(safeStats.paid)}</div>
          <span className={styles.kpiSub}>{Math.round(safeStats.paidPct)}% do contratado</span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeaderRow}>
            <span className={styles.kpiLabel}>Pendente</span>
            <div className={styles.kpiIconWrapper}><Clock size={16} /></div>
          </div>
          <div className={styles.kpiValue}>{formatCurrency(safeStats.pendingAmount)}</div>
          <span className={styles.kpiSub}>{safeStats.pendingPayments} pagamentos pendentes</span>
        </div>
      </section>

      <section className={styles.filtersSection}>
        <div className={styles.filterLabel}><Filter size={16}/> Filtros:</div>
        <div className={styles.pillsList}>
          <button 
            className={`${styles.pill} ${activeFilter === "all" ? styles.pillActive : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            Todos os projetos ({filterCounts.all})
          </button>
          {projectsData?.projects.map(p => (
            <button 
              key={p.id}
              className={`${styles.pill} ${activeFilter === p.name ? styles.pillActive : ""}`}
              onClick={() => setActiveFilter(p.name)}
            >
              {p.name} ({filterCounts.proj[p.name] || 0})
            </button>
          ))}
          <div className={styles.pillSeparator}></div>
          {categories.map(c => (
            <button 
              key={c}
              className={`${styles.pill} ${activeFilter === c ? styles.pillActive : ""}`}
              onClick={() => setActiveFilter(c)}
            >
              {c} ({filterCounts.cat[c] || 0})
            </button>
          ))}
        </div>
      </section>

      {(isErrorBudget || isErrorProjects) ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: "center", maxWidth: "420px", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
             <p style={{ color: 'var(--color-destructive)', fontSize: '1rem', fontWeight: 500 }}>
                Não foi possível carregar os dados financeiros.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Verifique sua conexão ou a disponibilidade do banco de dados e tente novamente.
              </p>
          </div>
        </div>
      ) : (!stats || safeStats.itemCount === 0) ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: "center", maxWidth: "450px", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{ background: "var(--fill)", padding: "2rem", borderRadius: "50%", marginBottom: "1rem", color: "var(--text-secondary)" }}>
              <DollarSign size={48} strokeWidth={1} />
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Nenhum item cadastrado</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.5, margin: 0, marginBottom: "1rem" }}>
              Seu planejamento financeiro começa aqui. Adicione receitas, custos previstos e verbas de projetos para acompanhar a saúde financeira de suas iniciativas.
            </p>
            <Button onClick={() => setIsCreateOpen(true)} size="lg">
              <Plus size={16} /> Adicionar Primeiro Item
            </Button>
          </div>
        </div>
      ) : (
      <div className={styles.splitLayout}>
        <div className={styles.itemsListSection}>
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>Itens de Orçamento</h2>
            <span className={styles.listSubtitle}>{filteredItems.length} itens</span>
          </div>
          
          <div className={styles.itemsList}>
            {filteredItems.length === 0 ? (
              <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--text-secondary)", background: "var(--surface)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border)" }}>
                <Filter size={24} style={{ opacity: 0.5, marginBottom: "0.5rem" }} />
                <p>Nenhum item do orçamento corresponde ao filtro selecionado.</p>
                <Button variant="ghost" size="sm" onClick={() => setActiveFilter("all")} style={{ marginTop: "1rem" }}>
                  Limpar filtro
                </Button>
              </div>
            ) : filteredItems.map(item => {
              const contracted = Number(item.contractedAmount || 0);
              const paid = Number(item.paidAmount || 0);
              const progressPct = contracted > 0 ? (paid / contracted) * 100 : 0;

              return (
                <div key={item.id} className={styles.itemCard}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemTitleRow}>
                      <span className={styles.itemCategory}>{item.category}</span>
                      <h3 className={styles.itemTitle}>{item.description || 'Sem descrição'}</h3>
                    </div>
                    <div style={{ display: "flex", gap: "var(--spacing-3)", alignItems: "center" }}>
                      <Badge 
                        variant="outline"
                        className={`${styles.statusBadge} ${styles['status_' + item.status]}`}
                      >
                        {item.status === 'paid' ? 'Pago' : item.status === 'contracted' ? 'Contratado' : 'Pendente'}
                      </Badge>
                      <div className={styles.itemActions}>
                        <Button variant="ghost" size="icon-sm" onClick={() => setEditingItem(item)} aria-label="Editar">
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setDeletingItem(item)} aria-label="Excluir">
                          <Trash2 size={14} className={styles.trashIcon} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.itemMeta}>
                    <div className={styles.metaBadge}>
                      <span className={styles.metaDot}></span>
                      {item.projectName || 'Sem projeto'}
                    </div>
                    {item.vendor && <div className={styles.metaBadge}>{item.vendor}</div>}
                    {item.dueDate && <div className={styles.metaBadge}>{new Date(item.dueDate).toLocaleDateString('pt-BR')}</div>}
                  </div>

                  <div className={styles.amountsGrid}>
                    <div className={styles.amountCol}>
                      <span className={styles.amountLabel}>Previsto</span>
                      <span className={styles.amountValue}>{formatCurrency(Number(item.predictedAmount || 0))}</span>
                    </div>
                    <div className={styles.amountCol}>
                      <span className={styles.amountLabel}>Contratado</span>
                      <span className={styles.amountValue}>{formatCurrency(contracted)}</span>
                    </div>
                    <div className={styles.amountCol}>
                      <span className={styles.amountLabel}>Pago</span>
                      <span className={styles.amountValue}>{formatCurrency(paid)}</span>
                    </div>
                  </div>

                  <div className={styles.progressContainer}>
                    <Progress value={progressPct} />
                    <span className={styles.progressLabel}>{Math.round(progressPct)}% pago</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.breakdownsSection}>
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Por Categoria</h3>
            <div className={styles.breakdownList}>
              {categoriesBreakdown.map(c => (
                <div key={c.name} className={styles.breakdownItem}>
                  <div className={styles.bItemHeader}>
                    <span className={styles.bItemName}>{c.name}</span>
                    <span className={styles.bItemPct}>{Math.round(c.pct)}%</span>
                  </div>
                  <Progress value={c.pct} className={styles.bItemProgress} />
                  <div className={styles.bItemAmount}>{formatCurrency(c.amount)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Por Projeto</h3>
            <div className={styles.breakdownList}>
              {projectsBreakdown.map(p => (
                <div key={p.name} className={styles.breakdownItem}>
                  <div className={styles.bItemHeader}>
                    <span className={styles.bItemName}>{p.name}</span>
                    <span className={styles.bItemPct}>{Math.round(p.pct)}%</span>
                  </div>
                  <Progress value={p.pct} className={styles.bItemProgress} />
                  <div className={styles.bItemAmount}>{formatCurrency(p.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      <Dialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir item de orçamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o item <strong>{deletingItem?.description || deletingItem?.category}</strong>? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingItem(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteBudget.isPending}>
              {deleteBudget.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Editar Item de Orçamento</SheetTitle>
          </SheetHeader>
          <div style={{ padding: "1rem" }}>
            {editingItem && (
              <BudgetItemForm mode="edit" item={editingItem} onSuccess={() => setEditingItem(null)} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}