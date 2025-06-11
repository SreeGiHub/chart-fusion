
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
  Zap
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart as RechartLine,
  Line,
  BarChart as RechartBar,
  Bar,
  PieChart as RechartPie,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";

const LandingPage = () => {
  // Sample data for demonstration
  const sampleData = [
    { name: 'Q1', value: 65, sales: 4000 },
    { name: 'Q2', value: 78, sales: 3000 },
    { name: 'Q3', value: 52, sales: 5000 },
    { name: 'Q4', value: 84, sales: 4500 },
  ];

  const pieData = [
    { name: 'Desktop', value: 45 },
    { name: 'Mobile', value: 30 },
    { name: 'Tablet', value: 25 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">MockDash</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            Dashboard
            <span className="block text-blue-600">Mockups</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Create stunning dashboard mockups and chart visualizations for your presentations. 
            No data required, just pure visualization.
          </p>

          <Button asChild size="lg" className="px-12 py-6 text-lg rounded-full bg-blue-600 hover:bg-blue-700">
            <Link to="/dashboard">Visualize</Link>
          </Button>
        </div>

        {/* Demo Charts */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Line Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartLine data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  />
                </RechartLine>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">Performance Trends</h3>
              <p className="text-sm text-gray-500">Line charts for data progression</p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartBar data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                </RechartBar>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">Revenue Analysis</h3>
              <p className="text-sm text-gray-500">Bar charts for comparisons</p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartPie>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </RechartPie>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">Market Share</h3>
              <p className="text-sm text-gray-500">Pie charts for distributions</p>
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
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Presentation className="h-8 w-8 text-blue-600" />
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
              <LayoutDashboard className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-900">MockDash</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
