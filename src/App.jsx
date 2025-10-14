import { useState, useEffect } from 'react'
import './App.css'
import miraiLogo from './assets/mirai_logo_transparente_v2.png'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { ValoresStep, AtivosStep, PassivosStep, ReceitasStep, DespesasStep, InvestimentosFuturosStep, FinalStep } from './components/FormSteps'

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  
  // Tenta carregar dados salvos do localStorage
  const getInitialFormData = () => {
    try {
      const savedData = localStorage.getItem('balancoPatrimonialData')
      if (savedData) {
        return JSON.parse(savedData)
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error)
    }
    return {
      auth: { nomeFamilia: '', email: '', senha: '', confirmarSenha: '' },
      valores: { saude: [], financas: [], trabalho: [], relacionamentos: [], espiritualidade: [] },
      sonhos: { riqueza: '', proposito: '', receio: '', sobra: '', futuro5anos: '', futuro10anos: '', sonhosDesejos: '', angustiasMedos: '', legado: '' },
      ativos: {},
      ativosCustom: {},
      passivos: {},
      passivosCustom: {},
      receitas: {},
      receitasCustom: {},
      despesas: {},
      despesasCustom: {},
      investimentosFuturos: {}
    }
  }
  
  const [formData, setFormData] = useState(getInitialFormData)
  const [showSavedNotification, setShowSavedNotification] = useState(false)
  
  // Verifica se há dados salvos ao carregar
  useEffect(() => {
    const savedData = localStorage.getItem('balancoPatrimonialData')
    if (savedData) {
      const hasData = Object.values(JSON.parse(savedData)).some(value => {
        if (typeof value === 'object' && value !== null) {
          return Object.keys(value).length > 0
        }
        return false
      })
      if (hasData) {
        setTimeout(() => {
          alert('💾 Bem-vindo de volta! Seus dados foram recuperados automaticamente. Você pode continuar de onde parou.')
        }, 500)
      }
    }
  }, [])
  
  // Salva automaticamente no localStorage sempre que formData mudar
  useEffect(() => {
    try {
      localStorage.setItem('balancoPatrimonialData', JSON.stringify(formData))
      // Mostra notificação de salvamento
      setShowSavedNotification(true)
      const timer = setTimeout(() => setShowSavedNotification(false), 2000)
      return () => clearTimeout(timer)
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
    }
  }, [formData])
  
  // Função para limpar o formulário
  const clearForm = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados do formulário? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('balancoPatrimonialData')
      setFormData({
        auth: { nomeFamilia: '', email: '', senha: '', confirmarSenha: '' },
        valores: { saude: [], financas: [], trabalho: [], relacionamentos: [], espiritualidade: [] },
        sonhos: { riqueza: '', proposito: '', receio: '', sobra: '', futuro5anos: '', futuro10anos: '', sonhosDesejos: '', angustiasMedos: '', legado: '' },
        ativos: {},
        ativosCustom: {},
        passivos: {},
        passivosCustom: {},
        receitas: {},
        receitasCustom: {},
        despesas: {},
        despesasCustom: {},
        investimentosFuturos: {}
      })
      setCurrentStep(0)
      alert('✅ Formulário limpo com sucesso!')
    }
  }

  const steps = [
    { id: 0, title: 'Bem-vindo', component: WelcomeStep },
    { id: 1, title: 'Valores e Sonhos', component: ValoresStep },
    { id: 2, title: 'Ativos', component: AtivosStep },
    { id: 3, title: 'Passivos', component: PassivosStep },
    { id: 4, title: 'Receitas', component: ReceitasStep },
    { id: 5, title: 'Despesas', component: DespesasStep },
    { id: 6, title: 'Investimentos Futuros', component: InvestimentosFuturosStep },
    { id: 7, title: 'Finalizar', component: FinalStep }
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
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold mirai-text-gradient">
              Balanço Patrimonial Pessoal
            </h1>
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <button
                onClick={clearForm}
                className="text-sm text-destructive hover:text-destructive/80 transition-colors hidden md:block"
                title="Limpar todos os dados"
              >
                Limpar Formulário
              </button>
            )}
          </div>
        </div>
        {/* Notificação de salvamento automático */}
        {showSavedNotification && (
          <div className="fixed top-20 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
            ✔️ Dados salvos automaticamente
          </div>
        )}
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

function WelcomeStep({ nextStep, formData, setFormData }) {
  const [errors, setErrors] = useState({})

  const validateAndProceed = () => {
    const newErrors = {}
    
    if (!formData.auth.nomeFamilia.trim()) {
      newErrors.nomeFamilia = 'Por favor, informe o nome da família'
    }
    
    if (!formData.auth.email.trim()) {
      newErrors.email = 'Por favor, informe seu email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.auth.email)) {
      newErrors.email = 'Por favor, informe um email válido'
    }
    
    if (!formData.auth.senha) {
      newErrors.senha = 'Por favor, crie uma senha'
    } else if (formData.auth.senha.length < 6) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres'
    }
    
    if (formData.auth.senha !== formData.auth.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      nextStep()
    }
  }

  const updateAuth = (field, value) => {
    setFormData(prev => ({
      ...prev,
      auth: { ...prev.auth, [field]: value }
    }))
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

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

      <div className="bg-card/50 p-6 rounded-lg border border-primary/30 text-left max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-primary text-center">Crie sua conta para começar</h3>
        <p className="text-sm text-foreground/70 mb-6 text-center">
          Você usará estes dados para acessar seu dashboard personalizado depois
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Nome da Família/Cliente *</label>
            <input
              type="text"
              value={formData.auth.nomeFamilia}
              onChange={(e) => updateAuth('nomeFamilia', e.target.value)}
              placeholder="Ex: Família Silva"
              className={`mirai-input w-full ${errors.nomeFamilia ? 'border-red-500' : ''}`}
            />
            {errors.nomeFamilia && <p className="text-red-500 text-sm mt-1">{errors.nomeFamilia}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Email *</label>
            <input
              type="email"
              value={formData.auth.email}
              onChange={(e) => updateAuth('email', e.target.value)}
              placeholder="seu@email.com"
              className={`mirai-input w-full ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Criar Senha *</label>
            <input
              type="password"
              value={formData.auth.senha}
              onChange={(e) => updateAuth('senha', e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className={`mirai-input w-full ${errors.senha ? 'border-red-500' : ''}`}
            />
            {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Confirmar Senha *</label>
            <input
              type="password"
              value={formData.auth.confirmarSenha}
              onChange={(e) => updateAuth('confirmarSenha', e.target.value)}
              placeholder="Digite a senha novamente"
              className={`mirai-input w-full ${errors.confirmarSenha ? 'border-red-500' : ''}`}
            />
            {errors.confirmarSenha && <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha}</p>}
          </div>
        </div>
      </div>

      <button onClick={validateAndProceed} className="mirai-button flex items-center gap-2 mx-auto mt-8">
        Começar
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export default App

