
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Activity, 
  LayoutDashboard,
  Presentation,
  Palette,
  Zap,
  ChartScatter,
  ChartPie,
  Sparkles,
  Plus
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart as RechartLine,
  Line,
  BarChart as RechartBar,
  Bar,
  PieChart as RechartPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  ScatterChart,
  Scatter
} from "recharts";
import PasteDataDialog from "@/components/PasteDataDialog";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [isPasteDataOpen, setIsPasteDataOpen] = useState(false);
  const navigate = useNavigate();

  const handleVisualizeClick = () => {
    setIsPasteDataOpen(true);
  };

  const handlePasteDataClose = (open: boolean) => {
    setIsPasteDataOpen(open);
    if (!open) {
      // Navigate to dashboard after dialog is closed
      navigate("/dashboard");
    }
  };

  // Enhanced sample data for better visualization
  const lineData = [
    { name: 'Jan', value: 65, growth: 12 },
    { name: 'Feb', value: 78, growth: 18 },
    { name: 'Mar', value: 52, growth: -8 },
    { name: 'Apr', value: 84, growth: 25 },
    { name: 'May', value: 95, growth: 32 },
    { name: 'Jun', value: 88, growth: 28 },
  ];

  const barData = [
    { name: 'Q1', revenue: 4200, target: 4000 },
    { name: 'Q2', revenue: 3800, target: 3500 },
    { name: 'Q3', revenue: 5200, target: 5000 },
    { name: 'Q4', revenue: 4800, target: 4500 },
  ];

  const pieData = [
    { name: 'Desktop', value: 45, color: '#3b82f6' },
    { name: 'Mobile', value: 30, color: '#10b981' },
    { name: 'Tablet', value: 25, color: '#f59e0b' },
  ];

  // New data for additional charts
  const scatterData = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
  ];

  const funnelData = [
    { name: 'Awareness', value: 1000, fill: '#3b82f6' },
    { name: 'Interest', value: 800, fill: '#10b981' },
    { name: 'Consideration', value: 600, fill: '#f59e0b' },
    { name: 'Purchase', value: 300, fill: '#ef4444' },
    { name: 'Retention', value: 200, fill: '#8b5cf6' },
  ];

  const additionalPieData = [
    { name: 'Premium', value: 40, color: '#3b82f6' },
    { name: 'Standard', value: 35, color: '#10b981' },
    { name: 'Basic', value: 25, color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-7 w-7 text-red-600" />
            <span className="text-xl font-bold text-gray-900">Redpaper</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            Dashboard
            <span className="block text-red-600">Mockups</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Create stunning dashboard mockups and chart visualizations for your presentations. 
            No data required, just pure visualization.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Visualize Button with Sample Data */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Button 
                  size="lg" 
                  className="px-12 py-6 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleVisualizeClick}
                >
                  <Sparkles className="h-5 w-5" />
                  Visualize
                </Button>
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  BETA
                </span>
              </div>
              <div className="text-center max-w-xs">
                <p className="text-sm font-medium text-gray-700 mb-1">Paste your data & visualize</p>
                <p className="text-xs text-gray-500">Upload your data and instantly create beautiful charts</p>
                <p className="text-xs text-orange-600 font-medium mt-1">Beta - AI-powered feature</p>
              </div>
            </div>

            {/* Canvas Button for Blank Start */}
            <div className="flex flex-col items-center gap-3">
              <Button asChild size="lg" variant="outline" className="px-12 py-6 text-lg rounded-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Canvas
                </Link>
              </Button>
              <div className="text-center max-w-xs">
                <p className="text-sm font-medium text-gray-700 mb-1">Start from scratch</p>
                <p className="text-xs text-gray-500">Begin with a blank canvas and build your dashboard step by step</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-xs text-gray-400">
            Choose your starting point • No account required • Export ready
          </div>
        </div>
      </section>

      {/* Demo Charts */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our Charts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade visualizations ready for your next presentation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Enhanced Line Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lineData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#colorValue)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900">Performance Analytics</h3>
                <p className="text-sm text-gray-500">Growth trends over time</p>
              </div>
            </div>

            {/* Enhanced Bar Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBar data={barData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </RechartBar>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900">Revenue vs Target</h3>
                <p className="text-sm text-gray-500">Quarterly performance comparison</p>
              </div>
            </div>

            {/* Enhanced Pie Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={30}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </RechartPie>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900">Device Distribution</h3>
                <p className="text-sm text-gray-500">User engagement by platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Charts Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Visualizations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sophisticated chart types for complex data storytelling
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Scatter Plot */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={scatterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Scatter dataKey="z" fill="#8b5cf6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900">Scatter Analysis</h3>
                <p className="text-sm text-gray-500">Correlation patterns visualization</p>
              </div>
            </div>

            {/* Funnel Chart using Horizontal Bar Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBar 
                    data={funnelData} 
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      type="number"
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name"
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      width={80}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </RechartBar>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900">Conversion Funnel</h3>
                <p className="text-sm text-gray-500">Sales pipeline optimization</p>
              </div>
            </div>

            {/* Enhanced Pie Chart with shorter labels */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartPie>
                    <Pie
                      data={additionalPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="none"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {additionalPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </RechartPie>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900">Subscription Tiers</h3>
                <p className="text-sm text-gray-500">Customer segment breakdown</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perfect for Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create mockups without worrying about data. Focus on the story you want to tell.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Presentation className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Presentations</h3>
              <p className="text-gray-600">
                Create compelling visual stories for stakeholder meetings and client presentations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Palette className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Design Mockups</h3>
              <p className="text-gray-600">
                Prototype dashboard layouts and chart arrangements before development.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick & Simple</h3>
              <p className="text-gray-600">
                No data setup required. Drag, drop, and visualize your ideas instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-blue-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <span className="text-4xl">🔮</span>
              Upcoming Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're always working to make your dashboard mockup experience even better. Here's a sneak peek at what's coming soon!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Feature 1: Text-to-Chart */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-200 hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
                Coming Soon
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  Text-to-Chart
                </h3>
                <p className="text-lg text-gray-700 mb-4 font-medium">
                  Ask your data like you're talking to a teammate!
                </p>
                <p className="text-gray-600 mb-6">
                  Simply type what you want to see — for example:
                </p>
                
                <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                  <p className="text-gray-800 italic font-medium">
                    "Show me a bar chart of boys and subject performance"
                  </p>
                </div>
                
                <p className="text-gray-600">
                  …and instantly get a live, editable chart. Change values, styles, or labels on the fly — no coding required.
                </p>
              </div>
            </div>

            {/* Feature 2: Auto-Dashboard */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-200 hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
                Coming Soon
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <img 
                    src="/lovable-uploads/ae73bf95-ef0f-4b98-96e5-c362261c6ccc.png" 
                    alt="Auto Dashboard" 
                    className="w-8 h-8"
                  />
                  Sample Data to Dashboard
                </h3>
                <p className="text-gray-600 mb-6">
                  Upload your data structure and a few rows of sample data — and we'll auto-generate a mock dashboard for you!
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Key KPIs will be auto-identified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Layouts built instantly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Fully customizable by you</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mt-6 font-medium">
                  Perfect for prototyping or demoing fast.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Product Exists Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Why This Product Exists
            </h2>
            
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-2/3">
                <div className="text-lg text-gray-600 leading-relaxed space-y-4">
                  <p>
                    As a Product Manager, I often need to present how data might be visualized—whether it's to explain insights, craft compelling narratives, or show future dashboard designs in stakeholder meetings.
                  </p>
                  <p>
                    Instead of relying on fully functional dashboards or mock data, I wanted a way to quickly mock up visualizations and bring ideas to life—clean, simple, and effective.
                  </p>
                  <p className="font-medium text-gray-900">
                    That's why I created this product.
                  </p>
                </div>
              </div>
              
              <div className="lg:w-1/3 flex flex-col items-center">
                <div className="relative mb-6">
                  <img 
                    src="/lovable-uploads/8b5cfccd-bb99-4faa-8ae4-ad38d12f026e.png" 
                    alt="Srikanth Reddy - Product Manager" 
                    className="w-32 h-32 rounded-full object-cover shadow-lg"
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Srikanth Reddy</h3>
                  <p className="text-gray-600">Product Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-50 border-t">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-gray-900">Redpaper</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Paste Data Dialog */}
      <PasteDataDialog 
        open={isPasteDataOpen} 
        onOpenChange={handlePasteDataClose} 
      />
    </div>
  );
};

export default LandingPage;
