import { useState } from 'react'
import './App.css'
import miraiLogo from './assets/mirai_logo_transparente_v2.png'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { ValoresStep, AtivosStep, PassivosStep, ReceitasStep, DespesasStep, FinalStep } from './components/FormSteps'

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    valores: { saude: [], financas: [], trabalho: [], relacionamentos: [], espiritualidade: [] },
    sonhos: { riqueza: '', proposito: '', receio: '', sobra: '', futuro5anos: '', futuro10anos: '', sonhosDesejos: '', angustiasMedos: '', legado: '' },
    ativos: [],
    passivos: [],
    receitas: [],
    despesas: []
  })

  const steps = [
    { id: 0, title: 'Bem-vindo', component: WelcomeStep },
    { id: 1, title: 'Valores e Sonhos', component: ValoresStep },
    { id: 2, title: 'O Que Você Tem', component: AtivosStep },
    { id: 3, title: 'O Que Você Deve', component: PassivosStep },
    { id: 4, title: 'O Que Você Recebe', component: ReceitasStep },
    { id: 5, title: 'O Que Você Gasta', component: DespesasStep },
    { id: 6, title: 'Finalizar', component: FinalStep }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="min-h-screen mirai-gradient">
      <header className="border-b border-secondary/30 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img src={miraiLogo} alt="MirAI Logo" className="h-12" />
          <h1 className="text-xl md:text-2xl font-bold mirai-text-gradient">
            Balanço Patrimonial Pessoal
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                index <= currentStep 
                  ? 'bg-primary border-primary text-white' 
                  : 'bg-card border-secondary/30 text-muted-foreground'
              }`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 transition-all ${
                  index < currentStep ? 'bg-primary' : 'bg-secondary/30'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-muted-foreground mt-2">
          Etapa {currentStep + 1} de {steps.length}: {steps[currentStep].title}
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <CurrentStepComponent 
          formData={formData} 
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      </main>

      {currentStep !== 0 && currentStep !== steps.length - 1 && (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-between gap-4">
            <button onClick={prevStep} className="mirai-button flex items-center gap-2" disabled={currentStep === 0}>
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>
            <button onClick={nextStep} className="mirai-button flex items-center gap-2">
              Próximo
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function WelcomeStep({ nextStep }) {
  return (
    <div className="mirai-card p-8 md:p-12 text-center space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold mirai-text-gradient">Seja bem-vindo(a)!</h2>
      <p className="text-lg text-foreground/90 max-w-2xl mx-auto">
        Este é o primeiro passo para construirmos juntos um futuro financeiro mais tranquilo 
        e alinhado com seus sonhos. Este formulário foi criado para ser simples e fácil de 
        preencher, mesmo que você não entenda de finanças.
      </p>
      
      <div className="bg-card/50 p-6 rounded-lg border border-secondary/30 text-left max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-primary">O que é o Balanço Patrimonial Pessoal?</h3>
        <p className="text-foreground/80 mb-4">É uma fotografia da sua vida financeira. Com ele, vamos organizar suas informações para:</p>
        <ul className="space-y-2 text-foreground/80">
          <li className="flex items-start gap-2"><span className="text-primary mt-1">✓</span><span>Entender quanto você pode gastar no futuro</span></li>
          <li className="flex items-start gap-2"><span className="text-primary mt-1">✓</span><span>Saber quanto pode economizar para realizar seus sonhos</span></li>
          <li className="flex items-start gap-2"><span className="text-primary mt-1">✓</span><span>Se proteger de preocupações com dinheiro</span></li>
        </ul>
      </div>

      <div className="bg-card/50 p-6 rounded-lg border border-secondary/30 text-left max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-secondary">Dicas Importantes</h3>
        <ul className="space-y-2 text-foreground/80">
          <li className="flex items-start gap-2"><span className="text-secondary mt-1">•</span><span>Seja sincero(a) com as respostas</span></li>
          <li className="flex items-start gap-2"><span className="text-secondary mt-1">•</span><span>Converse com sua família, este é um projeto de todos</span></li>
          <li className="flex items-start gap-2"><span className="text-secondary mt-1">•</span><span>Não tenha pressa. Faça com calma</span></li>
          <li className="flex items-start gap-2"><span className="text-secondary mt-1">•</span><span>Se não souber um valor exato, pode ser uma estimativa</span></li>
          <li className="flex items-start gap-2"><span className="text-secondary mt-1">•</span><span>Sinta-se à vontade para pular o que não se aplica a você</span></li>
        </ul>
      </div>

      <button onClick={nextStep} className="mirai-button flex items-center gap-2 mx-auto mt-8">
        Começar
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export default App

