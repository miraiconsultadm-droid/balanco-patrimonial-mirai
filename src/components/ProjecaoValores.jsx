// Componente para sistema de projeção de valores
export function ProjecaoValores({ itemKey, formData, setFormData, dataType }) {
  const item = formData[dataType][itemKey] || {}
  
  const updateField = (field, value) => {
    setFormData({
      ...formData,
      [dataType]: {
        ...formData[dataType],
        [itemKey]: {
          ...item,
          [field]: value
        }
      }
    })
  }

  const addPeriodo = () => {
    const periodos = item.periodos || []
    setFormData({
      ...formData,
      [dataType]: {
        ...formData[dataType],
        [itemKey]: {
          ...item,
          periodos: [...periodos, { inicio: '', fim: '', valor: '' }]
        }
      }
    })
  }

  const updatePeriodo = (index, field, value) => {
    const periodos = [...(item.periodos || [])]
    periodos[index] = { ...periodos[index], [field]: value }
    setFormData({
      ...formData,
      [dataType]: {
        ...formData[dataType],
        [itemKey]: {
          ...item,
          periodos
        }
      }
    })
  }

  const removePeriodo = (index) => {
    const periodos = [...(item.periodos || [])]
    periodos.splice(index, 1)
    setFormData({
      ...formData,
      [dataType]: {
        ...formData[dataType],
        [itemKey]: {
          ...item,
          periodos
        }
      }
    })
  }

  return (
    <div className="mt-4 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
      <label className="block text-sm font-medium text-foreground mb-3">
        Como você quer projetar esse valor no futuro?
      </label>
      
      <div className="space-y-2 mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name={`projecao_${itemKey}`}
            value="fixo"
            checked={item.tipoProjecao === 'fixo' || !item.tipoProjecao}
            onChange={(e) => updateField('tipoProjecao', e.target.value)}
            className="text-primary"
          />
          <span className="text-sm">Valor fixo (não muda ao longo do tempo)</span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name={`projecao_${itemKey}`}
            value="percentual"
            checked={item.tipoProjecao === 'percentual'}
            onChange={(e) => updateField('tipoProjecao', e.target.value)}
            className="text-primary"
          />
          <span className="text-sm">Crescimento percentual anual</span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name={`projecao_${itemKey}`}
            value="periodos"
            checked={item.tipoProjecao === 'periodos'}
            onChange={(e) => updateField('tipoProjecao', e.target.value)}
            className="text-primary"
          />
          <span className="text-sm">Valores diferentes por período</span>
        </label>
      </div>

      {/* Crescimento Percentual */}
      {item.tipoProjecao === 'percentual' && (
        <div className="mt-3">
          <label className="block text-sm text-foreground/80 mb-2">% de crescimento ao ano:</label>
          <input
            type="text"
            value={item.percentualCrescimento || ''}
            onChange={(e) => updateField('percentualCrescimento', e.target.value)}
            placeholder="Ex: 5 (para 5% ao ano)"
            className="mirai-input w-full"
          />
        </div>
      )}

      {/* Valores por Período */}
      {item.tipoProjecao === 'periodos' && (
        <div className="mt-3 space-y-3">
          {(item.periodos || []).map((periodo, index) => (
            <div key={index} className="p-3 bg-card rounded border border-secondary/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Período {index + 1}</span>
                <button
                  onClick={() => removePeriodo(index)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remover
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={periodo.inicio || ''}
                  onChange={(e) => updatePeriodo(index, 'inicio', e.target.value)}
                  placeholder="Início (ano)"
                  className="mirai-input w-full text-sm"
                />
                <input
                  type="text"
                  value={periodo.fim || ''}
                  onChange={(e) => updatePeriodo(index, 'fim', e.target.value)}
                  placeholder="Fim (ano)"
                  className="mirai-input w-full text-sm"
                />
                <input
                  type="text"
                  value={periodo.valor || ''}
                  onChange={(e) => updatePeriodo(index, 'valor', e.target.value)}
                  placeholder="R$ Valor"
                  className="mirai-input w-full text-sm"
                />
              </div>
            </div>
          ))}
          
          <button
            onClick={addPeriodo}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            + Adicionar período
          </button>
        </div>
      )}
    </div>
  )
}

