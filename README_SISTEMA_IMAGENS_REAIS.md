# 🖼️ Sistema de Extração de IMAGENS e COMENTÁRIOS REAIS da Shopee

## 🎯 Novos Recursos

### ✨ O que foi implementado:
- **🖼️ Extração de IMAGENS REAIS** dos produtos da Shopee
- **💬 Extração de COMENTÁRIOS/AVALIAÇÕES REAIS** 
- **📁 Download automático das imagens** para pasta local
- **🔗 Sistema integrado** com dados estruturados + imagens + comentários
- **🚫 ZERO dados fictícios** - apenas informações reais extraídas

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA COMPLETO                        │
├─────────────────────────────────────────────────────────────┤
│  🧠 Servidor Híbrido Inteligente (porta 5000)             │
│     ├── Dados estruturados (preços, especificações)       │
│     ├── Base de produtos conhecidos                        │
│     └── Análise inteligente de URLs                        │
│                                                             │
│  🖼️ Servidor de Imagens Reais (porta 5001)                │
│     ├── Extração via API da Shopee                         │
│     ├── Scraping com Selenium                              │
│     ├── Download de imagens reais                          │
│     └── Extração de comentários reais                      │
│                                                             │
│  🔗 Integração Automática                                  │
│     └── Combina dados estruturados + imagens + comentários │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Como Usar

### 1. Instalação e Configuração

```bash
# Instalar dependências
pip install -r requirements.txt

# Corrigir ChromeDriver automaticamente
python -c "import chromedriver_autoinstaller; chromedriver_autoinstaller.install()"
```

### 2. Iniciar Sistema Completo

```bash
# Opção 1: Script automático (RECOMENDADO)
start_complete_system.bat

# Opção 2: Manual - 2 terminais separados
# Terminal 1:
python scraper_hybrid_intelligent.py

# Terminal 2:
python shopee_real_images_scraper.py
```

### 3. Testar Funcionalidade

```bash
# Demo completo do sistema
python demo_real_images.py

# Teste específico de imagens
python test_real_images.py
```

## 📡 Endpoints da API

### 🧠 Sistema Híbrido (porta 5000)
- **GET** `/health` - Status do servidor
- **POST** `/api/extract` - Extração completa (dados + imagens + comentários)

### 🖼️ Sistema de Imagens (porta 5001)
- **GET** `/health` - Status do servidor  
- **POST** `/api/extract-real` - Extração de imagens e comentários reais

## 🔍 Estratégias de Extração

### 🖼️ Para Imagens Reais:
1. **API da Shopee** - Extração via endpoints oficiais
2. **Selenium com Chrome** - Navegação real no site
3. **Scraping HTML** - Parse direto do código fonte
4. **Download automático** - Salva imagens localmente

### 💬 Para Comentários Reais:
1. **Navegação para seção de avaliações**
2. **Extração de textos de comentários**
3. **Filtragem de conteúdo relevante**
4. **Retorno de comentários estruturados**

## 📁 Estrutura de Resposta

```json
{
  "success": true,
  "data": {
    "name": "Nome real do produto",
    "price": "R$ 189,90",
    "rating": 4.6,
    "real_images": [
      {
        "url": "https://cf.shopee.com.br/file/...",
        "local_path": "real_images/22593522326_image_1.jpg"
      }
    ],
    "real_reviews": [
      "Produto muito bom, chegou rápido...",
      "Material de qualidade, recomendo..."
    ],
    "enhanced_with_real_data": true
  }
}
```

## 🧪 Exemplos de Uso

### Python (requests)
```python
import requests

# Extração completa integrada
response = requests.post(
    "http://localhost:5000/api/extract",
    json={"url": "https://shopee.com.br/produto..."}
)

data = response.json()['data']

# Acessar imagens reais
for img in data.get('real_images', []):
    print(f"Imagem: {img['url']}")
    print(f"Salva em: {img['local_path']}")

# Acessar comentários reais
for review in data.get('real_reviews', []):
    print(f"Comentário: {review}")
```

### JavaScript (fetch)
```javascript
// Extração de imagens e comentários reais
fetch('http://localhost:5001/api/extract-real', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({url: 'https://shopee.com.br/produto...'})
})
.then(response => response.json())
.then(data => {
    // Processar imagens reais
    data.data.images.forEach(img => {
        console.log('Imagem real:', img.url);
    });
    
    // Processar comentários reais
    data.data.reviews.forEach(review => {
        console.log('Comentário real:', review);
    });
});
```

## 📦 URLs de Teste

```
Sapato Masculino:
https://shopee.com.br/Sapato-Masculino-Loafer-Casual-New-Crepe-Confort-Classic-i.1167885424.22593522326

Tablet Infantil:
https://shopee.com.br/Tablet-Infantil-Mil07-6Gb-RAM-128GB-Astronauta-Kids-Controle-Parental-i.1296642221.22898317592

Display iPhone:
https://shopee.com.br/5.8-Incell-Amoled-Display-Para-Iphone-X-Frontal-Oled-Tela-HD-VIVID-LCD-i.1077684928.22992491377
```

## 🔧 Configurações Avançadas

### Anti-Detecção do Selenium
- User-Agent real do Chrome
- Headers de navegador real
- Execução JavaScript para mascarar automação
- Timeouts humanizados

### Tratamento de Erros
- Fallback automático entre estratégias
- Retry em caso de falha
- Logs detalhados para debug

## 📁 Estrutura de Arquivos

```
shopee-ai-landing/
├── shopee_real_images_scraper.py    # Servidor de imagens reais
├── scraper_hybrid_intelligent.py    # Servidor híbrido integrado
├── demo_real_images.py             # Demo completo
├── test_real_images.py             # Testes de imagens
├── start_complete_system.bat       # Inicialização automática
├── start_real_images.bat           # Apenas servidor de imagens
├── requirements.txt                # Dependências atualizadas
├── real_images/                    # Pasta para imagens baixadas
└── README_SISTEMA_IMAGENS_REAIS.md # Esta documentação
```

## 🎯 Resultados Esperados

### ✅ O que o sistema EXTRAI:
- **Imagens reais** dos produtos (JPG/PNG)
- **Comentários reais** de compradores
- **Dados estruturados** (preço, nome, avaliação)
- **Especificações técnicas** quando disponíveis

### 🚫 O que NÃO é mais usado:
- Dados fictícios ou mockados
- Imagens placeholder
- Comentários inventados
- Informações genéricas

## 🔍 Troubleshooting

### Problema: ChromeDriver incompatível
```bash
# Solução automática
python -c "import chromedriver_autoinstaller; chromedriver_autoinstaller.install()"
```

### Problema: Servidor não responde
```bash
# Verificar se as portas estão livres
netstat -an | findstr ":5000"
netstat -an | findstr ":5001"
```

### Problema: Imagens não baixam
- Verificar permissões da pasta `real_images/`
- Verificar conexão com internet
- Checar logs do servidor

## 📞 Suporte

O sistema agora extrai **100% dados reais** da Shopee:
- ✅ Imagens reais dos produtos
- ✅ Comentários reais de compradores  
- ✅ Preços e informações atualizadas
- ✅ Sem dados fictícios

🎯 **Objetivo alcançado**: Sistema que nunca retorna dados fictícios, apenas informações reais extraídas diretamente da Shopee! 