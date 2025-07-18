// 🧪 Teste da Extensão Simplificada - Verificar JSON
console.log('🧪 TESTE: Extensão Shopee Simplificada');

// Simular estrutura esperada do JSON
const expectedStructure = {
  url: "https://shopee.com.br/produto-teste",
  extractedAt: new Date().toISOString(),
  product: {
    name: "Produto Teste",
    price: {
      current: 100.00,
      original: 150.00,
      currency: "BRL",
      discount: 33
    },
    rating: 4.5,
    reviewCount: 1250,
    soldCount: "5k vendidos",
    images: [
      {
        url: "https://down-br.img.susercontent.com/file/example1.jpg",
        filename: "product_1.jpg", 
        position: 1
      },
      {
        url: "https://down-br.img.susercontent.com/file/example2.jpg",
        filename: "product_2.jpg",
        position: 2
      }
    ],
    variations: [
      { type: "Cor", options: ["Preto", "Marrom"] },
      { type: "Tamanho", options: ["39", "40", "41", "42"] }
    ],
    description: "Descrição do produto...",
    specifications: {
      "Material": "Couro",
      "Marca": "Exemplo"
    },
    comments: [
      {
        user: "Usuario1",
        rating: 5,
        comment: "Produto excelente!"
      }
    ]
  },
  shop: {
    name: "Loja Exemplo",
    location: "Brasil"
  }
};

// Função para validar estrutura do JSON
function validateExtensionJSON(jsonData) {
  console.log('🔍 Validando estrutura do JSON...');
  
  const errors = [];
  const warnings = [];
  
  // Validações obrigatórias
  if (!jsonData.product) {
    errors.push('❌ Campo "product" obrigatório não encontrado');
    return { valid: false, errors, warnings };
  }
  
  if (!jsonData.product.name) {
    errors.push('❌ Nome do produto não encontrado');
  }
  
  if (!jsonData.product.images || !Array.isArray(jsonData.product.images)) {
    errors.push('❌ Campo "images" deve ser um array');
  } else if (jsonData.product.images.length === 0) {
    warnings.push('⚠️ Nenhuma imagem encontrada');
  } else {
    // Validar estrutura das imagens
    jsonData.product.images.forEach((img, index) => {
      if (!img.url) {
        errors.push(`❌ Imagem ${index + 1}: URL obrigatória não encontrada`);
      } else if (!img.url.includes('susercontent')) {
        warnings.push(`⚠️ Imagem ${index + 1}: URL não parece ser da Shopee`);
      }
      
      if (!img.filename) {
        warnings.push(`⚠️ Imagem ${index + 1}: Filename não encontrado`);
      }
      
      if (!img.position) {
        warnings.push(`⚠️ Imagem ${index + 1}: Position não encontrada`);
      }
      
      // Verificar se não há campos problemáticos
      if (img.base64 !== undefined && img.base64 !== null) {
        warnings.push(`⚠️ Imagem ${index + 1}: Campo base64 deveria ser removido`);
      }
      
      if (img.size !== undefined && img.size === 0) {
        warnings.push(`⚠️ Imagem ${index + 1}: Campo size desnecessário`);
      }
      
      if (img.local_path !== undefined) {
        warnings.push(`⚠️ Imagem ${index + 1}: Campo local_path desnecessário`);
      }
    });
  }
  
  if (!jsonData.product.price) {
    warnings.push('⚠️ Preço não encontrado');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    imageCount: jsonData.product.images?.length || 0,
    hasValidImages: jsonData.product.images?.some(img => img.url && img.url.includes('susercontent')) || false
  };
}

// Função para testar upload para o servidor
async function testUploadToServer(jsonData) {
  console.log('📡 Testando upload para servidor...');
  
  try {
    const response = await fetch('http://localhost:5007/api/upload-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload bem-sucedido:', result);
      return { success: true, result };
    } else {
      console.error('❌ Erro no upload:', response.status);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('❌ Erro de conexão:', error);
    return { success: false, error: error.message };
  }
}

// Função para verificar servidores
async function checkServers() {
  console.log('🔍 Verificando status dos servidores...');
  
  const servers = [
    { name: 'JSON Generator', url: 'http://localhost:5007/api/products' },
    { name: 'Scraper Híbrido', url: 'http://localhost:5000/health' }
  ];
  
  for (const server of servers) {
    try {
      const response = await fetch(server.url);
      if (response.ok) {
        console.log(`✅ ${server.name}: ATIVO`);
      } else {
        console.log(`⚠️ ${server.name}: Resposta ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${server.name}: OFFLINE`);
    }
  }
}

// Função principal de teste
async function runTests() {
  console.log('🚀 Iniciando testes da extensão...');
  
  // 1. Verificar servidores
  await checkServers();
  
  // 2. Teste com estrutura esperada
  console.log('\n🧪 Teste 1: Estrutura Esperada');
  const validation1 = validateExtensionJSON(expectedStructure);
  console.log('Resultado:', validation1);
  
  // 3. Teste de upload (se servidores estiverem ativos)
  console.log('\n📡 Teste 2: Upload para Servidor');
  await testUploadToServer(expectedStructure);
  
  console.log('\n✅ Testes concluídos!');
  console.log('\n📋 INSTRUÇÕES PARA TESTAR A EXTENSÃO:');
  console.log('1. Carregue a extensão no Chrome');
  console.log('2. Vá para uma página da Shopee');
  console.log('3. Use a extensão para extrair dados');
  console.log('4. Verifique o console para ver se segue a estrutura esperada');
}

// Executar se estiver no browser
if (typeof window !== 'undefined') {
  console.log('🌐 Rodando no browser - execute runTests() manualmente');
  window.runTests = runTests;
  window.validateExtensionJSON = validateExtensionJSON;
} else {
  // Executar se estiver no Node.js
  runTests();
}

console.log('🎯 Script de teste carregado. Use runTests() para executar.'); 