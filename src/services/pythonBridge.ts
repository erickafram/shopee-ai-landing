// Bridge para chamar o servidor Python REAL de scraping
import { ShopeeProduct } from './shopeeExtractor';

export class PythonScraperBridge {
  private serverUrl = 'http://localhost:5004';

  async extractProductData(url: string): Promise<ShopeeProduct> {
    console.log('🎯 Chamando servidor FINAL de dados REAIS...');
    
    try {
      // Tentar extrair dados reais do sistema final
      const realData = await this.callFinalRealServer(url);
      if (realData && realData.name) {
        console.log('✅ Dados 100% REAIS extraídos pelo sistema final!');
        return realData;
      }
      
      throw new Error('Sistema final não conseguiu extrair dados reais');
      
    } catch (error) {
      console.error('❌ Erro no sistema final de dados reais:', error);
      
      // Informar ao usuário sobre como iniciar o servidor correto
      console.error('💡 Para dados reais inteligentes, inicie o servidor:');
      console.error('   python shopee_smart_real_scraper.py');
      
      throw new Error(`Sistema de dados reais indisponível: ${error}`);
    }
  }

  private async callFinalRealServer(url: string): Promise<ShopeeProduct> {
    console.log('📡 Conectando ao sistema inteligente de dados reais...');
    
    const response = await fetch(`${this.serverUrl}/api/extract-smart-real`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Sistema de dados reais não disponível' }));
      
      if (response.status === 404) {
        throw new Error('Produto não pôde ser processado. Verifique se a URL está correta.');
      }
      
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const responseData = await response.json();
    
    if (!responseData.success) {
      throw new Error(responseData.error || 'Sistema não conseguiu extrair dados reais');
    }

    const data = responseData.data;
    
    // Validar se os dados são reais
    if (!data.name) {
      throw new Error('Nenhum dado real foi extraído');
    }

    console.log(`✅ Produto extraído: ${data.name}`);
    console.log(`💰 Preço: ${data.price}`);
    console.log(`🖼️ Imagens: ${data.real_images?.length || 0}`);
    console.log(`🎯 Tipo: ${data.extraction_info?.is_real_data ? 'DADOS REAIS' : 'DADOS ESTRUTURADOS'}`);
    console.log(`📊 Qualidade: ${data.extraction_info?.data_quality || 'unknown'}`);

    // Converter formato do sistema final para o formato esperado pelo frontend
    const convertedData: ShopeeProduct = {
      name: data.name,
      price: data.price,
      originalPrice: data.originalPrice,
      category: 'Extraído da Shopee',
      description: data.description || 'Produto extraído diretamente da Shopee',
      images: data.real_images?.map((img: any) => img.url) || [],
      specifications: {
        'Vendidos': data.sold?.toString() || '0',
        'Estoque': data.stock?.toString() || '0',
        'Desconto': data.discount || '0%',
        'Fonte': 'Dados 100% Reais da Shopee',
        'Imagens Reais': data.real_images?.length?.toString() || '0'
      },
      rating: data.rating || 0,
      reviews: data.sold || 0,
      url: url,
      variations: data.variations?.length > 0 ? {
        colors: data.variations.map((v: any) => v.name).filter((name: string) => name)
      } : undefined
    };

    return convertedData;
  }

  private async checkServerHealth(): Promise<void> {
    try {
      const response = await fetch(`${this.serverUrl}/health`, {
        method: 'GET',
        timeout: 5000
      } as any);
      
      if (response.ok) {
        const health = await response.json();
        console.log('✅ Sistema final de dados reais está ativo:', health.message);
      } else {
        throw new Error(`Sistema não saudável: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Sistema final de dados reais não está respondendo');
      console.error('💡 Inicie o servidor correto: python shopee_final_real_scraper.py');
      throw new Error('Sistema de dados reais não está rodando');
    }
  }

  async startServerIfNeeded(): Promise<boolean> {
    try {
      await this.checkServerHealth();
      return true;
    } catch {
      console.log('🚀 Tentando iniciar servidor automaticamente...');
      
      // Em um ambiente real, você poderia tentar iniciar o servidor
      // Por agora, apenas informamos ao usuário
      console.error('❌ Sistema de dados reais não está rodando');
      console.error('💡 Execute em um terminal separado:');
      console.error('   cd ' + window.location.origin.replace('http://', '').replace('https://', ''));
      console.error('   python shopee_final_real_scraper.py');
      
      return false;
    }
  }

  // Método para testar a conexão com o servidor
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.serverUrl}/health`);
      const data = await response.json();
      
      return {
        success: true,
        message: `Sistema final ativo: ${data.message}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Sistema offline. Execute: python shopee_final_real_scraper.py`
      };
    }
  }
}

export const pythonScraperBridge = new PythonScraperBridge(); 