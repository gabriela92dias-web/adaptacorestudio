import fs from 'fs';
import path from 'path';

// ============================================
// 🎙️ COREACT - ELEVENLABS AUDIO GENERATOR 🎙️
// ============================================

const API_KEY = process.env.ELEVENLABS_API_KEY || '1d836e3e36cf9c5f6da9c62256eed01a05923bb8f5532c5c78bc2d363c083124';
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'lL7IQ7DgdcaR3kAuepVR';

const payloads = [
  {
    lang: 'PT',
    filename: 'Podcast_CoreAct_PT.mp3',
    text: "Bom dia! Sei que não sou muito talentosa mandando áudio, então convoquei minha versão digital para fazer esse “pequeno episódio de podcast” e introduzir, de forma mais prática, o assunto que veremos em breve.\n\n" +
          "Nós estamos passando por um momento importante no setor de comunicação da Adápta, e eu estou ansiosa para dividir com vocês novas formas de trabalhar: rotinas atualizadas, processos reanalisados e uma estrutura mais clara para o que vem pela frente.\n\n" +
          "Meu objetivo neste momento é relatar os feitos das últimas semanas, que se dividem em três frentes importantes: o estudo da nossa atuação até aqui, a proposta de rebranding estruturada a partir desse estudo e, por fim, a apresentação oficial da Plataforma CoreAct, a nova infraestrutura que vai guiar nossas operações diárias no setor.\n\n" +
          "É natural que, para escalar e liderar na nossa categoria, os nossos processos internos de comunicação e entregas precisassem de um sistema centralizado, e não apenas de talento individual ou de equipes cada vez maiores.\n\n" +
          "Para entender o nosso futuro, precisamos de uma reflexão mais sofisticada sobre o que significa a janela de oportunidade que a nossa associação atravessa hoje.\n\n" +
          "O volume de pacientes em território nacional já ultrapassou 873 mil pessoas, evidenciando um crescimento de 30% no último ano, pulverizado em mais de 85% dos municípios brasileiros. Esse avanço também atrai o rigor extremo dos órgãos reguladores, como a RDC 1014. Instituições que operam com planilhas amadoras e branding caseiro não sobreviverão ao nível de profissionalização exigido pelo mercado e pelo Estado.\n\n" +
          "A união das associações, nos últimos anos, tem sido a garantia de sermos vistos como algo sólido e forte. Fazer parte do todo era uma medida de segurança, e entrar usando a mesma camisa era garantir que seríamos identificados. Esse firmamento certamente nos fez mais fortes, e nós colhemos os frutos dessa camuflagem.\n\n" +
          "Mas o que um dia nos protegeu hoje começa a nos ancorar: o verde quente e monocromático agora parece limitar a nossa identificação e o nosso impacto.\n\n" +
          "A adoção de um sistema escalável é a nossa blindagem institucional e também a nossa alavanca de sustentabilidade.\n\n" +
          "O nosso esforço não foi apenas garantir o hoje, mas arquitetar o futuro de uma comunicação mais ágil. É nesse contexto que surge a plataforma Adápta CoreAct, que vai oferecer uma rastreabilidade unificada, auditável e em tempo real das campanhas e iniciativas de comunicação. Isso significa um processo menos artesanal e lento, com menos margem para erros e inconsistências visuais.\n\n" +
          "E por que isso é crucial? Porque nós trabalhamos com acolhimento clínico e medicina em um mercado ainda estigmatizado. Se o nosso Instagram tem uma cara, o manual médico tem outra e o documento da diretoria tem outra, o cérebro humano lê isso como improviso. E improviso, na saúde, significa falta de protocolo e de segurança.\n\n" +
          "Um paciente não entrega a própria saúde, e um médico não prescreve com tranquilidade, para uma associação que parece amadora e muda de formato visual a cada entrega.\n\n" +
          "Não é por acaso que embarcamos nesse mundo do pioneirismo. Somos jovens, modernos e ousados. Mas também somos responsáveis, comprometidos e levamos maconha muito a sério. E a Adápta agora tem um sistema visual para garantir isso.\n\n" +
          "Construímos um sistema de design que viabiliza uma voz ainda mais ampla, forte e diversa, com a adição de novos grupos de fontes, cores e até mascotes. Esse material é inédito, e eu estou ansiosa para dividir tudo isso com vocês.\n\n" +
          "Como vocês sabem, meu PC está instável, e por isso estou demorando um pouco mais a bolar a apresentação final. Deve durar aproximadamente 20 minutos, me digam quando é conveniente."
  },
  {
    lang: 'DE',
    filename: 'Podcast_CoreAct_DE.mp3',
    text: "Guten Morgen! Ich weiß, ich bin nicht gerade besonders talentiert darin, Sprachnachrichten zu schicken — also habe ich meine digitale Version einberufen, um diese kleine Podcast-Folge zu übernehmen und das Thema, das wir uns bald anschauen werden, auf praktischere Weise einzuleiten.\n\n" +
          "Wir erleben gerade einen wichtigen Moment im Kommunikationsbereich der Adápta, und ich freue mich sehr darauf, mit euch neue Arbeitsweisen zu teilen: aktualisierte Routinen, neu durchdachte Prozesse und eine klarere Struktur für das, was vor uns liegt.\n\n" +
          "Mein Ziel in diesem Moment ist es, über die Ergebnisse der letzten Wochen zu berichten. Sie gliedern sich in drei wichtige Bereiche: die Analyse unserer bisherigen Arbeit, den darauf aufbauenden Rebranding-Vorschlag und schließlich die offizielle Vorstellung der Plattform CoreAct, der neuen Infrastruktur, die unsere täglichen Abläufe im Bereich Kommunikation künftig steuern wird.\n\n" +
          "Es ist nur folgerichtig, dass unsere internen Kommunikations- und Umsetzungsprozesse, wenn wir in unserer Kategorie wachsen und eine führende Rolle einnehmen wollen, ein zentrales System brauchen — und nicht nur individuelles Talent oder immer größere Teams.\n\n" +
          "Um unsere Zukunft zu verstehen, brauchen wir eine differenziertere Reflexion darüber, was für ein Möglichkeitsfenster sich für unsere Organisation gerade öffnet.\n\n" +
          "Die Zahl der Patientinnen und Patienten im Land liegt inzwischen bei über 873.000, was einem Wachstum von 30 Prozent im letzten Jahr entspricht — verteilt auf mehr als 85 Prozent der brasilianischen Gemeinden. Dieses Wachstum zieht zugleich die strenge Aufmerksamkeit der Regulierungsbehörden auf sich, etwa im Rahmen der RDC 1014. Institutionen, die noch mit amateurhaften Tabellen und einem hausgemachten Branding arbeiten, werden die Professionalisierung, die von Markt und Staat verlangt wird, nicht überstehen.\n\n" +
          "Die Vereinigung der Verbände in den letzten Jahren war eine wichtige Garantie dafür, als etwas Solides und Starkes wahrgenommen zu werden. Teil eines größeren Ganzen zu sein, war eine Form von Sicherheit. Dieselbe Farbe zu tragen bedeutete, sofort erkannt zu werden. Dieses Fundament hat uns zweifellos stärker gemacht, und wir haben die Früchte dieser Tarnung geerntet.\n\n" +
          "Aber was uns einst geschützt hat, beginnt uns heute auch festzuhalten: Das warme, monotone Grün scheint inzwischen unsere Wiedererkennbarkeit und unsere Wirkung eher zu begrenzen.\n\n" +
          "Die Einführung eines skalierbaren Systems ist deshalb nicht nur unser institutioneller Schutzschild, sondern auch ein Hebel für unsere Nachhaltigkeit.\n\n" +
          "Unser Einsatz galt nicht nur der Sicherung des Heute, sondern dem Entwurf einer agileren Zukunft für unsere Kommunikation. In diesem Zusammenhang entsteht die Plattform Adápta CoreAct, die eine einheitliche, überprüfbare und in Echtzeit verfügbare Nachverfolgbarkeit unserer Kommunikationskampagnen und Initiativen ermöglichen wird. Das bedeutet einen weniger handwerklichen und langsameren Prozess — mit weniger Spielraum für Fehler und visuelle Inkonsistenzen.\n\n" +
          "Und warum ist das so entscheidend? Weil wir im Bereich klinische Begleitung und Medizin arbeiten — in einem Markt, der noch immer stigmatisiert ist. Wenn unser Instagram wie das eine aussieht, das medizinische Manual wie etwas anderes und die Unterlagen der Direktion wieder ganz anders, dann liest das menschliche Gehirn genau das als Improvisation.\n\n" +
          "Und Improvisation bedeutet im Gesundheitsbereich fehlendes Protokoll und fehlende Sicherheit. Ein Patient vertraut seine Gesundheit nicht einer Organisation an, die amateurhaft wirkt und bei jeder Lieferung ihr visuelles Erscheinungsbild verändert — und auch ein Arzt verschreibt nicht mit Ruhe und Vertrauen an eine Institution, die nicht konsistent wirkt.\n\n" +
          "Es ist also kein Zufall, dass wir diesen Weg des Pioniergeists eingeschlagen haben. Wir sind jung, modern und mutig. Aber wir sind auch verantwortungsvoll, engagiert — und wir nehmen Cannabis verdammt ernst. Und Adápta hat jetzt ein visuelles System, das genau das absichert.\n\n" +
          "Wir haben ein Designsystem aufgebaut, das eine noch breitere, stärkere und vielfältigere Stimme ermöglicht — mit neuen Schriftgruppen, neuen Farben und sogar neuen Maskottchen. Dieses Material ist inédit, und ich freue mich sehr darauf, all das mit euch zu teilen.\n\n" +
          "Wie ihr wisst, ist mein Computer gerade instabil, und deshalb brauche ich für den Feinschliff der Präsentation ein wenig länger. Ich bin also noch dabei, sie für euch sauber vorzudrehen. Sie wird ungefähr 20 Minuten dauern — sagt mir einfach, wann es euch diese Woche am besten passt."
  }
];

const MODEL_ID = 'eleven_multilingual_v2'; 

async function generateAudio(lang, filename, text) {
  console.log('[+] Iniciando geração do áudio em ' + lang + '...');
  
  const url = 'https://api.elevenlabs.io/v1/text-to-speech/' + VOICE_ID;
  const body = {
    text: text,
    model_id: MODEL_ID,
    voice_settings: {
      stability: 0.45,         // Safe, sem esticar!
      similarity_boost: 0.85,  // Original
      style: 0.0,              // ZERO exageros! Isso elimina o bug de esticar 100%
      use_speaker_boost: true
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[!] ERRO na API ao gerar ' + lang + ':', response.status, errorText);
        return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const outputPath = path.resolve(process.cwd(), filename);
    fs.writeFileSync(outputPath, buffer);
    console.log('[+] ' + lang + ' Gerado com Sucesso! Salvo em: ' + outputPath);

  } catch (error) {
    console.error('[!] Erro fatal ao gerar áudio em ' + lang + ':', error.message);
  }
}

async function runGenerations() {
  console.log('--- EXECUTANDO EMERGÊNCIA ANTI-ESTICAMENTO ---');
  for (const p of payloads) {
    await generateAudio(p.lang, p.filename, p.text);
  }
}

runGenerations();
