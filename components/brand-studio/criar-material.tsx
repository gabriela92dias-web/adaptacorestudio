import React from "react";
import { Button } from "../ui/button";
import { Palette, FileText, Package, Megaphone, Image } from "lucide-react";
import { Link } from "../ui/link";
import { motion } from "motion/react";

const MATERIAL_CATEGORIES = [
  {
    id: "identidade",
    title: "Identidade Visual",
    description: "Logo, cores e elementos visuais da marca",
    icon: Palette,
    path: "/brand/identity",
    color: "var(--gray-800)",
  },
  {
    id: "documentos",
    title: "Documentos Corporativos",
    description: "Papel timbrado, cartões, assinaturas de email",
    icon: FileText,
    path: "/tools/documentos",
    color: "var(--gray-700)",
  },
  {
    id: "marketing",
    title: "Marketing & Comunicação",
    description: "Newsletters, posts, materiais promocionais",
    icon: Megaphone,
    path: "/tools/marketing",
    color: "var(--gray-600)",
  },
  {
    id: "produtos",
    title: "Produtos & Embalagens",
    description: "Rótulos, tags, embalagens",
    icon: Package,
    path: "/tools/produtos",
    color: "var(--gray-700)",
  },
  {
    id: "comunicacao",
    title: "Comunicação Visual",
    description: "Placas, banners, uniformes",
    icon: Image,
    path: "/tools/visual",
    color: "var(--gray-800)",
  },
];

export function CriarMaterial() {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Materiais
          </h1>
          <p className="text-muted-foreground mt-2">
            Escolha o tipo de material que deseja criar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MATERIAL_CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} to={category.path}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-lg border cursor-pointer group"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--card-border)",
                  }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "var(--card-hover-shadow)";
                    e.currentTarget.style.borderColor = "var(--gray-400)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "var(--card-shadow)";
                    e.currentTarget.style.borderColor = "var(--card-border)";
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: category.color }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    {category.title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {category.description}
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}