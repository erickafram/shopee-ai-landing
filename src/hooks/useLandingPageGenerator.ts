import { useState } from 'react';
import { shopeeExtractor, ShopeeProduct } from '@/services/shopeeExtractor';
import { aiLandingPageGenerator, GeneratedLandingPage } from '@/services/aiLandingPageGenerator';
import { useToast } from '@/hooks/use-toast';

export interface LandingPageGeneratorState {
  loading: boolean;
  extracting: boolean;
  generating: boolean;
  extractedProduct: ShopeeProduct | null;
  generatedPage: GeneratedLandingPage | null;
  error: string | null;
}

export const useLandingPageGenerator = () => {
  const [state, setState] = useState<LandingPageGeneratorState>({
    loading: false,
    extracting: false,
    generating: false,
    extractedProduct: null,
    generatedPage: null,
    error: null
  });

  const { toast } = useToast();

  // Extrair dados do produto da Shopee
  const extractProductData = async (url: string): Promise<ShopeeProduct | null> => {
    setState(prev => ({ ...prev, extracting: true, error: null }));

    try {
      const productData = await shopeeExtractor.extractProductData(url);
      
      setState(prev => ({ 
        ...prev, 
        extracting: false, 
        extractedProduct: productData 
      }));

      toast({
        title: "Dados extraídos com sucesso!",
        description: `Produto: ${productData.name}`,
      });

      return productData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao extrair dados';
      
      setState(prev => ({ 
        ...prev, 
        extracting: false, 
        error: errorMessage 
      }));

      toast({
        title: "Erro na extração",
        description: errorMessage,
        variant: "destructive"
      });

      return null;
    }
  };

  // Gerar landing page completa
  const generateFullLandingPage = async (productData?: ShopeeProduct): Promise<GeneratedLandingPage | null> => {
    const product = productData || state.extractedProduct;
    
    if (!product) {
      toast({
        title: "Erro",
        description: "Nenhum produto encontrado para gerar a landing page",
        variant: "destructive"
      });
      return null;
    }

    setState(prev => ({ ...prev, generating: true, error: null }));

    try {
      // 1. Gerar copy persuasivo
      toast({
        title: "Gerando conteúdo...",
        description: "Criando textos persuasivos com IA"
      });

      const copyData = await aiLandingPageGenerator.generateCopy(product);

      // 2. Gerar HTML da landing page
      toast({
        title: "Criando design...",
        description: "Gerando estrutura HTML otimizada"
      });

      const html = await aiLandingPageGenerator.generateLandingPageHTML(product, copyData);

      // 3. Analisar qualidade
      toast({
        title: "Analisando qualidade...",
        description: "Verificando otimizações de conversão"
      });

      const analysis = await aiLandingPageGenerator.analyzeLandingPage(html, product);

      // 4. Gerar variações de design (em background)
      const variations = await aiLandingPageGenerator.generateDesignVariations(product, copyData);

      const generatedPage: GeneratedLandingPage = {
        html,
        copy: copyData,
        analysis,
        variations,
        createdAt: new Date()
      };

      setState(prev => ({ 
        ...prev, 
        generating: false, 
        generatedPage 
      }));

      toast({
        title: "Landing page gerada!",
        description: "Sua página está pronta para personalização",
      });

      return generatedPage;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar landing page';
      
      setState(prev => ({ 
        ...prev, 
        generating: false, 
        error: errorMessage 
      }));

      toast({
        title: "Erro na geração",
        description: errorMessage,
        variant: "destructive"
      });

      return null;
    }
  };

  // Processo completo: extrair + gerar
  const createLandingPageFromUrl = async (url: string): Promise<GeneratedLandingPage | null> => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      // 1. Extrair dados
      const productData = await extractProductData(url);
      if (!productData) {
        setState(prev => ({ ...prev, loading: false }));
        return null;
      }

      // 2. Gerar landing page
      const generatedPage = await generateFullLandingPage(productData);
      
      setState(prev => ({ ...prev, loading: false }));
      return generatedPage;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return null;
    }
  };

  // Regenerar com novos parâmetros
  const regenerateLandingPage = async (customizations?: any): Promise<GeneratedLandingPage | null> => {
    if (!state.extractedProduct) return null;

    // Aplicar customizações se fornecidas
    const productData = customizations 
      ? { ...state.extractedProduct, ...customizations }
      : state.extractedProduct;

    return await generateFullLandingPage(productData);
  };

  // Limpar estado
  const reset = () => {
    setState({
      loading: false,
      extracting: false,
      generating: false,
      extractedProduct: null,
      generatedPage: null,
      error: null
    });
  };

  // Salvar landing page (mock)
  const saveLandingPage = async (name: string): Promise<boolean> => {
    if (!state.generatedPage) return false;

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Landing page salva!",
        description: `"${name}" foi salva com sucesso`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a landing page",
        variant: "destructive"
      });
      return false;
    }
  };

  // Publicar landing page (mock)
  const publishLandingPage = async (): Promise<string | null> => {
    if (!state.generatedPage) return null;

    try {
      // Simular publicação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const url = `https://aivendas.com/lp/${Date.now()}`;
      
      toast({
        title: "Landing page publicada!",
        description: `Disponível em: ${url}`,
      });

      return url;
    } catch (error) {
      toast({
        title: "Erro ao publicar",
        description: "Não foi possível publicar a landing page",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    // Estado
    ...state,
    
    // Ações
    extractProductData,
    generateFullLandingPage,
    createLandingPageFromUrl,
    regenerateLandingPage,
    saveLandingPage,
    publishLandingPage,
    reset,
    
    // Computed
    isProcessing: state.extracting || state.generating || state.loading,
    hasProduct: !!state.extractedProduct,
    hasGeneratedPage: !!state.generatedPage,
    canGenerate: !!state.extractedProduct && !state.generating,
    canPublish: !!state.generatedPage && !state.loading
  };
};