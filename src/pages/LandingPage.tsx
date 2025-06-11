import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Activity, 
  LayoutDashboard,
  Presentation,
  Palette,
  Zap,
  Linkedin
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
  AreaChart
} from "recharts";

const LandingPage = () => {
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

          <Button asChild size="lg" className="px-12 py-6 text-lg rounded-full bg-red-600 hover:bg-red-700">
            <Link to="/dashboard">Visualize</Link>
          </Button>
        </div>
      </section>

      {/* Why This Product Exists Section */}
      <section className="py-16 bg-white">
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
                    src="/lovable-uploads/534d6a8f-404d-430c-aaee-052e177ae5e4.png" 
                    alt="Srikanth Reddy - Founder" 
                    className="w-32 h-32 rounded-full object-cover shadow-lg"
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Srikanth Reddy</h3>
                  <p className="text-gray-600 mb-4">Product Manager & Founder</p>
                  
                  <a 
                    href="https://www.linkedin.com/in/srikanth-reddy-dubba1ab561203/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="text-sm font-medium">Connect on LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default LandingPage;
