import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, 
  Eye, 
  Edit3, 
  Link, 
  BarChart3, 
  Palette,
  Smartphone,
  Globe,
  Shield
} from "lucide-react";

const features = [
  {
    icon: Link,
    title: "Extração Automática",
    description: "Cole o link da Shopee e nossa IA extrai automaticamente nome, preço, imagens e descrições do produto.",
    color: "text-primary"
  },
  {
    icon: Zap,
    title: "Geração Instantânea",
    description: "Landing pages profissionais criadas em segundos com otimização automática para conversão.",
    color: "text-success"
  },
  {
    icon: Eye,
    title: "Preview em Tempo Real",
    description: "Visualize e teste sua landing page antes de publicar com nosso sistema de preview interativo.",
    color: "text-warning"
  },
  {
    icon: Edit3,
    title: "Editor Intuitivo",
    description: "Faça ajustes rápidos com nosso editor visual: cores, textos, CTAs e seções personalizáveis.",
    color: "text-primary"
  },
  {
    icon: Palette,
    title: "Templates Profissionais",
    description: "Escolha entre dezenas de templates otimizados para diferentes nichos e produtos.",
    color: "text-success"
  },
  {
    icon: BarChart3,
    title: "Analytics Integrado",
    description: "Acompanhe visualizações, cliques, conversões e performance em tempo real.",
    color: "text-warning"
  },
  {
    icon: Smartphone,
    title: "100% Responsivo",
    description: "Todas as landing pages são otimizadas para mobile, tablet e desktop automaticamente.",
    color: "text-primary"
  },
  {
    icon: Globe,
    title: "URL Personalizada",
    description: "Publique com domínio próprio ou use nossos subdomínios otimizados para SEO.",
    color: "text-success"
  },
  {
    icon: Shield,
    title: "Seguro e Confiável",
    description: "Hospedagem segura, SSL gratuito e 99.9% de uptime garantido para suas pages.",
    color: "text-warning"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-light text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap size={16} />
            <span>Funcionalidades Poderosas</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Tudo que você precisa para{" "}
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              vender mais
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nossa plataforma oferece todas as ferramentas necessárias para transformar produtos da Shopee 
            em landing pages de alta conversão, sem conhecimento técnico.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-hover border-0 shadow-lg bg-card/50 backdrop-blur-sm group"
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-primary/10 to-success/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={24} className={feature.color} />
                </div>
                <CardTitle className="text-xl font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="card-gradient rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Pronto para começar?
            </h3>
            <p className="text-muted-foreground mb-6">
              Crie sua primeira landing page em menos de 60 segundos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-gradient px-8 py-3 rounded-lg font-semibold text-white hover:scale-105 transition-transform">
                Começar Grátis
              </button>
              <button className="border border-border px-8 py-3 rounded-lg font-semibold hover:bg-muted transition-colors">
                Ver Demonstração
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;