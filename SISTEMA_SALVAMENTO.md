# Sistema de Salvamento Automático

## Como Funciona

O formulário de Balanço Patrimonial agora possui um **sistema de salvamento automático** que protege os dados dos clientes caso eles precisem pausar o preenchimento.

### Recursos Implementados

#### 1. Salvamento Automático
- **Quando**: A cada alteração em qualquer campo do formulário
- **Onde**: Os dados são salvos no `localStorage` do navegador do cliente
- **Notificação**: Aparece uma mensagem discreta no canto superior direito: "✔️ Dados salvos automaticamente"

#### 2. Recuperação Automática
- **Quando o cliente volta**: Ao abrir o formulário novamente, os dados são carregados automaticamente
- **Mensagem de boas-vindas**: "💾 Bem-vindo de volta! Seus dados foram recuperados automaticamente. Você pode continuar de onde parou."

#### 3. Botão "Limpar Formulário"
- **Localização**: No cabeçalho, ao lado do título (visível apenas em telas médias/grandes)
- **Função**: Permite que o cliente limpe todos os dados e comece do zero
- **Segurança**: Pede confirmação antes de limpar: "Tem certeza que deseja limpar todos os dados do formulário? Esta ação não pode ser desfeita."

#### 4. Limpeza Automática Após Envio
- **Quando**: Após o envio bem-sucedido dos dados para o webhook n8n
- **Função**: Limpa automaticamente os dados salvos
- **Mensagem**: "Os dados salvos foram limpos. Você pode preencher um novo formulário agora."

## Vantagens

### Para o Cliente
✅ **Tranquilidade**: Pode preencher com calma, em várias sessões
✅ **Sem perda de dados**: Mesmo que feche o navegador acidentalmente
✅ **Flexibilidade**: Pode pausar e voltar quando tiver tempo
✅ **Privacidade**: Dados ficam apenas no navegador do cliente (não no servidor)

### Para Você
✅ **Menos abandono**: Clientes não desistem por medo de perder dados
✅ **Mais conversões**: Formulários longos ficam menos intimidadores
✅ **Melhor experiência**: Clientes satisfeitos com a funcionalidade

## Limitações e Considerações

### Limitações Técnicas
- **Por navegador**: Os dados salvos são específicos do navegador/dispositivo
  - Se o cliente começar no celular e continuar no computador, terá que recomeçar
  - Se usar navegador diferente, terá que recomeçar
  
- **Limpeza de cache**: Se o cliente limpar o cache/cookies do navegador, os dados são perdidos

- **Modo anônimo**: Não funciona em modo anônimo/privado do navegador

### Segurança e Privacidade
- ✅ **Dados locais**: Ficam apenas no dispositivo do cliente
- ✅ **Não enviados**: Não são enviados para servidor até o cliente clicar em "Enviar"
- ✅ **Limpeza automática**: Removidos após envio bem-sucedido

### Recomendações para Orientar Clientes

Você pode orientar seus clientes:

1. **Use o mesmo navegador**: "Preencha sempre no mesmo navegador para manter seus dados salvos"

2. **Não limpe o cache**: "Evite limpar o cache do navegador enquanto estiver preenchendo"

3. **Finalize quando puder**: "Seus dados ficam salvos, mas é melhor finalizar quando tiver todas as informações"

4. **Baixe o Excel**: "Após enviar, baixe o arquivo Excel como backup"

## Tecnologia Utilizada

- **localStorage**: API nativa do navegador para armazenamento local
- **React useEffect**: Para detectar mudanças e salvar automaticamente
- **JSON**: Para serializar/deserializar os dados complexos do formulário

## Código Relevante

### Salvamento
```javascript
useEffect(() => {
  localStorage.setItem('balancoPatrimonialData', JSON.stringify(formData))
  setShowSavedNotification(true)
  const timer = setTimeout(() => setShowSavedNotification(false), 2000)
  return () => clearTimeout(timer)
}, [formData])
```

### Recuperação
```javascript
const getInitialFormData = () => {
  const savedData = localStorage.getItem('balancoPatrimonialData')
  if (savedData) {
    return JSON.parse(savedData)
  }
  return { /* dados iniciais vazios */ }
}
```

### Limpeza
```javascript
localStorage.removeItem('balancoPatrimonialData')
```

