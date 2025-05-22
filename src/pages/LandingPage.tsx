
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  Activity, 
  ScatterChart, 
  Wand2, 
  Database, 
  Users, 
  LayoutDashboard
} from "lucide-react";

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState<number>(0);

  const features = [
    {
      title: "Drag & Drop Interface",
      description: "Create beautiful dashboards with an intuitive drag and drop interface. No coding required.",
      icon: <LayoutDashboard className="h-8 w-8 text-primary" />
    },
    {
      title: "Advanced Charts",
      description: "Choose from a variety of chart types to visualize your data: bar, line, pie, radar, and more.",
      icon: <BarChart className="h-8 w-8 text-primary" />
    },
    {
      title: "Export & Share",
      description: "Export your dashboards as PNG or PDF to share with your team or include in presentations.",
      icon: <Activity className="h-8 w-8 text-primary" />
    }
  ];

  const upcomingFeatures = [
    {
      title: "Text to Chart",
      description: "Describe the chart you want in plain English, and our AI will generate it for you.",
      icon: <Wand2 className="h-8 w-8 text-primary" />
    },
    {
      title: "Sample Data to Chart",
      description: "Upload your data and let our AI suggest the best chart types for visualization.",
      icon: <Database className="h-8 w-8 text-primary" />
    },
    {
      title: "Team Collaboration",
      description: "Work together with your team on dashboards in real-time with commenting and version history.",
      icon: <Users className="h-8 w-8 text-primary" />
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Data Analyst",
      company: "TechNova",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3",
      quote: "This dashboard builder has transformed how I present data to stakeholders. The intuitive interface and export options save me hours of work each week."
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "GrowthMetrics",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3",
      quote: "The ability to create custom dashboards without writing code has been a game-changer for our team. We can now visualize product metrics in minutes."
    },
    {
      name: "Priya Patel",
      role: "Marketing Director",
      company: "BrandFusion",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3",
      quote: "I use this tool to track our marketing campaigns performance. The variety of chart options helps me communicate complex data trends in a simple way."
    }
  ];

  // Sample chart images for the carousel
  const chartExamples = [
    {
      title: "Sales Dashboard",
      image: "/placeholder.svg",
      chartTypes: ["Bar Chart", "Line Chart", "Pie Chart"]
    },
    {
      title: "Marketing Analytics",
      image: "/placeholder.svg", 
      chartTypes: ["Area Chart", "Donut Chart", "Gauge Chart"]
    },
    {
      title: "Product Performance",
      image: "/placeholder.svg",
      chartTypes: ["Scatter Plot", "Radar Chart", "Funnel Chart"]
    },
    {
      title: "Financial Overview",
      image: "/placeholder.svg",
      chartTypes: ["Line Chart", "Bar Chart", "Treemap"]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ChartFlow</span>
          </div>
          <div>
            <Button asChild>
              <Link to="/app">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              Leading Solutions To<br />
              Visualize Your Data
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Real-time analytics allow you to better manage data visualization, 
              interactive dashboards, and reporting resources.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="px-8">
                <Link to="/app">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg">
                <LineChart className="mr-2 h-4 w-4" />
                View Demos
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-lg shadow-lg overflow-hidden border">
              <img 
                src="/placeholder.svg" 
                alt="Dashboard Preview" 
                className="w-full h-auto" 
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-primary text-white p-2 rounded-lg shadow-lg">
              <PieChart className="h-8 w-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Chart Carousel Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Our Chart Types</h2>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {chartExamples.map((example, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <div className="rounded-xl overflow-hidden border bg-card">
                      <div className="h-48 bg-muted flex items-center justify-center">
                        <img 
                          src={example.image} 
                          alt={example.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{example.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {example.chartTypes.map((type, i) => (
                            <span 
                              key={i} 
                              className="text-xs bg-muted px-2 py-1 rounded-full"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
            >
              <div className="mb-4 p-3 rounded-full w-fit bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Coming Soon</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We're constantly improving our platform. Here's what's coming next.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingFeatures.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="mb-4 p-3 rounded-full w-fit bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="italic">{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Create stunning dashboards and visualize your data in minutes with our intuitive platform.
          </p>
          <Button asChild size="lg" className="px-12">
            <Link to="/app">Start Building Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              <span className="font-semibold">ChartFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ChartFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
