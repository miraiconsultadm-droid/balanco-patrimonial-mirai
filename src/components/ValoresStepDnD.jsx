import React from 'react'
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

