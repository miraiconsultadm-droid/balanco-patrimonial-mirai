import React from 'react'
import { Download, Send } from 'lucide-react'
import * as XLSX from 'xlsx'
import { supabase } from '../supabaseClient'
import { ProjecaoValores } from './ProjecaoValores'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { GripVertical } from 'lucide-react'

export function ValoresStep({ formData, setFormData }) {
  const valoresOptions = {
    saude: ["Vitalidade", "Harmonia", "Longevidade", "Energia", "Beleza", "Humor", "Equilíbrio", "Prazer", "Vigor", "Peso ideal", "Paciência", "Lazer", "Esporte", "Alimentação", "Dinamismo", "Alegria", "Bem-estar", "Conforto", "Inteligência", "Satisfação"],
    financas: ["Liberdade", "Segurança", "Respeito", "Prazer", "Oportunidades", "Realização", "Progresso", "Equilíbrio", "Diversão", "Conquista", "Independência", "Patrimônio", "Abundância", "Poder", "Estabilidade", "Cultura", "Conforto", "Prestígio", "Lazer", "Sucesso"],
    trabalho: ["Respeito", "Liberdade", "Harmonia", "Aprendizado", "Competência", "Evolução", "Entusiasmo", "Desenvolvimento", "Autoestima", "Motivação", "Confiança", "Excelência", "Estabilidade", "Sabedoria", "Renovação", "Liderança", "Oportunidade", "Dedicação", "Ousadia", "Compartilhamento"],
    relacionamentos: ["Amor", "Carinho", "Prazer", "Entendimento", "Crescimento", "Gratidão", "Liberdade", "Cumplicidade", "Equilíbrio", "Amizade", "Colaboração", "Sexualidade", "Paz", "Doação", "Diálogo", "Sinceridade", "Tesão", "Idealismo", "Honestidade", "Comunicação"],
    espiritualidade: ["Fé", "Finalidade", "Harmonia", "Transcendência", "Aceitação", "Transformação", "Deus", "Plenitude", "Esperança", "Fraternidade", "Compaixão", "Humildade", "Resignação", "Livre arbítrio", "Crescimento", "Sabedoria", "Consciência", "Serenidade", "Equilíbrio", "Sintonia"]
  }

  const categoriaLabels = {
    saude: 'Saúde',
    financas: 'Finanças',
    trabalho: 'Trabalho',
    relacionamentos: 'Relacionamentos',
    espiritualidade: 'Espiritualidade'
  }

  // Inicializar valores com estrutura de objeto se ainda não existir
  React.useEffect(() => {
    const valoresAtualizados = { ...formData.valores }
    let needsUpdate = false

    Object.keys(valoresOptions).forEach(categoria => {
      if (Array.isArray(formData.valores[categoria])) {
        // Converter array antigo para novo formato com prioridade
        needsUpdate = true
        valoresAtualizados[categoria] = formData.valores[categoria].reduce((acc, valor, index) => {
          acc[valor] = { selecionado: true, prioridade: index + 1 }
          return acc
        }, {})
      } else if (!formData.valores[categoria]) {
        valoresAtualizados[categoria] = {}
      }
    })

    if (needsUpdate) {
      setFormData({ ...formData, valores: valoresAtualizados })
    }
  }, [])

  const toggleValor = (categoria, valor) => {
    const valoresCategoria = formData.valores[categoria] || {}
    const isSelected = valoresCategoria[valor]?.selecionado
    
    if (isSelected) {
      // Remover valor
      const { [valor]: removed, ...rest } = valoresCategoria
      // Reordenar prioridades
      const reordered = Object.entries(rest).reduce((acc, [key, val]) => {
        if (val.selecionado && val.prioridade > removed.prioridade) {
          acc[key] = { ...val, prioridade: val.prioridade - 1 }
        } else {
          acc[key] = val
        }
        return acc
      }, {})
      
      setFormData({
        ...formData,
        valores: {
          ...formData.valores,
          [categoria]: reordered
        }
      })
    } else {
      // Adicionar valor
      const selecionados = Object.values(valoresCategoria).filter(v => v.selecionado).length
      if (selecionados < 7) {
        setFormData({
          ...formData,
          valores: {
            ...formData.valores,
            [categoria]: {
              ...valoresCategoria,
              [valor]: { selecionado: true, prioridade: selecionados + 1 }
            }
          }
        })
      }
    }
  }

  const onDragEnd = (result, categoria) => {
    if (!result.destination) return

    const valoresCategoria = formData.valores[categoria] || {}
    const selecionados = Object.entries(valoresCategoria)
      .filter(([_, val]) => val.selecionado)
      .sort((a, b) => a[1].prioridade - b[1].prioridade)

    const [removed] = selecionados.splice(result.source.index, 1)
    selecionados.splice(result.destination.index, 0, removed)

    // Atualizar prioridades
    const updated = { ...valoresCategoria }
    selecionados.forEach(([key, _], index) => {
      updated[key] = { selecionado: true, prioridade: index + 1 }
    })

    setFormData({
      ...formData,
      valores: {
        ...formData.valores,
        [categoria]: updated
      }
    })
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

  const getValoresSelecionados = (categoria) => {
    const valoresCategoria = formData.valores[categoria] || {}
    return Object.entries(valoresCategoria)
      .filter(([_, val]) => val.selecionado)
      .sort((a, b) => a[1].prioridade - b[1].prioridade)
      .map(([key, _]) => key)
  }

  return (
    <div className="space-y-8">
      <div className="mirai-card p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mirai-text-gradient mb-4">Seus Valores e Sonhos</h2>
        <p className="text-foreground/80 mb-6">
          Vamos começar com a parte mais importante: o que move você e sua família. 
          Selecione até 7 valores em cada categoria que mais representam o que é importante para você.
          <strong className="text-primary block mt-2">
            Depois de selecionar, arraste os valores para ordenar por prioridade (1º mais importante, 7º menos importante).
          </strong>
        </p>

        {Object.entries(valoresOptions).map(([categoria, opcoes]) => {
          const valoresSelecionados = getValoresSelecionados(categoria)
          const valoresCategoria = formData.valores[categoria] || {}
          
          return (
            <div key={categoria} className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">
                {categoriaLabels[categoria]} ({valoresSelecionados.length}/7)
              </h3>

              {/* Valores Selecionados com Drag and Drop */}
              {valoresSelecionados.length > 0 && (
                <div className="mb-4 p-4 rounded-lg bg-primary/10 border-2 border-primary/30">
                  <h4 className="text-sm font-semibold text-primary mb-3">
                    Valores selecionados (arraste para reordenar por prioridade):
                  </h4>
                  <DragDropContext onDragEnd={(result) => onDragEnd(result, categoria)}>
                    <Droppable droppableId={`droppable-${categoria}`}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {valoresSelecionados.map((valor, index) => (
                            <Draggable key={valor} draggableId={valor} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`flex items-center gap-3 p-3 rounded-lg bg-card border-2 border-primary transition-all ${
                                    snapshot.isDragging ? 'shadow-lg scale-105' : ''
                                  }`}
                                >
                                  <GripVertical className="w-5 h-5 text-primary flex-shrink-0" />
                                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                  </span>
                                  <span className="flex-1 text-foreground font-medium">{valor}</span>
                                  <button
                                    onClick={() => toggleValor(categoria, valor)}
                                    className="px-3 py-1 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 text-sm font-medium transition-colors"
                                  >
                                    Remover
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}

              {/* Opções de Valores para Selecionar */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {opcoes.map((valor) => {
                  const isSelected = valoresCategoria[valor]?.selecionado
                  return (
                    <button
                      key={valor}
                      onClick={() => toggleValor(categoria, valor)}
                      disabled={!isSelected && valoresSelecionados.length >= 7}
                      className={`p-3 rounded-lg border-2 transition-all text-sm ${
                        isSelected
                          ? 'bg-primary border-primary text-white'
                          : valoresSelecionados.length >= 7
                          ? 'bg-card/50 border-secondary/20 text-foreground/50 cursor-not-allowed'
                          : 'bg-card border-secondary/30 text-foreground hover:border-secondary'
                      }`}
                    >
                      {valor}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
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
                value={formData.sonhos[field] || ''}
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

  const updateAtivoValor = (categoria, item, value) => {
    setFormData({
      ...formData,
      ativos: {
        ...formData.ativos,
        [`${categoria}_${item}`]: value
      }
    })
  }

  const addCustomAtivo = (categoria) => {
    const customCount = Object.keys(formData.ativos).filter(k => k.startsWith(`${categoria}_Outro_`)).length
    const newKey = `${categoria}_Outro_${customCount + 1}`
    setFormData({
      ...formData,
      ativosCustom: {
        ...(formData.ativosCustom || {}),
        [newKey]: { nome: '', valor: '' }
      }
    })
  }

  const updateCustomAtivo = (key, field, value) => {
    setFormData({
      ...formData,
      ativosCustom: {
        ...(formData.ativosCustom || {}),
        [key]: {
          ...(formData.ativosCustom?.[key] || {}),
          [field]: value
        }
      }
    })
  }

  return (
    <div className="mirai-card p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mirai-text-gradient mb-4">O Que Você Tem (Ativos)</h2>
      <p className="text-foreground/80 mb-6">
        Agora, vamos listar as coisas que você possui. Preencha o valor aproximado de cada item que você tem.
      </p>

      {Object.entries(categorias).map(([categoria, itens]) => (
        <div key={categoria} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-primary">{categoria}</h3>
          <div className="space-y-3">
            {itens.map((item) => (
              <div key={item} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
                <label className="block text-foreground mb-2">{item}</label>
                <input
                  type="text"
                  value={formData.ativos[`${categoria}_${item}`] || ''}
                  onChange={(e) => updateAtivoValor(categoria, item, e.target.value)}
                  placeholder="R$ Valor aproximado (deixe em branco se não possui)"
                  className="mirai-input w-full"
                />
              </div>
            ))}
            
            {/* Itens personalizados */}
            {Object.entries(formData.ativosCustom || {})
              .filter(([key]) => key.startsWith(`${categoria}_Outro_`))
              .map(([key, custom]) => (
                <div key={key} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
                  <input
                    type="text"
                    value={custom.nome || ''}
                    onChange={(e) => updateCustomAtivo(key, 'nome', e.target.value)}
                    placeholder="Nome do item"
                    className="mirai-input w-full mb-2"
                  />
                  <input
                    type="text"
                    value={custom.valor || ''}
                    onChange={(e) => updateCustomAtivo(key, 'valor', e.target.value)}
                    placeholder="R$ Valor aproximado"
                    className="mirai-input w-full"
                  />
                </div>
              ))}
            
            <button
              onClick={() => addCustomAtivo(categoria)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              + Adicionar outro item em {categoria}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function PassivosStep({ formData, setFormData }) {
  const categorias = {
    "Financiamentos": ["Financiamento de imóvel", "Financiamento de carro"],
    "Empréstimos": ["Empréstimo pessoal", "Empréstimo consignado"],
    "Cartão de Crédito": ["Fatura do cartão de crédito"],
    "Passivos Trabalhistas/Fiscais": ["Impostos a pagar (IPVA, IPTU, IR)", "Dívidas trabalhistas ou fiscais"]
  }

  const updatePassivoValor = (categoria, item, value) => {
    setFormData({
      ...formData,
      passivos: {
        ...formData.passivos,
        [`${categoria}_${item}`]: value
      }
    })
  }

  const addCustomPassivo = (categoria) => {
    const customCount = Object.keys(formData.passivosCustom || {}).filter(k => k.startsWith(`${categoria}_Outro_`)).length
    const newKey = `${categoria}_Outro_${customCount + 1}`
    setFormData({
      ...formData,
      passivosCustom: {
        ...(formData.passivosCustom || {}),
        [newKey]: { nome: '', valor: '' }
      }
    })
  }

  const updateCustomPassivo = (key, field, value) => {
    setFormData({
      ...formData,
      passivosCustom: {
        ...(formData.passivosCustom || {}),
        [key]: {
          ...(formData.passivosCustom?.[key] || {}),
          [field]: value
        }
      }
    })
  }

  return (
    <div className="mirai-card p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mirai-text-gradient mb-4">O Que Você Deve (Passivos)</h2>
      <p className="text-foreground/80 mb-6">
        Nesta etapa, vamos organizar seus compromissos financeiros. Preencha o valor de cada compromisso que você tem.
      </p>

      {Object.entries(categorias).map(([categoria, itens]) => (
        <div key={categoria} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-primary">{categoria}</h3>
          <div className="space-y-3">
            {itens.map((item) => (
              <div key={item} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
                <label className="block text-foreground mb-2">{item}</label>
                <input
                  type="text"
                  value={formData.passivos[`${categoria}_${item}`] || ''}
                  onChange={(e) => updatePassivoValor(categoria, item, e.target.value)}
                  placeholder="R$ Valor mensal (deixe em branco se não possui)"
                  className="mirai-input w-full"
                />
              </div>
            ))}
            
            {/* Itens personalizados */}
            {Object.entries(formData.passivosCustom || {})
              .filter(([key]) => key.startsWith(`${categoria}_Outro_`))
              .map(([key, custom]) => (
                <div key={key} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
                  <input
                    type="text"
                    value={custom.nome || ''}
                    onChange={(e) => updateCustomPassivo(key, 'nome', e.target.value)}
                    placeholder="Nome do compromisso"
                    className="mirai-input w-full mb-2"
                  />
                  <input
                    type="text"
                    value={custom.valor || ''}
                    onChange={(e) => updateCustomPassivo(key, 'valor', e.target.value)}
                    placeholder="R$ Valor mensal"
                    className="mirai-input w-full"
                  />
                </div>
              ))}
            
            <button
              onClick={() => addCustomPassivo(categoria)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              + Adicionar outro item em {categoria}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ReceitasStep({ formData, setFormData }) {
  const categorias = {
    "Do seu Trabalho": ["Salário", "Renda como autônomo(a) ou profissional liberal", "Bônus e comissões"],
    "De Aluguéis e Investimentos": ["Aluguel de imóveis", "Rendimento de investimentos"],
    "Outras Fontes": ["Aposentadoria ou pensão", "Renda de um segundo trabalho ou 'bico'"]
  }

  const updateReceita = (categoria, item, field, value) => {
    const key = `${categoria}_${item}`
    setFormData({
      ...formData,
      receitas: {
        ...formData.receitas,
        [key]: {
          ...(formData.receitas[key] || {}),
          [field]: value
        }
      }
    })
  }

  const addCustomReceita = (categoria) => {
    const customCount = Object.keys(formData.receitasCustom || {}).filter(k => k.startsWith(`${categoria}_Outro_`)).length
    const newKey = `${categoria}_Outro_${customCount + 1}`
    setFormData({
      ...formData,
      receitasCustom: {
        ...(formData.receitasCustom || {}),
        [newKey]: { nome: '', valor: '', frequencia: '', inicio: '', fim: '' }
      }
    })
  }

  const updateCustomReceita = (key, field, value) => {
    setFormData({
      ...formData,
      receitasCustom: {
        ...(formData.receitasCustom || {}),
        [key]: {
          ...(formData.receitasCustom?.[key] || {}),
          [field]: value
        }
      }
    })
  }

  return (
    <div className="mirai-card p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mirai-text-gradient mb-4">O Que Você Recebe (Receitas)</h2>
      <p className="text-foreground/80 mb-6">
        Aqui, vamos anotar todo o dinheiro que entra. Preencha valor, frequência e período de cada fonte de renda.
      </p>

      {Object.entries(categorias).map(([categoria, itens]) => (
        <div key={categoria} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-primary">{categoria}</h3>
          <div className="space-y-4">
            {itens.map((item) => {
              const key = `${categoria}_${item}`
              const receita = formData.receitas[key] || {}
              return (
                <div key={item} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
                  <label className="block text-foreground mb-3 font-medium">{item}</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={receita.valor || ''}
                      onChange={(e) => updateReceita(categoria, item, 'valor', e.target.value)}
                      placeholder="R$ Valor"
                      className="mirai-input w-full"
                    />
                    <select
                      value={receita.frequencia || ''}
                      onChange={(e) => updateReceita(categoria, item, 'frequencia', e.target.value)}
                      className="mirai-input w-full"
                    >
                      <option value="">Frequência</option>
                      <option value="mensal">Mensal</option>
                      <option value="anual">Anual</option>
                    </select>
                    <input
                      type="text"
                      value={receita.inicio || ''}
                      onChange={(e) => updateReceita(categoria, item, 'inicio', e.target.value)}
                      placeholder="Início (ano)"
                      className="mirai-input w-full"
                    />
                    <input
                      type="text"
                      value={receita.fim || ''}
                      onChange={(e) => updateReceita(categoria, item, 'fim', e.target.value)}
                      placeholder="Fim (ano)"
                      className="mirai-input w-full"
                    />
                  </div>
                  
                  {/* Sistema de Projeção */}
                  <ProjecaoValores 
                    itemKey={key} 
                    formData={formData} 
                    setFormData={setFormData} 
                    dataType="receitas"
                  />
                </div>
              )
            })}
            
            {/* Receitas personalizadas */}
            {Object.entries(formData.receitasCustom || {})
              .filter(([key]) => key.startsWith(`${categoria}_Outro_`))
              .map(([key, custom]) => (
                <div key={key} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
                  <input
                    type="text"
                    value={custom.nome || ''}
                    onChange={(e) => updateCustomReceita(key, 'nome', e.target.value)}
                    placeholder="Nome da receita"
                    className="mirai-input w-full mb-3"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={custom.valor || ''}
                      onChange={(e) => updateCustomReceita(key, 'valor', e.target.value)}
                      placeholder="R$ Valor"
                      className="mirai-input w-full"
                    />
                    <select
                      value={custom.frequencia || ''}
                      onChange={(e) => updateCustomReceita(key, 'frequencia', e.target.value)}
                      className="mirai-input w-full"
                    >
                      <option value="">Frequência</option>
                      <option value="mensal">Mensal</option>
                      <option value="anual">Anual</option>
                    </select>
                    <input
                      type="text"
                      value={custom.inicio || ''}
                      onChange={(e) => updateCustomReceita(key, 'inicio', e.target.value)}
                      placeholder="Início (ano)"
                      className="mirai-input w-full"
                    />
                    <input
                      type="text"
                      value={custom.fim || ''}
                      onChange={(e) => updateCustomReceita(key, 'fim', e.target.value)}
                      placeholder="Fim (ano)"
                      className="mirai-input w-full"
                    />
                  </div>
                  
                  {/* Sistema de Projeção para custom */}
                  <ProjecaoValores 
                    itemKey={key} 
                    formData={formData} 
                    setFormData={setFormData} 
                    dataType="receitasCustom"
                  />
                </div>
              ))}
            
            <button
              onClick={() => addCustomReceita(categoria)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              + Adicionar outra receita em {categoria}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function DespesasStep({ formData, setFormData }) {
  const categorias = [
    "Moradia",
    "Alimentação",
    "Veículos/Transporte",
    "Saúde",
    "Lazer",
    "Educação",
    "Filhos",
    "Pets",
    "Compras Pessoais"
  ]

  const updateDespesa = (categoria, field, value) => {
    setFormData({
      ...formData,
      despesas: {
        ...formData.despesas,
        [categoria]: {
          ...(formData.despesas[categoria] || {}),
          [field]: value
        }
      }
    })
  }

  const addCustomDespesa = () => {
    const customCount = Object.keys(formData.despesasCustom || {}).filter(k => k.startsWith('Outra_')).length
    const newKey = `Outra_${customCount + 1}`
    setFormData({
      ...formData,
      despesasCustom: {
        ...(formData.despesasCustom || {}),
        [newKey]: { nome: '', valor: '', frequencia: '', inicio: '', fim: '' }
      }
    })
  }

  const updateCustomDespesa = (key, field, value) => {
    setFormData({
      ...formData,
      despesasCustom: {
        ...(formData.despesasCustom || {}),
        [key]: {
          ...(formData.despesasCustom?.[key] || {}),
          [field]: value
        }
      }
    })
  }

  return (
    <div className="mirai-card p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mirai-text-gradient mb-4">O Que Você Gasta (Despesas)</h2>
      <p className="text-foreground/80 mb-6">
        Vamos entender para onde vai o seu dinheiro. Preencha valor, frequência e período de cada categoria de gasto.
      </p>

      <div className="space-y-6">
        {categorias.map((categoria) => {
          const despesa = formData.despesas[categoria] || {}
          return (
            <div key={categoria} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
              <label className="block text-foreground mb-3 font-medium text-lg">{categoria}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={despesa.valor || ''}
                  onChange={(e) => updateDespesa(categoria, 'valor', e.target.value)}
                  placeholder="R$ Valor"
                  className="mirai-input w-full"
                />
                <select
                  value={despesa.frequencia || ''}
                  onChange={(e) => updateDespesa(categoria, 'frequencia', e.target.value)}
                  className="mirai-input w-full"
                >
                  <option value="">Frequência</option>
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </select>
                <input
                  type="text"
                  value={despesa.inicio || ''}
                  onChange={(e) => updateDespesa(categoria, 'inicio', e.target.value)}
                  placeholder="Início (ano)"
                  className="mirai-input w-full"
                />
                <input
                  type="text"
                  value={despesa.fim || ''}
                  onChange={(e) => updateDespesa(categoria, 'fim', e.target.value)}
                  placeholder="Fim (ano)"
                  className="mirai-input w-full"
                />
              </div>
              
              {/* Sistema de Projeção */}
              <ProjecaoValores 
                itemKey={categoria} 
                formData={formData} 
                setFormData={setFormData} 
                dataType="despesas"
              />
            </div>
          )
        })}
        
        {/* Despesas personalizadas */}
        {Object.entries(formData.despesasCustom || {}).map(([key, custom]) => (
          <div key={key} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
            <input
              type="text"
              value={custom.nome || ''}
              onChange={(e) => updateCustomDespesa(key, 'nome', e.target.value)}
              placeholder="Nome da despesa"
              className="mirai-input w-full mb-3"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                type="text"
                value={custom.valor || ''}
                onChange={(e) => updateCustomDespesa(key, 'valor', e.target.value)}
                placeholder="R$ Valor"
                className="mirai-input w-full"
              />
              <select
                value={custom.frequencia || ''}
                onChange={(e) => updateCustomDespesa(key, 'frequencia', e.target.value)}
                className="mirai-input w-full"
              >
                <option value="">Frequência</option>
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
              </select>
              <input
                type="text"
                value={custom.inicio || ''}
                onChange={(e) => updateCustomDespesa(key, 'inicio', e.target.value)}
                placeholder="Início (ano)"
                className="mirai-input w-full"
              />
              <input
                type="text"
                value={custom.fim || ''}
                  onChange={(e) => updateCustomDespesa(key, 'fim', e.target.value)}
                placeholder="Fim (ano)"
                className="mirai-input w-full"
              />
            </div>
            
            {/* Sistema de Projeção para custom */}
            <ProjecaoValores 
              itemKey={key} 
              formData={formData} 
              setFormData={setFormData} 
              dataType="despesasCustom"
            />
          </div>
        ))}
        
        <button
          onClick={addCustomDespesa}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          + Adicionar outra categoria de despesa
        </button>
      </div>
    </div>
  )
}

export function InvestimentosFuturosStep({ formData, setFormData }) {
  const sugestoes = [
    "Educação para filhos",
    "Comprar casa",
    "Casamento dos filhos",
    "Aumentar periodicidade de viagens",
    "Comprar imóveis",
    "Morar no exterior",
    "Cursos no exterior",
    "Aposentadoria antecipada",
    "Abrir um negócio próprio",
    "Reforma da casa"
  ]

  const updateInvestimento = (item, field, value) => {
    setFormData({
      ...formData,
      investimentosFuturos: {
        ...formData.investimentosFuturos,
        [item]: {
          ...(formData.investimentosFuturos[item] || {}),
          [field]: value
        }
      }
    })
  }

  const addCustomInvestimento = () => {
    const customCount = Object.keys(formData.investimentosFuturos || {}).filter(k => k.startsWith('Outro_')).length
    const newKey = `Outro_${customCount + 1}`
    setFormData({
      ...formData,
      investimentosFuturos: {
        ...formData.investimentosFuturos,
        [newKey]: { valor: '', frequencia: '', inicio: '', fim: '', nome: '', observacoes: '' }
      }
    })
  }

  return (
    <div className="mirai-card p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mirai-text-gradient mb-4">Investimentos e Gastos Futuros</h2>
      <p className="text-foreground/80 mb-6">
        Vamos planejar seus sonhos e projetos futuros. Preencha os valores e períodos para cada objetivo.
      </p>

      <div className="space-y-4 mb-6">
        {sugestoes.map((item) => {
          const investimento = formData.investimentosFuturos?.[item] || {}
          return (
            <div key={item} className="bg-card/50 p-4 rounded-lg border border-secondary/30">
              <label className="block text-foreground mb-3 font-medium">{item}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                <input
                  type="text"
                  value={investimento.valor || ''}
                  onChange={(e) => updateInvestimento(item, 'valor', e.target.value)}
                  placeholder="R$ Valor total"
                  className="mirai-input w-full"
                />
                <select
                  value={investimento.frequencia || ''}
                  onChange={(e) => updateInvestimento(item, 'frequencia', e.target.value)}
                  className="mirai-input w-full"
                >
                  <option value="">Frequência</option>
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                  <option value="unico">Pagamento Único</option>
                </select>
                <input
                  type="text"
                  value={investimento.inicio || ''}
                  onChange={(e) => updateInvestimento(item, 'inicio', e.target.value)}
                  placeholder="Início (ano)"
                  className="mirai-input w-full"
                />
                <input
                  type="text"
                  value={investimento.fim || ''}
                  onChange={(e) => updateInvestimento(item, 'fim', e.target.value)}
                  placeholder="Fim (ano)"
                  className="mirai-input w-full"
                />
              </div>
              <textarea
                value={investimento.observacoes || ''}
                onChange={(e) => updateInvestimento(item, 'observacoes', e.target.value)}
                placeholder="Observações (opcional)"
                className="mirai-input w-full min-h-20 resize-y"
              />
            </div>
          )
        })}
      </div>

      {Object.entries(formData.investimentosFuturos || {}).filter(([k]) => k.startsWith('Outro_')).map(([key, investimento]) => (
        <div key={key} className="bg-card/50 p-4 rounded-lg border border-secondary/30 mb-4">
          <input
            type="text"
            value={investimento.nome || ''}
            onChange={(e) => updateInvestimento(key, 'nome', e.target.value)}
            placeholder="Nome do investimento/gasto futuro"
            className="mirai-input w-full mb-3"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <input
              type="text"
              value={investimento.valor || ''}
              onChange={(e) => updateInvestimento(key, 'valor', e.target.value)}
              placeholder="R$ Valor total"
              className="mirai-input w-full"
            />
            <select
              value={investimento.frequencia || ''}
              onChange={(e) => updateInvestimento(key, 'frequencia', e.target.value)}
              className="mirai-input w-full"
            >
              <option value="">Frequência</option>
              <option value="mensal">Mensal</option>
              <option value="anual">Anual</option>
              <option value="unico">Pagamento Único</option>
            </select>
            <input
              type="text"
              value={investimento.inicio || ''}
              onChange={(e) => updateInvestimento(key, 'inicio', e.target.value)}
              placeholder="Início (ano)"
              className="mirai-input w-full"
            />
            <input
              type="text"
              value={investimento.fim || ''}
              onChange={(e) => updateInvestimento(key, 'fim', e.target.value)}
              placeholder="Fim (ano)"
              className="mirai-input w-full"
            />
          </div>
          <textarea
            value={investimento.observacoes || ''}
            onChange={(e) => updateInvestimento(key, 'observacoes', e.target.value)}
            placeholder="Observações (opcional)"
            className="mirai-input w-full min-h-20 resize-y"
          />
        </div>
      ))}

      <button
        onClick={addCustomInvestimento}
        className="mirai-button w-full md:w-auto"
      >
        + Adicionar Outro Investimento/Gasto Futuro
      </button>
    </div>
  )
}

export function FinalStep({ formData }) {
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new()
    
    // Valores
    const valoresData = []
    valoresData.push(['VALORES SELECIONADOS'])
    valoresData.push([])
    Object.entries(formData.valores).forEach(([categoria, valoresObj]) => {
      // Converter objeto de valores para array ordenado por prioridade
      const valoresOrdenados = Object.entries(valoresObj)
        .filter(([_, val]) => val.selecionado)
        .sort((a, b) => a[1].prioridade - b[1].prioridade)
        .map(([key, val]) => `${val.prioridade}. ${key}`)
        .join(', ')
      if (valoresOrdenados) {
        valoresData.push([categoria.toUpperCase(), valoresOrdenados])
      }
    })
    valoresData.push([])
    
    // Sonhos
    valoresData.push(['SONHOS, MEDOS E DESAFIOS'])
    valoresData.push([])
    Object.entries(formData.sonhos).forEach(([campo, resposta]) => {
      valoresData.push([campo, resposta])
    })
    
    const wsValores = XLSX.utils.aoa_to_sheet(valoresData)
    XLSX.utils.book_append_sheet(wb, wsValores, 'Valores e Sonhos')
    
    // Ativos
    const ativosData = [['ATIVOS'], [], ['Item', 'Valor']]
    Object.entries(formData.ativos).forEach(([key, valor]) => {
      if (valor) ativosData.push([key.replace(/_/g, ' - '), valor])
    })
    Object.entries(formData.ativosCustom || {}).forEach(([key, custom]) => {
      if (custom.valor) ativosData.push([custom.nome, custom.valor])
    })
    const wsAtivos = XLSX.utils.aoa_to_sheet(ativosData)
    XLSX.utils.book_append_sheet(wb, wsAtivos, 'Ativos')
    
    // Passivos
    const passivosData = [['PASSIVOS'], [], ['Item', 'Valor']]
    Object.entries(formData.passivos).forEach(([key, valor]) => {
      if (valor) passivosData.push([key.replace(/_/g, ' - '), valor])
    })
    Object.entries(formData.passivosCustom || {}).forEach(([key, custom]) => {
      if (custom.valor) passivosData.push([custom.nome, custom.valor])
    })
    const wsPassivos = XLSX.utils.aoa_to_sheet(passivosData)
    XLSX.utils.book_append_sheet(wb, wsPassivos, 'Passivos')
    
    // Receitas
    const receitasData = [['RECEITAS'], [], ['Item', 'Valor', 'Frequência', 'Início', 'Fim']]
    Object.entries(formData.receitas).forEach(([key, receita]) => {
      if (receita.valor) {
        receitasData.push([
          key.replace(/_/g, ' - '),
          receita.valor || '',
          receita.frequencia || '',
          receita.inicio || '',
          receita.fim || ''
        ])
      }
    })
    Object.entries(formData.receitasCustom || {}).forEach(([key, custom]) => {
      if (custom.valor) {
        receitasData.push([
          custom.nome,
          custom.valor || '',
          custom.frequencia || '',
          custom.inicio || '',
          custom.fim || ''
        ])
      }
    })
    const wsReceitas = XLSX.utils.aoa_to_sheet(receitasData)
    XLSX.utils.book_append_sheet(wb, wsReceitas, 'Receitas')
    
    // Despesas
    const despesasData = [['DESPESAS'], [], ['Item', 'Valor', 'Frequência', 'Início', 'Fim']]
    Object.entries(formData.despesas).forEach(([key, despesa]) => {
      if (despesa.valor) {
        despesasData.push([
          key.replace(/_/g, ' - '),
          despesa.valor || '',
          despesa.frequencia || '',
          despesa.inicio || '',
          despesa.fim || ''
        ])
      }
    })
    Object.entries(formData.despesasCustom || {}).forEach(([key, custom]) => {
      if (custom.valor) {
        despesasData.push([
          custom.nome,
          custom.valor || '',
          custom.frequencia || '',
          custom.inicio || '',
          custom.fim || ''
        ])
      }
    })
    const wsDespesas = XLSX.utils.aoa_to_sheet(despesasData)
    XLSX.utils.book_append_sheet(wb, wsDespesas, 'Despesas')
    
    // Investimentos Futuros
    const investimentosData = [['INVESTIMENTOS E GASTOS FUTUROS'], [], ['Item', 'Valor', 'Frequência', 'Início', 'Fim', 'Observações']]
    Object.entries(formData.investimentosFuturos || {}).forEach(([key, inv]) => {
      if (inv.valor) {
        const nome = key.startsWith('Outro_') ? inv.nome : key
        investimentosData.push([
          nome,
          inv.valor || '',
          inv.frequencia || '',
          inv.inicio || '',
          inv.fim || '',
          inv.observacoes || ''
        ])
      }
    })
    const wsInvestimentos = XLSX.utils.aoa_to_sheet(investimentosData)
    XLSX.utils.book_append_sheet(wb, wsInvestimentos, 'Investimentos Futuros')
    
    XLSX.writeFile(wb, `balanco_patrimonial_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

    const sendToN8N = async () => {
    try {
      // 1. Cria conta no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.auth.email,
        password: formData.auth.senha,
        options: {
          data: {
            nome_familia: formData.auth.nomeFamilia
          }
        }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          alert('⚠️ Este email já está cadastrado. Por favor, use outro email ou entre em contato com o suporte.')
          return
        }
        throw authError
      }

      const userId = authData.user.id
      
      // 2. Baixa o Excel
      exportToExcel()
      
      // 3. Envia para o webhook do n8n
      const response = await fetch('https://diegokek.app.n8n.cloud/webhook/balançopatrimonial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth: {
            email: formData.auth.email,
            senha: formData.auth.senha,
            nome_familia: formData.auth.nomeFamilia,
            user_id: userId
          },
          data: formData,
          timestamp: new Date().toISOString(),
          resumo: {
            valores_selecionados: Object.values(formData.valores).reduce((acc, arr) => acc + arr.length, 0),
            ativos_preenchidos: Object.values(formData.ativos).filter(v => v).length + Object.values(formData.ativosCustom || {}).filter(c => c.valor).length,
            passivos_preenchidos: Object.values(formData.passivos).filter(v => v).length + Object.values(formData.passivosCustom || {}).filter(c => c.valor).length,
            receitas_cadastradas: Object.values(formData.receitas).filter(r => r.valor).length + Object.values(formData.receitasCustom || {}).filter(c => c.valor).length,
            despesas_cadastradas: Object.values(formData.despesas).filter(d => d.valor).length + Object.values(formData.despesasCustom || {}).filter(c => c.valor).length,
            investimentos_futuros: Object.values(formData.investimentosFuturos || {}).filter(i => i.valor).length
          }
        })
      })

      if (response.ok) {
        // Limpa os dados salvos após envio bem-sucedido
        localStorage.removeItem('balancoPatrimonialData')
        alert(`✅ Sucesso! Dados enviados e Excel baixado!

📧 Email cadastrado: ${formData.auth.email}
🔑 Seu ID de usuário: ${userId}

Verifique seu email para confirmar o cadastro. Em breve você receberá acesso ao seu dashboard personalizado.`)
      } else {
        throw new Error('Erro ao enviar para n8n')
      }
      
    } catch (error) {
      console.error('Erro:', error)
      alert('⚠️ Erro ao processar: ' + (error.message || 'Erro desconhecido'))
    }
  }


  return (
    <div className="mirai-card p-8 md:p-12 text-center space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold mirai-text-gradient">Parabéns! Você concluiu o formulário!</h2>
      <p className="text-lg text-foreground/90 max-w-2xl mx-auto">
        Agora você pode baixar suas respostas em Excel. Os dados também serão enviados automaticamente para nossa equipe.
      </p>

      <div className="bg-card/50 p-6 rounded-lg border border-secondary/30 text-left max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-primary">Resumo do seu preenchimento:</h3>
        <ul className="space-y-2 text-foreground/80">
          <li className="flex justify-between">
            <span>Valores selecionados:</span>
            <span className="font-semibold">
              {Object.values(formData.valores).reduce((acc, valoresObj) => {
                const count = Object.values(valoresObj).filter(v => v.selecionado).length
                return acc + count
              }, 0)}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Ativos preenchidos:</span>
            <span className="font-semibold">
              {Object.values(formData.ativos).filter(v => v).length + Object.values(formData.ativosCustom || {}).filter(c => c.valor).length}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Passivos preenchidos:</span>
            <span className="font-semibold">
              {Object.values(formData.passivos).filter(v => v).length + Object.values(formData.passivosCustom || {}).filter(c => c.valor).length}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Receitas cadastradas:</span>
            <span className="font-semibold">
              {Object.values(formData.receitas).filter(r => r.valor).length + Object.values(formData.receitasCustom || {}).filter(c => c.valor).length}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Despesas cadastradas:</span>
            <span className="font-semibold">
              {Object.values(formData.despesas).filter(d => d.valor).length + Object.values(formData.despesasCustom || {}).filter(c => c.valor).length}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Investimentos futuros:</span>
            <span className="font-semibold">{Object.values(formData.investimentosFuturos || {}).filter(i => i.valor).length}</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
        <button
          onClick={sendToN8N}
          className="mirai-button flex items-center gap-2 justify-center"
        >
          <Send className="w-5 h-5" />
          Criar Conta e Enviar Dados
        </button>
      </div>

      <p className="text-sm text-muted-foreground mt-8">
        Estamos aqui para ajudá-lo a construir um futuro financeiro mais tranquilo e alinhado com seus valores e sonhos.
      </p>
    </div>
  )
}

