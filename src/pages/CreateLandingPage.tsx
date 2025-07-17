import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Link2, 
  Download, 
  Eye, 
  Edit3, 
  Save, 
  Share2, 
  CheckCircle,
  AlertCircle,
  Loader,
  Image,
  Type,
  Palette,
  Layout,
  ExternalLink,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLandingPageGenerator } from "@/hooks/useLandingPageGenerator";

const CreateLandingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [shopeeUrl, setShopeeUrl] = useState("");
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  const {
    extracting,
    generating,
    extractedProduct,
    generatedPage,
    error,
    extractProductData,
    generateFullLandingPage,
    saveLandingPage,
    publishLandingPage,
    isProcessing,
    hasProduct,
    hasGeneratedPage
  } = useLandingPageGenerator();

  const steps = [
    { id: 1, title: "Link da Shopee", description: "Cole o link do produto" },
    { id: 2, title: "Dados Extraídos", description: "Revise as informações" },
    { id: 3, title: "Gerar Landing Page", description: "IA criando sua página" },
    { id: 4, title: "Editor & Preview", description: "Personalize e publique" }
  ];

  const handleUrlSubmit = async () => {
    if (!shopeeUrl.includes('shopee.com')) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira um link válido da Shopee",
        variant: "destructive"
      });
      return;
    }

    const product = await extractProductData(shopeeUrl);
    if (product) {
      setCurrentStep(2);
    }
  };

  const handleGeneratePage = async () => {
    setCurrentStep(3);
    const page = await generateFullLandingPage();
    if (page) {
      setCurrentStep(4);
    }
  };

  const handleSave = async () => {
    const success = await saveLandingPage(`Landing Page - ${extractedProduct?.name}`);
    if (success) {
      // Opcional: redirecionar ou mostrar opções adicionais
    }
  };

  const handlePublish = async () => {
    const url = await publishLandingPage();
    if (url) {
      setPublishedUrl(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "URL copiada para a área de transferência"
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Cole o link do produto da Shopee</CardTitle>
              <CardDescription>
                Nossa IA irá extrair automaticamente todas as informações necessárias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">URL do Produto</Label>
                <div className="flex space-x-2">
                  <Input
                    id="url"
                    placeholder="https://shopee.com.br/produto-exemplo"
                    value={shopeeUrl}
                    onChange={(e) => setShopeeUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleUrlSubmit}
                    disabled={!shopeeUrl || extracting}
                    className="min-w-[120px]"
                  >
                    {extracting ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Extraindo...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Extrair
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-2">💡 Dica:</h4>
                <p className="text-sm text-muted-foreground">
                  Cole o link completo do produto da Shopee. Nossa IA irá extrair nome, preço, imagens, descrição e especificações automaticamente.
                </p>
              </div>

              {extracting && (
                <div className="space-y-4">
                  <Progress value={33} className="w-full" />
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Extraindo dados do produto...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Dados extraídos com sucesso!</span>
                </CardTitle>
                <CardDescription>
                  Revise as informações abaixo e faça ajustes se necessário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product Info */}
                  <div className="space-y-4">
                    <div>
                      <Label>Nome do Produto</Label>
                      <Input value={extractedProduct?.name || ""} className="mt-1" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Preço</Label>
                        <Input value={extractedProduct?.price || ""} className="mt-1" />
                      </div>
                      <div>
                        <Label>Preço Original</Label>
                        <Input value={extractedProduct?.originalPrice || ""} className="mt-1" />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Categoria</Label>
                      <Input value={extractedProduct?.category || ""} className="mt-1" />
                    </div>
                    
                    <div>
                      <Label>Descrição</Label>
                        <textarea 
                          className="w-full min-h-[100px] p-3 border rounded-md" 
                          value={extractedProduct?.description || ""}
                        />
                    </div>
                  </div>

                  {/* Images & Specs */}
                  <div className="space-y-4">
                    <div>
                      <Label>Imagens do Produto</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {extractedProduct?.images?.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={img} 
                              alt={`Produto ${idx + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Variações */}
                    {extractedProduct?.variations && (
                      <div>
                        <Label>Variações Disponíveis</Label>
                        <div className="space-y-3 mt-2">
                          {extractedProduct.variations.colors && (
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Cores:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {extractedProduct.variations.colors.map((color, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-background">
                                    {color}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {extractedProduct.variations.sizes && (
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Tamanhos:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {extractedProduct.variations.sizes.map((size, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-background">
                                    {size}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label>Especificações</Label>
                      <div className="space-y-2 mt-2">
                        {Object.entries(extractedProduct?.specifications || {}).map(([key, value]) => (
                          <div key={key} className="flex space-x-2">
                            <Input value={key} className="w-1/3" />
                            <Input value={value as string} className="w-2/3" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <Badge variant="secondary">⭐ {extractedProduct?.rating}</Badge>
                      <Badge variant="outline">{extractedProduct?.reviews} avaliações</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <Button onClick={handleGeneratePage} className="btn-gradient px-8">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Gerar Landing Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-success rounded-full flex items-center justify-center">
                  <Loader className="h-8 w-8 text-white animate-spin" />
                </div>
                
                <h2 className="text-2xl font-bold">IA gerando sua landing page...</h2>
                <p className="text-muted-foreground">
                  Nossa inteligência artificial está criando uma página otimizada para conversão
                </p>
                
                <Progress value={65} className="w-full max-w-md mx-auto" />
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Analisando produto e categoria</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Selecionando template otimizado</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="h-4 w-4 animate-spin text-primary" />
                    <span>Gerando conteúdo persuasivo...</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="preview" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="grid w-fit grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                </TabsList>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleSave} disabled={!hasGeneratedPage}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </Button>
                  <Button className="btn-gradient" onClick={handlePublish} disabled={!hasGeneratedPage}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Publicar
                  </Button>
                </div>
              </div>

              <TabsContent value="preview" className="space-y-0">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Preview da Landing Page</CardTitle>
                        <CardDescription>
                          Visualize como sua landing page ficará para os visitantes
                        </CardDescription>
                      </div>
                      {publishedUrl && (
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Publicada
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(publishedUrl)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copiar URL
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(publishedUrl, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Abrir
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg bg-gradient-to-b from-background to-muted/30 min-h-[500px]">
                      {generatedPage ? (
                        <iframe
                          srcDoc={generatedPage.html}
                          className="w-full h-[600px] border-0 rounded-lg"
                          title="Landing Page Preview"
                        />
                      ) : (
                        <div className="p-8 text-center space-y-6">
                          <h1 className="text-3xl font-bold">
                            {extractedProduct?.name}
                          </h1>
                          
                          <div className="flex justify-center space-x-4">
                            <img 
                              src={extractedProduct?.images?.[0]} 
                              alt="Produto"
                              className="w-48 h-48 object-cover rounded-lg"
                            />
                          </div>
                          
                          <div className="max-w-2xl mx-auto space-y-4">
                            <div className="text-center space-y-2">
                              <div className="flex items-center justify-center space-x-3">
                                <span className="text-3xl font-bold text-primary">{extractedProduct?.price}</span>
                                {extractedProduct?.originalPrice && (
                                  <>
                                    <span className="text-lg text-muted-foreground line-through">{extractedProduct.originalPrice}</span>
                                    <Badge variant="destructive" className="text-sm">
                                      31% OFF
                                    </Badge>
                                  </>
                                )}
                              </div>
                              {extractedProduct?.variations?.colors && (
                                <div className="flex justify-center space-x-2 mt-4">
                                  <span className="text-sm text-muted-foreground">Disponível em:</span>
                                  {extractedProduct.variations.colors.map((color, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {color}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <p className="text-muted-foreground">
                              {extractedProduct?.description}
                            </p>
                            
                            <Button className="btn-gradient text-lg px-8 py-6">
                              {generatedPage?.copy?.cta_principal || "Comprar Agora - 50% OFF"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="editor" className="space-y-0">
                <div className="grid md:grid-cols-4 gap-6">
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle className="text-lg">Personalizar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Cores</Label>
                        <div className="flex space-x-2">
                          <div className="w-8 h-8 bg-primary rounded border-2 border-primary"></div>
                          <div className="w-8 h-8 bg-success rounded border"></div>
                          <div className="w-8 h-8 bg-warning rounded border"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Texto do CTA</Label>
                        <Input placeholder="Comprar Agora" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Layout</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="border rounded p-2 cursor-pointer hover:bg-muted">
                            <Layout className="h-4 w-4" />
                          </div>
                          <div className="border rounded p-2 cursor-pointer hover:bg-muted">
                            <Image className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-3">
                    <CardHeader>
                      <CardTitle>Editor Visual</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg p-4 min-h-[400px] bg-muted/30">
                        <p className="text-center text-muted-foreground">
                          Editor visual será implementado aqui
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Criar Landing Page</h1>
            </div>
            
            {/* Steps */}
            <div className="hidden md:flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id 
                      ? 'bg-primary text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-muted-foreground text-xs">{step.description}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-border ml-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default CreateLandingPage;