// Serviço para extração de dados 100% REAIS da Shopee - Sistema Final
import { pythonScraperBridge } from './pythonBridge';

export interface ShopeeProduct {
  name: string;
  price: string;
  originalPrice?: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  category: string;
  rating?: number;
  reviews?: number;
  url: string;
  variations?: {
    colors?: string[];
    sizes?: string[];
    [key: string]: string[] | undefined;
  };
}

class ShopeeExtractor {
  async extractProductData(url: string): Promise<ShopeeProduct> {
    if (!this.isValidShopeeUrl(url)) {
      throw new Error('URL da Shopee inválida');
    }

    console.log('🎯 Iniciando extração INTELIGENTE de dados da Shopee...');
    
    try {
      // PRIMEIRA PRIORIDADE: Sistema inteligente de dados reais
      console.log('🎯 Tentando extração com sistema inteligente...');
      const realData = await pythonScraperBridge.extractProductData(url);
      
      if (realData && realData.name && realData.name !== 'Produto não encontrado') {
        console.log('✅ DADOS extraídos com sucesso!');
        console.log(`📝 Produto: ${realData.name}`);
        console.log(`💰 Preço: ${realData.price}`);
        console.log(`🖼️ Imagens: ${realData.images?.length || 0}`);
        console.log(`🎯 Sistema inteligente funcionando perfeitamente`);
        return realData;
      }
      
    } catch (error) {
      console.error('❌ Erro no sistema inteligente:', error);
      console.error('💡 Certifique-se que o sistema está rodando: python shopee_smart_real_scraper.py');
      
      // Re-lançar o erro para que o usuário saiba que precisa do sistema
      throw new Error(`Sistema indisponível: ${error}. Inicie o sistema com: python shopee_smart_real_scraper.py`);
    }

    // Se chegou aqui, não conseguiu extrair dados reais
    throw new Error('Não foi possível extrair dados. Verifique se o sistema inteligente está rodando: python shopee_smart_real_scraper.py');
  }

  private isValidShopeeUrl(url: string): boolean {
    return url.includes('shopee.com.br') || url.includes('shopee.com');
  }

  // Método para testar a conexão com o servidor
  async testServerConnection(): Promise<{ success: boolean; message: string }> {
    return await pythonScraperBridge.testConnection();
  }

  // Método para verificar se o servidor está ativo
  async isServerActive(): Promise<boolean> {
    const result = await this.testServerConnection();
    return result.success;
  }
}

export const shopeeExtractor = new ShopeeExtractor();