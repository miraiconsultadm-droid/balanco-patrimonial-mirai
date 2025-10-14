import { Download, Send } from 'lucide-react'

export function ValoresStep({ formData, setFormData }) {
  const valoresOptions = {
    saude: ["Vitalidade", "Harmonia", "Longevidade", "Energia", "Beleza", "Humor", "Equilíbrio", "Prazer", "Vigor", "Peso ideal", "Paciência", "Lazer", "Esporte", "Alimentação", "Dinamismo", "Alegria", "Bem-estar", "Conforto", "Inteligência", "Satisfação"],
    financas: ["Liberdade", "Segurança", "Respeito", "Prazer", "Oportunidades", "Realização", "Progresso", "Equilíbrio", "Diversão", "Conquista", "Independência", "Patrimônio", "Abundância", "Poder", "Estabilidade", "Cultura", "Conforto", "Prestígio", "Lazer", "Sucesso"],
    trabalho: ["Respeito", "Liberdade", "Harmonia", "Aprendizado", "Competência", "Evolução", "Entusiasmo", "Desenvolvimento", "Autoestima", "Motivação", "Confiança", "Excelência", "Estabilidade", "Sabedoria", "Renovação", "Liderança", "Oportunidade", "Dedicação", "Ousadia", "Compartilhamento"],
    relacionamentos: ["Amor", "Carinho", "Prazer", "Entendimento", "Crescimento", "Gratidão", "Liberdade", "Cumplicidade", "Equilíbrio", "Amizade", "Colaboração", "Sexualidade", "Paz", "Doação", "Diálogo", "Sinceridade", "Tesão", "Idealismo", "Honestidade", "Comunicação"],
    espiritualidade: ["Fé", "Finalidade", "Harmonia", "Transcendência", "Aceitação", "Transformação", "Deus", "Plenitude", "Esperança", "Fraternidade", "Compaixão", "Humildade", "Resignação", "Livre arbítrio", "Crescimento", "Sabedoria", "Consciência", "Serenidade", "Equilíbrio", "Sintonia"]
  }

  const toggleValor = (categoria, valor) => {
    const current = formData.valores[categoria] || []
    const index = current.indexOf(valor)
    
    if (index > -1) {
      setFormData({
        ...formData,
        valores: {
          ...formData.valores,
          [categoria]: current.filter(v => v !== valor)
        }
      })
    } else if (current.length < 7) {
      setFormData({
        ...formData,
        valores: {
          ...formData.valores,
          [categoria]: [...current, valor]
        }
      })
    }
  }

  const updateSonho = (field, value) => {
    setFormData({
      ...formData,
      sonhos: {
        ...formData.sonhos,
        [field]: value
      }
    })
  }

  const categoriaLabels = {
    saude: 'Saúde',
    financas: 'Finanças',
    trabalho: 'Trabalho',
    relacionamentos: 'Relacionamentos',
    espiritualidade: 'Espiritualidade'
  }

  return (
    <div className="space-y-8">
      <div className="mirai-card p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mirai-text-gradient mb-4">Seus Valores e Sonhos</h2>
        <p className="text-foreground/80 mb-6">
          Vamos começar com a parte mais importante: o que move você e sua família. 
          Selecione até 7 valores em cada categoria que mais representam o que é importante para você.
        </p>

        {Object.entries(valoresOptions).map(([categoria, opcoes]) => (
          <div key={categoria} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-primary">
              {categoriaLabels[categoria]} ({(formData.valores[categoria] || []).length}/7)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {opcoes.map((valor) => {
                const isSelected = (formData.valores[categoria] || []).includes(valor)
                return (
                  <button
                    key={valor}
                    onClick={() => toggleValor(categoria, valor)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      isSelected
                        ? 'bg-primary border-primary text-white'
                        : 'bg-card border-secondary/30 text-foreground hover:border-secondary'
                    }`}
                  >
                    {valor}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mirai-card p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mirai-text-gradient mb-4">Seus Sonhos, Medos e Desafios</h2>
        <p className="text-foreground/80 mb-6">
          Agora, gostaríamos que você respondesse a algumas perguntas. Não há respostas certas ou erradas. Apenas seja sincero(a).
        </p>

        <div className="space-y-6">
          {[
            { field: 'riqueza', label: 'O que é riqueza para você?' },
            { field: 'proposito', label: 'Qual o propósito do seu patrimônio?' },
            { field: 'receio', label: 'Qual o seu maior receio em relação à sua família e ao seu dinheiro?' },
            { field: 'sobra', label: 'Se houvesse uma sobra de recursos na sua vida, o que você faria com ela?' },
            { field: 'futuro5anos', label: 'Como você imagina a sua vida daqui a 5 anos?' },
            { field: 'futuro10anos', label: 'E daqui a 10 anos?' },
            { field: 'sonhosDesejos', label: 'Quais são os seus maiores sonhos e desejos?' },
            { field: 'angustiasMedos', label: 'Quais são as suas maiores angústias e medos financeiros?' },
            { field: 'legado', label: 'O que você gostaria de deixar como legado?' }
          ].map(({ field, label }) => (
            <div key={field}>
              <label className="block text-foreground mb-2 font-medium">{label}</label>
              <textarea
                value={formData.sonhos[field]}
                onChange={(e) => updateSonho(field, e.target.value)}
                className="mirai-input w-full min-h-24 resize-y"
                placeholder="Digite sua resposta aqui..."
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AtivosStep({ formData, setFormData }) {
  const categorias = {
    "Investimentos": ["Poupança", "Ações na bolsa", "Fundos de investimento", "Tesouro Direto", "Criptomoedas (Bitcoin, etc.)"],
    "Imóveis": ["Casa ou apartamento onde mora", "Casa de praia ou campo", "Terrenos", "Imóveis alugados para outras pessoas"],
    "Veículos": ["Carro", "Moto"],
    "Dinheiro em Conta": ["Conta corrente", "Dinheiro guardado em casa"],
    "Negócios": ["Participação em alguma empresa"],
    "Outros Bens de Valor": ["Obras de arte", "Joias"]
  }

  const addAtivo = (categoria, item) => {
    setFormData({
      ...formData,
      ativos: [...formData.ativos, { categoria, item, valor: '' }]
    })
  }

  const updateAtivo = (index, field, value) => {
    const newAtivos = [...formData.ativos]
    newAtivos[index][field] = value
    setFormData({ ...formData, ativos: newAtivos })
  }

  const removeAtivo = (index) => {
    setFormData({
      ...formData,
      ativos: formData.ativos.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="mirai-card p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mirai-text-gradient mb-4">O Que Você Tem (Ativos)</h2>
      <p className="text-foreground/80 mb-6">
        Agora, vamos listar as coisas que você possui. Não se preocupe se não tiver muitos itens, 
        o importante é começar a organizar.
      </p>

      {Object.entries(categorias).map(([categoria, itens]) => (
        <div key={categoria} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-primary">{categoria}</h3>
          <div className="space-y-3">
            {itens.map((item) => (
              <div key={item} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
                <p className="text-foreground mb-2">Você possui "{item}"?</p>
                <button
                  onClick={() => addAtivo(categoria, item)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  + Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {formData.ativos.length > 0 && (
        <div className="mt-8 border-t border-secondary/30 pt-8">
          <h3 className="text-xl font-semibold mb-4 text-secondary">Seus Ativos Adicionados</h3>
          <div className="space-y-4">
            {formData.ativos.map((ativo, index) => (
              <div key={index} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{ativo.categoria}</p>
                    <p className="font-medium">{ativo.item}</p>
                  </div>
                  <button
                    onClick={() => removeAtivo(index)}
                    className="text-destructive hover:text-destructive/80 text-sm"
                  >
                    Remover
                  </button>
                </div>
                <input
                  type="text"
                  value={ativo.valor}
                  onChange={(e) => updateAtivo(index, 'valor', e.target.value)}
                  placeholder="R$ Valor aproximado"
                  className="mirai-input w-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function PassivosStep({ formData, setFormData }) {
  const categorias = {
    "Financiamentos": ["Financiamento de imóvel", "Financiamento de carro"],
    "Empréstimos": ["Empréstimo pessoal", "Empréstimo consignado"],
    "Cartão de Crédito": ["Fatura do cartão de crédito"],
    "Contas da Casa": ["Aluguel", "Condomínio", "Contas de luz, água, gás, internet"],
    "Educação": ["Mensalidade da escola ou faculdade"],
    "Outros Compromissos": ["Impostos a pagar (IPVA, IPTU)", "Plano de saúde"]
  }

  const addPassivo = (categoria, item) => {
    setFormData({
      ...formData,
      passivos: [...formData.passivos, { categoria, item, valor: '', parcelas: '' }]
    })
  }

  const updatePassivo = (index, field, value) => {
    const newPassivos = [...formData.passivos]
    newPassivos[index][field] = value
    setFormData({ ...formData, passivos: newPassivos })
  }

  const removePassivo = (index) => {
    setFormData({
      ...formData,
      passivos: formData.passivos.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="mirai-card p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mirai-text-gradient mb-4">O Que Você Deve (Passivos)</h2>
      <p className="text-foreground/80 mb-6">
        Nesta etapa, vamos organizar seus compromissos financeiros, como contas e dívidas. 
        Ter clareza sobre isso é fundamental para sua tranquilidade.
      </p>

      {Object.entries(categorias).map(([categoria, itens]) => (
        <div key={categoria} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-primary">{categoria}</h3>
          <div className="space-y-3">
            {itens.map((item) => (
              <div key={item} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
                <p className="text-foreground mb-2">Você tem "{item}"?</p>
                <button
                  onClick={() => addPassivo(categoria, item)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  + Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {formData.passivos.length > 0 && (
        <div className="mt-8 border-t border-secondary/30 pt-8">
          <h3 className="text-xl font-semibold mb-4 text-secondary">Seus Passivos Adicionados</h3>
          <div className="space-y-4">
            {formData.passivos.map((passivo, index) => (
              <div key={index} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{passivo.categoria}</p>
                    <p className="font-medium">{passivo.item}</p>
                  </div>
                  <button
                    onClick={() => removePassivo(index)}
                    className="text-destructive hover:text-destructive/80 text-sm"
                  >
                    Remover
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={passivo.valor}
                    onChange={(e) => updatePassivo(index, 'valor', e.target.value)}
                    placeholder="R$ Valor da parcela ou conta"
                    className="mirai-input w-full"
                  />
                  <input
                    type="text"
                    value={passivo.parcelas}
                    onChange={(e) => updatePassivo(index, 'parcelas', e.target.value)}
                    placeholder="Quantas parcelas faltam?"
                    className="mirai-input w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function ReceitasStep({ formData, setFormData }) {
  const categorias = {
    "Do seu Trabalho": ["Salário", "Renda como autônomo(a) ou profissional liberal", "Bônus e comissões"],
    "De Aluguéis e Investimentos": ["Aluguel de imóveis", "Rendimento de investimentos"],
    "Outras Fontes": ["Aposentadoria ou pensão", "Renda de um segundo trabalho ou 'bico'"]
  }

  const addReceita = (categoria, item) => {
    setFormData({
      ...formData,
      receitas: [...formData.receitas, { categoria, item, valor: '' }]
    })
  }

  const updateReceita = (index, field, value) => {
    const newReceitas = [...formData.receitas]
    newReceitas[index][field] = value
    setFormData({ ...formData, receitas: newReceitas })
  }

  const removeReceita = (index) => {
    setFormData({
      ...formData,
      receitas: formData.receitas.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="mirai-card p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mirai-text-gradient mb-4">O Que Você Recebe (Receitas)</h2>
      <p className="text-foreground/80 mb-6">
        Aqui, vamos anotar todo o dinheiro que entra na sua casa. 
        Isso nos ajuda a entender o total da sua renda.
      </p>

      {Object.entries(categorias).map(([categoria, itens]) => (
        <div key={categoria} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-primary">{categoria}</h3>
          <div className="space-y-3">
            {itens.map((item) => (
              <div key={item} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
                <p className="text-foreground mb-2">Você recebe dinheiro de "{item}"?</p>
                <button
                  onClick={() => addReceita(categoria, item)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  + Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {formData.receitas.length > 0 && (
        <div className="mt-8 border-t border-secondary/30 pt-8">
          <h3 className="text-xl font-semibold mb-4 text-secondary">Suas Receitas Adicionadas</h3>
          <div className="space-y-4">
            {formData.receitas.map((receita, index) => (
              <div key={index} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{receita.categoria}</p>
                    <p className="font-medium">{receita.item}</p>
                  </div>
                  <button
                    onClick={() => removeReceita(index)}
                    className="text-destructive hover:text-destructive/80 text-sm"
                  >
                    Remover
                  </button>
                </div>
                <input
                  type="text"
                  value={receita.valor}
                  onChange={(e) => updateReceita(index, 'valor', e.target.value)}
                  placeholder="R$ Valor mensal"
                  className="mirai-input w-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function DespesasStep({ formData, setFormData }) {
  const categorias = {
    "Moradia": ["Aluguel ou prestação da casa", "Condomínio", "Contas (água, luz, gás, internet)"],
    "Alimentação": ["Supermercado", "Restaurantes e lanches fora de casa"],
    "Transporte": ["Combustível", "Transporte público ou por aplicativo", "Manutenção do carro"],
    "Saúde": ["Plano de saúde", "Medicamentos", "Consultas e exames"],
    "Lazer": ["Academia", "Cinema, shows, passeios", "Viagens curtas"],
    "Educação": ["Mensalidade da escola ou faculdade", "Cursos e livros"],
    "Cuidados Pessoais": ["Salão de beleza, barbearia", "Roupas e sapatos"],
    "Filhos e Pets": ["Mesada", "Gastos com material escolar", "Ração e veterinário"]
  }

  const addDespesa = (categoria, item) => {
    setFormData({
      ...formData,
      despesas: [...formData.despesas, { categoria, item, valor: '' }]
    })
  }

  const updateDespesa = (index, field, value) => {
    const newDespesas = [...formData.despesas]
    newDespesas[index][field] = value
    setFormData({ ...formData, despesas: newDespesas })
  }

  const removeDespesa = (index) => {
    setFormData({
      ...formData,
      despesas: formData.despesas.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="mirai-card p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mirai-text-gradient mb-4">O Que Você Gasta (Despesas)</h2>
      <p className="text-foreground/80 mb-6">
        Para finalizar, vamos entender para onde vai o seu dinheiro no dia a dia. 
        Anote os gastos mensais da sua família.
      </p>

      {Object.entries(categorias).map(([categoria, itens]) => (
        <div key={categoria} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-primary">{categoria}</h3>
          <div className="space-y-3">
            {itens.map((item) => (
              <div key={item} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
                <p className="text-foreground mb-2">Qual o seu gasto mensal com "{item}"?</p>
                <button
                  onClick={() => addDespesa(categoria, item)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  + Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {formData.despesas.length > 0 && (
        <div className="mt-8 border-t border-secondary/30 pt-8">
          <h3 className="text-xl font-semibold mb-4 text-secondary">Suas Despesas Adicionadas</h3>
          <div className="space-y-4">
            {formData.despesas.map((despesa, index) => (
              <div key={index} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{despesa.categoria}</p>
                    <p className="font-medium">{despesa.item}</p>
                  </div>
                  <button
                    onClick={() => removeDespesa(index)}
                    className="text-destructive hover:text-destructive/80 text-sm"
                  >
                    Remover
                  </button>
                </div>
                <input
                  type="text"
                  value={despesa.valor}
                  onChange={(e) => updateDespesa(index, 'valor', e.target.value)}
                  placeholder="R$ Valor mensal aproximado"
                  className="mirai-input w-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function FinalStep({ formData }) {
  const downloadJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `balanco_patrimonial_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const sendEmail = () => {
    const subject = 'Balanço Patrimonial Pessoal - Preenchido'
    const body = `Olá, segue meu Balanço Patrimonial Pessoal preenchido.\n\nPor favor, baixe o arquivo JSON anexo para análise.`
    window.location.href = `mailto:contato@mirai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="mirai-card p-8 md:p-12 text-center space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold mirai-text-gradient">Parabéns! Você concluiu o formulário!</h2>
      <p className="text-lg text-foreground/90 max-w-2xl mx-auto">
        Agora você pode baixar suas respostas e enviá-las para nossa equipe. 
        Vamos analisar suas informações e preparar seu fluxo de caixa personalizado.
      </p>

      <div className="bg-card/50 p-6 rounded-lg border border-secondary/30 text-left max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-primary">Resumo do seu preenchimento:</h3>
        <ul className="space-y-2 text-foreground/80">
          <li className="flex justify-between">
            <span>Valores selecionados:</span>
            <span className="font-semibold">
              {Object.values(formData.valores).reduce((acc, arr) => acc + arr.length, 0)}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Ativos cadastrados:</span>
            <span className="font-semibold">{formData.ativos.length}</span>
          </li>
          <li className="flex justify-between">
            <span>Passivos cadastrados:</span>
            <span className="font-semibold">{formData.passivos.length}</span>
          </li>
          <li className="flex justify-between">
            <span>Receitas cadastradas:</span>
            <span className="font-semibold">{formData.receitas.length}</span>
          </li>
          <li className="flex justify-between">
            <span>Despesas cadastradas:</span>
            <span className="font-semibold">{formData.despesas.length}</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
        <button
          onClick={downloadJSON}
          className="mirai-button flex items-center gap-2 justify-center"
        >
          <Download className="w-5 h-5" />
          Baixar Respostas (JSON)
        </button>
        <button
          onClick={sendEmail}
          className="mirai-button flex items-center gap-2 justify-center"
        >
          <Send className="w-5 h-5" />
          Enviar por E-mail
        </button>
      </div>

      <p className="text-sm text-muted-foreground mt-8">
        Estamos aqui para ajudá-lo a construir um futuro financeiro mais tranquilo e alinhado com seus valores e sonhos.
      </p>
    </div>
  )
}

