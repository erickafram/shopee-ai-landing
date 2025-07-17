// Teste de conexão frontend -> sistema final
const fetch = require('node-fetch');

async function testFrontendConnection() {
    console.log('🧪 Testando conexão frontend -> sistema final...');
    
    const testUrl = 'https://shopee.com.br/Sapato-Masculino-Loafer-Casual-New-Crepe-Confort-Classic-i.1167885424.22593522326';
    
    try {
        // Simular requisição do frontend
        const response = await fetch('http://localhost:5003/api/extract-final-real', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: testUrl })
        });
        
        console.log(`📡 Status: ${response.status}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Conexão funcionando!');
            console.log(`📝 Produto: ${data.data?.name || 'N/A'}`);
            console.log(`🎯 Dados reais: ${data.data?.extraction_info?.is_real_data || 'N/A'}`);
        } else if (response.status === 404) {
            const data = await response.json();
            console.log('⚠️ Sistema funcionando - produto não encontrado (como esperado)');
            console.log(`💡 Mensagem: ${data.message}`);
        } else {
            console.log(`❌ Erro HTTP: ${response.status}`);
        }
        
    } catch (error) {
        console.error('❌ Erro de conexão:', error.message);
        console.error('💡 Certifique-se que o servidor está rodando: python shopee_final_real_scraper.py');
    }
}

testFrontendConnection(); 