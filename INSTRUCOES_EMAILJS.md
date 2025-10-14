# Instruções para Configurar o Envio Automático por Email

O formulário de Balanço Patrimonial está configurado para enviar automaticamente os dados preenchidos para **diegoelkek@gmail.com** usando o serviço **EmailJS**.

## Como Ativar o Envio Automático

### Passo 1: Criar Conta no EmailJS

1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Clique em **Sign Up** (Cadastrar-se)
3. Crie sua conta gratuita (permite até 200 emails/mês)

### Passo 2: Adicionar Serviço de Email

1. No dashboard do EmailJS, vá em **Email Services**
2. Clique em **Add New Service**
3. Escolha **Gmail** (ou outro provedor de sua preferência)
4. Conecte sua conta de email (diegoelkek@gmail.com)
5. Copie o **Service ID** gerado (exemplo: `service_abc123`)

### Passo 3: Criar Template de Email

1. No dashboard, vá em **Email Templates**
2. Clique em **Create New Template**
3. Configure o template:
   - **Template Name**: Balanço Patrimonial
   - **Subject**: Novo Balanço Patrimonial - {{from_name}}
   - **Content**:
     ```
     Olá!

     {{message}}

     ---
     Este email foi enviado automaticamente pelo formulário de Balanço Patrimonial Pessoal - MirAI
     ```
4. Copie o **Template ID** gerado (exemplo: `template_xyz789`)

### Passo 4: Obter Public Key

1. No dashboard, vá em **Account** → **General**
2. Copie a **Public Key** (exemplo: `abc123XYZ`)

### Passo 5: Atualizar o Código

1. Abra o arquivo `src/emailConfig.js`
2. Substitua os valores:
   ```javascript
   export const EMAILJS_CONFIG = {
     SERVICE_ID: 'service_abc123',     // Cole seu Service ID aqui
     TEMPLATE_ID: 'template_xyz789',   // Cole seu Template ID aqui
     PUBLIC_KEY: 'abc123XYZ'           // Cole sua Public Key aqui
   }
   ```
3. Salve o arquivo
4. Faça o build novamente:
   ```bash
   cd /home/ubuntu/balanco-patrimonial-mirai
   pnpm run build
   ```
5. Faça o deploy da versão atualizada

## Testando

Após configurar:

1. Acesse o formulário
2. Preencha os dados
3. Clique em "Enviar e Baixar Excel"
4. Você deve receber:
   - ✅ Download do arquivo Excel
   - ✅ Email em diegoelkek@gmail.com com o resumo

## Observações

- O arquivo Excel **não é anexado** ao email automaticamente (limitação do EmailJS)
- O email contém um **resumo** dos dados preenchidos
- O arquivo Excel completo é **baixado** no computador do cliente
- O cliente pode enviar o Excel manualmente se necessário

## Alternativa: Envio Manual

Se preferir não configurar o EmailJS agora:

- O formulário continuará funcionando normalmente
- O arquivo Excel será baixado
- Uma mensagem orientará o cliente a enviar o arquivo manualmente para diegoelkek@gmail.com

