# 🕷️ Sistema de Scraping Real da Shopee

Este sistema extrai **dados reais** de produtos da Shopee usando uma combinação de Python + TypeScript.

## 📋 Requisitos

- Python 3.8+
- Node.js
- Navegador Chrome (para Selenium)

## 🚀 Instalação

### 1. Instalar dependências Python:
```bash
pip install requests beautifulsoup4 lxml html5lib flask flask-cors selenium
```

### 2. Baixar ChromeDriver (para Selenium):
- Baixe de: https://chromedriver.chromium.org/
- Coloque o arquivo `chromedriver.exe` no PATH do sistema

## 🔧 Como Usar

### 1. Iniciar o servidor de scraping:
```bash
python scraper_server.py
```

O servidor será iniciado em `http://localhost:5000`

### 2. Testar o servidor:
```bash
# Verificar se está funcionando
curl http://localhost:5000/health

# Extrair dados de um produto
curl -X POST http://localhost:5000/api/extract \
     -H "Content-Type: application/json" \
     -d '{"url": "https://shopee.com.br/produto-link"}'
```

### 3. Usar no frontend:
1. Inicie o servidor Python (`python scraper_server.py`)
2. Inicie o frontend (`npm run dev`)
3. Cole o link da Shopee na interface
4. Os dados reais serão extraídos automaticamente

## 📁 Arquivos do Sistema

### Scraping Python:
- `scraper_server.py` - Servidor Flask principal
- `shopee_scraper.py` - Scraper básico
- `shopee_scraper_advanced.py` - Scraper com Selenium

### Frontend TypeScript:
- `src/services/pythonBridge.ts` - Bridge TypeScript ↔ Python
- `src/services/shopeeExtractor.ts` - Extrator principal

## 🔍 Como Funciona

1. **Frontend** solicita extração de dados via `shopeeExtractor`
2. **TypeScript Bridge** chama o servidor Python local
3. **Servidor Python** faz scraping real da página da Shopee
4. **Dados reais** são retornados ao frontend

### Estratégias de Extração:

1. **API Interna da Shopee** - Tenta acessar endpoints JSON
2. **Scraping HTML** - Parse direto da página
3. **Selenium** - Para páginas com JavaScript
4. **Headers Variados** - Diferentes User-Agents

## ⚠️ Limitações

- A Shopee pode bloquear requests automatizados
- Alguns produtos podem ter proteções especiais
- Rate limiting pode afetar a extração
- É necessário manter o servidor Python rodando

## 🐛 Troubleshooting

### Erro: "Servidor offline"
```bash
python scraper_server.py
```

### Erro: "Dados não encontrados"
- Verifique se o link da Shopee está correto
- Tente aguardar alguns segundos e tentar novamente
- Verifique se não há proteções anti-bot na página

### Erro: ChromeDriver
```bash
# Instalar ChromeDriver
# Windows: baixar e colocar no PATH
# Linux: sudo apt-get install chromium-chromedriver
# Mac: brew install chromedriver
```

## 📊 Dados Extraídos

O sistema extrai os seguintes dados **reais**:
- ✅ Nome do produto
- ✅ Preço atual
- ✅ Preço original (se houver desconto)
- ✅ Imagens do produto
- ✅ Descrição
- ✅ Especificações técnicas
- ✅ Avaliações e rating
- ✅ Variações (cores, tamanhos)
- ✅ Categoria

## 🎯 Produtos Testados

Links que foram testados com sucesso:
- Tablets infantis
- Calçados masculinos
- Eletrônicos diversos

## 💡 Melhorias Futuras

- [ ] Cache de dados extraídos
- [ ] Proxy rotation automático
- [ ] Rate limiting inteligente
- [ ] Extração de reviews
- [ ] Monitoramento de preços
- [ ] API key para maior estabilidade

---

**⚠️ Aviso Legal:** Este sistema é para fins educacionais. Respeite os termos de uso da Shopee e use com responsabilidade. 