import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  BarChart3, 
  Eye, 
  MousePointer, 
  Zap,
  TrendingUp,
  Calendar,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
const stats = [
  {
    title: "Landing Pages",
    value: "12",
    change: "+3 este mês",
    icon: Zap,
    color: "text-primary"
  },
  {
    title: "Visualizações",
    value: "1,847",
    change: "+12% vs mês anterior",
    icon: Eye,
    color: "text-success"
  },
  {
    title: "Cliques",
    value: "284",
    change: "+8% vs mês anterior",
    icon: MousePointer,
    color: "text-warning"
  },
  {
    title: "Taxa de Conversão",
    value: "15.4%",
    change: "+2.1% vs mês anterior",
    icon: TrendingUp,
    color: "text-success"
  }
];

const recentPages = [
  {
    id: 1,
    name: "Smartphone Galaxy Pro Max",
    status: "Publicada",
    views: 524,
    clicks: 89,
    conversion: "17%",
    createdAt: "2 dias atrás",
    thumbnail: "📱"
  },
  {
    id: 2,
    name: "Headphone Bluetooth Premium",
    status: "Rascunho",
    views: 0,
    clicks: 0,
    conversion: "-",
    createdAt: "1 hora atrás",
    thumbnail: "🎧"
  },
  {
    id: 3,
    name: "Smartwatch Fitness Tracker",
    status: "Publicada",
    views: 312,
    clicks: 45,
    conversion: "14%",
    createdAt: "1 semana atrás",
    thumbnail: "⌚"
  }
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo de volta! Aqui está um resumo das suas landing pages.</p>
          </div>
          <Link to="/dashboard/create">
            <Button className="btn-gradient font-semibold px-6 mt-4 md:mt-0">
              <Plus size={20} className="mr-2" />
              Nova Landing Page
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="card-hover border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r from-primary/10 to-success/10`}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Landing Pages */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Landing Pages Recentes</CardTitle>
                  <CardDescription>Suas criações mais recentes</CardDescription>
                </div>
                <Link to="/dashboard/landing-pages">
                  <Button variant="ghost" className="text-primary">
                    Ver todas
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPages.map((page) => (
                  <div key={page.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{page.thumbnail}</div>
                      <div>
                        <h3 className="font-semibold">{page.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Calendar size={12} />
                            <span>{page.createdAt}</span>
                          </span>
                          <Badge 
                            variant={page.status === "Publicada" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {page.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold">{page.views}</p>
                        <p className="text-muted-foreground">Views</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{page.clicks}</p>
                        <p className="text-muted-foreground">Cliques</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-success">{page.conversion}</p>
                        <p className="text-muted-foreground">Conv.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 size={20} className="mr-2 text-primary" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Melhor página</span>
                  <span className="font-semibold">Smartphone Galaxy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Maior conversão</span>
                  <span className="font-semibold text-success">17%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total de vendas</span>
                  <span className="font-semibold">R$ 12.847</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/dashboard/create" className="block">
                  <Button className="w-full justify-start" variant="ghost">
                    <Plus size={16} className="mr-2" />
                    Nova Landing Page
                  </Button>
                </Link>
                <Link to="/dashboard/products" className="block">
                  <Button className="w-full justify-start" variant="ghost">
                    <Zap size={16} className="mr-2" />
                    Meus Produtos
                  </Button>
                </Link>
                <Link to="/dashboard/analytics" className="block">
                  <Button className="w-full justify-start" variant="ghost">
                    <BarChart3 size={16} className="mr-2" />
                    Ver Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Plan Info */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-success/5">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-primary to-success text-white flex items-center justify-center mb-4">
                  <Zap size={24} />
                </div>
                <h3 className="font-semibold mb-2">Plano Gratuito</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  2/2 landing pages utilizadas
                </p>
                <Button className="btn-gradient w-full font-semibold">
                  Fazer Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;