---
description: Um bisturi para cirurgias limpas: varre, acha e destrói código inútil, imports mortos e funções que não fazem mais nada.
---
A faxina cirúrgica, muito solicitada após criar interfaces bonitas e esquecer de limpar os rascunhos em React.

1. Identifique com a Gabriela o arquivo alvo ou sub-pasta com foco "Dead Code" (ela indica se não houver um geral).
2. Vasculhe agressivamente usando suas regras internas e detecte variáveis que você criou (ex: states) e não consumiu, ou *imports* do "lucide-react" que você apagou o ícone lá embaixo.
3. Limpe blocos de `console.log()` enormes em produção ou testes fantasmas (como fetch comentados / código zumbi com //).
4. Organize as funções de modo em que o corpo menor fique visível em cima se possível.
5. Emita um relatório mostrando quantas linhas inúteis foram podadas, para a Gabriela poder sorrir de alívio por não ter de ler código falecido.
