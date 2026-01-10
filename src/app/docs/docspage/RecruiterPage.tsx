import { IoIosArrowForward } from "react-icons/io";

export default function RecruiterPage() {

  const steps = [
    {
      id: 1,
      title: "Solicitação Inicial",
      description: `
        A primeira etapa do processo começa aqui no site. O candidato deve preencher um simples formulário de inscrição, fornecendo informações 
        básicas como nome do personagem, ID, turnos, telefone e o nome e ID do membro que o indicou. Após o envio, a Gerência estará
        analisando o perfil do candidato e irá aprovar ou reprovar a solicitação.
      `,
      note: "Certifique-se de que todas as informações estejam corretas antes de enviar."
    },
    {
      id: 2,
      title: "Formulário ",
      description: `
        Após a aprovação da solicitação inicial, o candidato será submetido a um formulário mais detalhado. Este formulário visa avaliar o
        conhecimento geral do candidato, histórico de atividades e conduta. É crucial responder com atenção e sinceridade, pois isso 
        refletirá o comprometimento do candidato com a organização e definirá sua elegibilidade para avançar no processo. 
      `,
      note: "Após o envio, pode demorar até 24 horas para análise e resultado."
    },
    {
      id: 3,
      title: "Entrevista",
      description: `
        A partir dessa etapa, os processos serão feitos dentro do jogo. O candidato pariticipará de um encontro especial com a Gerência da
        Trindade. Esse encontro é um momento crucial para avaliar o candidato e garantir que ele esteja pronto para ingressar na família. 
        Ele receberá uma ligação e deverá seguir todos os passos que forem informados na mesma.
      `,
      note: "Não precisa ficar com medo, é só uma conversa normal... ou quase isso."
    },
    {
      id: 4,
      title: "Etapa Final",
      description: `
        Se o candidato chegou até aqui, significa que ele já está praticamente dentro da família. Nesta última etapa, ele participará de um 
        evento especial organizado pela Gerência. O tipo de evento será informado no local e na data que a mesma
        for marcada. Após a conclusão bem-sucedida desta etapa, o candidato será oficialmente integrado à Trindade Penumbra como um membro
        ativo.
      `,
      note: "Prepare-se para mostrar suas habilidades e comprometimento durante o evento."
    }
  ];

  return (
    <section className="relative rounded-2xl min-h-screen bg-neutral-950 text-gray-300 font-sans selection:bg-red-900 selection:text-white overflow-hidden flex flex-col">

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20 md:px-12 w-full">
        
        <div className="items-center gap-2 text-xs text-red-500 font-medium mb-6 bg-[#0a0a0a]/50 inline-flex px-3 py-1 rounded-full border border-red-500/20">
          <span>Docs</span>
          <span><IoIosArrowForward /></span>
          <span>Recrutamento</span>
          <span><IoIosArrowForward /></span>
          <span className="text-gray-400">Processo Seletivo</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 mt-6">
          Recrutamento
        </h1>
        <p className="mb-12">
          Aprenda o passo a passo para se tornar um membro oficial da <span className="text-white font-semibold">Máfia Trindade Penumbra</span>.
        </p>

        <hr className='bg-gray-600/40 border-0 h-px mb-12' />

        <h1 className="text-4xl md:text-4xl font-bold text-white mb-6 mt-6">
          Como funciona o Recrutamento?
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed mb-12 border-l-4 border-red-600 pl-6">
          Para ingressar na <span className="text-white font-semibold">Máfia Trindade Penumbra</span>, 
          é necessário seguir o passo a passo abaixo para garatir uma vaga na Família.
        </p>

        <p className="text-gray-400 mb-12 text-lg">
          O processo seletivo da Trindade Penumbra é rigoroso e visa garantir que apenas os candidatos mais dedicados e alinhados com 
          nossos valores se juntem à nossa família. Abaixo, detalhamos cada etapa do processo.
        </p>

        <hr className='bg-gray-600/40 border-0 h-px mb-12' />

        <h2 className="text-3xl font-bold text-white mb-8">
          → Requisito 1 - <span className="text-gray-400">Indicação</span>
          <p className="text-lg font-normal text-gray-400 mt-2">
            Para que o usuário possa conseguir se candidatar, é necessário que um membro ativo da Trindade 
            Penumbra o indique. Isso garante que todos os novos membros tenham uma conexão prévia com a Família e sejam de confiança. 
            Você deve sempre entrar em contanto com algum membro da gerência caso queira indicar alguém. Essa pessoa também terá que 
            colocar seu nome e id no formulário de solicitação inicial.
          </p>
        </h2>

        <h2 className="text-3xl font-bold text-white mb-8">
          → Requisito 2 - <span className="text-green-500">Ciclos de Recrutamento</span>
          <p className="text-lg font-normal text-gray-400 mt-2">
            Para manter a qualidade e o controle sobre os novos membros, a Trindade Penumbra adota ciclos de recrutamento.
            Durante esses períodos, os candidatos podem se inscrever e passar pelo processo seletivo. Fora desses ciclos, as inscrições
            ficam temporariamente fechadas. Então fique atento às datas de abertura!
          </p>
        </h2>

        <h2 className="text-3xl font-bold text-white mb-8">
          → Requisito 3 - <span className="text-red-500">Processo Seletivo</span>
          <p className="text-lg font-normal text-gray-400 mt-2">
            Após a conclusão dos passos 1 e 2, o candidato passará por um processo seletivo estruturado em várias etapas, que estão
            detalhadas abaixo.
          </p>
        </h2>

        <hr className='bg-gray-600/40 border-0 h-px mb-22' />

        <div className="space-y-12 mt-18">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Etapas do Processo Seletivo
          </h1>
          {steps.map((step) => (
            <div key={step.id} className="relative group">
              {step.id !== steps.length && (
                <div className="absolute left-[27px] top-12 -bottom-12 w-0.5 bg-white/10 group-hover:bg-red-900/50 transition-colors"></div>
              )}

              <div className="flex gap-6">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-lg group-hover:border-red-500/30 group-hover:text-red-500 transition-all z-10">
                  {step.id}
                </div>

                <div className="pt-2 pb-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-3">
                    {step.description}
                  </p>
                  {step.note && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded bg-red-500/5 border border-red-500/10 text-sm text-red-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      {step.note}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className='bg-gray-600/40 border-0 h-px mb-12 mt-10' />

        <h2 className="text-3xl font-bold text-green-500 mb-8">
          🎉 Setagem no Sistema
          <p className="text-lg font-normal text-gray-400 mt-2">
            Enfim, após a conclusão bem-sucedida de todas as etapas do processo seletivo, o novo membro será oficialmente
            integrado ao sistema da Trindade Penumbra. Ele será adicionado ao servidor, receberá os cargos, ganhará um apelido novinho
            e terá acesso ao restante do site, tudo automatizado pelo nosso sistema interno de gerenciamento de membros.
          </p>
        </h2>

        <div className="mt-20 p-8 rounded-2xl bg-linear-to-r from-red-900/10 to-transparent border border-white/5">
          <h4 className="text-white font-bold mb-2">Ainda com dúvidas?</h4>
          <p className="text-sm text-gray-400 mb-4">
            Se você encontrou algum problema técnico durante a inscrição, entre em contato com um Gerênte via Discord.
          </p>
        </div>

        <div className="mt-4 p-8 rounded-2xl bg-linear-to-r from-green-900/10 to-transparent border border-white/5">
          <p className="text-sm text-green-400">
            Se você já é um membro da Trindade Penumbra e está enfrentando dificuldades para acessar o site, considere fazer o
            recadastramento para atualizar suas informações e garantir seu acesso contínuo à nossa comunidade.
          </p>
        </div>

      </div>
    </section>
  );

}