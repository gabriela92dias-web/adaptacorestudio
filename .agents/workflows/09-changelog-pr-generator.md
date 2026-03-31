---
description: Monta um changelog primoroso de todos os commits ou arquivos em que mexemos na sessão.
---
Quando a Gabriela pedir para gerar o relatório final de todas as horas gastadas, ou ao bater uma nova release Vercel, use este workflow:

1. Capture o log mais recente usando `git log --pretty=oneline -10` (ou consulte os arquivos alterados com `git status` caso não estarmos versionando tudo em commits).
2. Formate uma lista em Markdown altamente visual focado no que foi *entregue*, simplificando o jargão que executivos ou outros membros da CoreStudio não entenderiam.
3. Use seções bonitas: "✨ Novidades Adicionadas", "🐛 Bugs Críticos Resolvidos", e "👗 Melhorias de UI / UX / Design System".
4. Gere esse arquivo textualmente pra Gabriela (pode colocar na pasta temp ou na tela com carrossel/markdown artifact) para que ela só consiga dar Crtl+C e mandar na sua janela principal de relatórios!
