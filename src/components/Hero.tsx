import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-background to-success-light opacity-30"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-primary/10 rounded-full animate-float"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-success/10 rounded-full animate-float delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-warning/10 rounded-full animate-float delay-2000"></div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary-light text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>Powered by AI</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Transforme qualquer{" "}
              <span className="bg-gradient-to-r from-primary via-primary-hover to-success bg-clip-text text-transparent">
                produto da Shopee
              </span>{" "}
              em uma landing page profissional
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Em segundos, nossa IA extrai automaticamente as informações do produto e cria uma landing page otimizada para conversão. Sem design, sem código, apenas resultados.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link to="/signup">
                <Button className="btn-gradient text-lg px-8 py-6 font-semibold group">
                  Começar Grátis
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
              <Link to="#demo">
                <Button variant="outline" className="text-lg px-8 py-6 font-semibold hover:bg-primary hover:text-primary-foreground">
                  Ver Demonstração
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Zap className="text-success" size={16} />
                <span>Mais de 1000+ landing pages criadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="text-primary" size={16} />
                <span>98% de taxa de conversão</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="AIVENDAS Dashboard Preview"
                className="w-full h-auto rounded-2xl shadow-2xl hero-glow"
              />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 z-20 glass-effect rounded-lg p-4 animate-float">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium">IA Extraindo</p>
                  <p className="text-xs text-muted-foreground">Produto da Shopee</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 z-20 glass-effect rounded-lg p-4 animate-float delay-1000">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium">Landing Page</p>
                  <p className="text-xs text-muted-foreground">Gerada em 3s</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;