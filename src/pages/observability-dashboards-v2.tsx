import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ExternalLink, 
  BarChart3,
  Activity,
  Gauge,
  Workflow,
  Database,
  Shield,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';

// Types
interface Dashboard {
  id: string;
  name: string;
  description: string;
  owner: string;
  environment: 'QA' | 'PROD';
  type: 'application' | 'infrastructure' | 'security' | 'business' | 'custom';
  url: string;
  category: string;
  lastUpdated: string;
  viewCount: number;
  tags: string[];
}

// Mock data - Replace with actual API data
const mockDashboards: Dashboard[] = [
  {
    id: '1',
    name: 'Payment Service Health',
    description: 'Real-time monitoring of payment processing metrics including transaction success rates, latency, and error patterns.',
    owner: 'card-platform',
    environment: 'PROD',
    type: 'application',
    url: 'https://observe.capital.one/dashboards/payment-health',
    category: 'Financial',
    lastUpdated: '2 hours ago',
    viewCount: 1247,
    tags: ['payments', 'transactions', 'critical']
  },
  {
    id: '2',
    name: 'Infrastructure Overview',
    description: 'Comprehensive view of infrastructure health across all regions including CPU, memory, disk usage, and network metrics.',
    owner: 'platform',
    environment: 'PROD',
    type: 'infrastructure',
    url: 'https://observe.capital.one/dashboards/infra-overview',
    category: 'Infrastructure',
    lastUpdated: '30 minutes ago',
    viewCount: 892,
    tags: ['infrastructure', 'monitoring', 'resources']
  },
  {
    id: '3',
    name: 'Security Audit Logs',
    description: 'Security event tracking and audit log analysis for compliance and threat detection across all services.',
    owner: 'security',
    environment: 'PROD',
    type: 'security',
    url: 'https://observe.capital.one/dashboards/security-audit',
    category: 'Security',
    lastUpdated: '1 hour ago',
    viewCount: 634,
    tags: ['security', 'compliance', 'audit']
  },
  {
    id: '4',
    name: 'API Gateway Performance',
    description: 'API gateway metrics including request rates, response times, error rates, and throughput analysis.',
    owner: 'api-team',
    environment: 'PROD',
    type: 'application',
    url: 'https://observe.capital.one/dashboards/api-gateway',
    category: 'Infrastructure',
    lastUpdated: '15 minutes ago',
    viewCount: 1456,
    tags: ['api', 'gateway', 'performance']
  },
  {
    id: '5',
    name: 'Customer Analytics',
    description: 'Business intelligence dashboard tracking customer engagement, conversion rates, and user journey analytics.',
    owner: 'analytics',
    environment: 'PROD',
    type: 'business',
    url: 'https://observe.capital.one/dashboards/customer-analytics',
    category: 'Analytics',
    lastUpdated: '3 hours ago',
    viewCount: 721,
    tags: ['analytics', 'business', 'customers']
  },
  {
    id: '6',
    name: 'Database Performance QA',
    description: 'Database query performance, connection pool metrics, and replication lag monitoring for QA environment.',
    owner: 'database-team',
    environment: 'QA',
    type: 'infrastructure',
    url: 'https://observe.capital.one/dashboards/db-performance-qa',
    category: 'Database',
    lastUpdated: '45 minutes ago',
    viewCount: 312,
    tags: ['database', 'performance', 'qa']
  },
  {
    id: '7',
    name: 'Fraud Detection Metrics',
    description: 'Real-time fraud detection system monitoring including ML model performance, alert rates, and false positive tracking.',
    owner: 'risk',
    environment: 'PROD',
    type: 'security',
    url: 'https://observe.capital.one/dashboards/fraud-detection',
    category: 'Security',
    lastUpdated: '20 minutes ago',
    viewCount: 982,
    tags: ['fraud', 'ml', 'security']
  },
  {
    id: '8',
    name: 'Mobile App Vitals',
    description: 'Mobile application performance metrics including crash rates, app startup time, and user session analytics.',
    owner: 'mobile-team',
    environment: 'PROD',
    type: 'application',
    url: 'https://observe.capital.one/dashboards/mobile-vitals',
    category: 'Mobile',
    lastUpdated: '1 hour ago',
    viewCount: 567,
    tags: ['mobile', 'performance', 'app']
  },
  {
    id: '9',
    name: 'Deployment Pipeline',
    description: 'CI/CD pipeline monitoring showing build success rates, deployment frequency, and rollback tracking.',
    owner: 'devops',
    environment: 'PROD',
    type: 'custom',
    url: 'https://observe.capital.one/dashboards/deployment-pipeline',
    category: 'DevOps',
    lastUpdated: '10 minutes ago',
    viewCount: 445,
    tags: ['cicd', 'deployment', 'devops']
  },
  {
    id: '10',
    name: 'Network Latency Monitor',
    description: 'Cross-region network latency tracking and bandwidth utilization across all data centers.',
    owner: 'network-ops',
    environment: 'PROD',
    type: 'infrastructure',
    url: 'https://observe.capital.one/dashboards/network-latency',
    category: 'Infrastructure',
    lastUpdated: '25 minutes ago',
    viewCount: 523,
    tags: ['network', 'latency', 'bandwidth']
  },
  {
    id: '11',
    name: 'User Experience Metrics',
    description: 'Frontend performance tracking including page load times, Core Web Vitals, and user interaction patterns.',
    owner: 'frontend-team',
    environment: 'PROD',
    type: 'application',
    url: 'https://observe.capital.one/dashboards/ux-metrics',
    category: 'Frontend',
    lastUpdated: '40 minutes ago',
    viewCount: 789,
    tags: ['frontend', 'ux', 'performance']
  },
  {
    id: '12',
    name: 'Cost Optimization',
    description: 'Cloud infrastructure cost analysis and optimization recommendations across AWS services.',
    owner: 'finops',
    environment: 'PROD',
    type: 'business',
    url: 'https://observe.capital.one/dashboards/cost-optimization',
    category: 'FinOps',
    lastUpdated: '2 hours ago',
    viewCount: 412,
    tags: ['cost', 'optimization', 'aws']
  }
];

const ObservabilityDashboards = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Get unique values for filters
  const categories = useMemo(() => {
    return ['all', ...new Set(mockDashboards.map(d => d.category))];
  }, []);

  const types = useMemo(() => {
    return ['all', ...new Set(mockDashboards.map(d => d.type))];
  }, []);

  // Filter dashboards
  const filteredDashboards = useMemo(() => {
    return mockDashboards.filter(dashboard => {
      const matchesSearch = dashboard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dashboard.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dashboard.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesEnvironment = environmentFilter === 'all' || dashboard.environment === environmentFilter;
      const matchesType = typeFilter === 'all' || dashboard.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || dashboard.category === categoryFilter;
      return matchesSearch && matchesEnvironment && matchesType && matchesCategory;
    });
  }, [searchQuery, environmentFilter, typeFilter, categoryFilter]);

  // Dashboard type configuration
  const getDashboardTypeConfig = (type: Dashboard['type']) => {
    const configs = {
      application: { 
        icon: Activity, 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        label: 'Application'
      },
      infrastructure: { 
        icon: Database, 
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        label: 'Infrastructure'
      },
      security: { 
        icon: Shield, 
        color: 'bg-red-100 text-red-700 border-red-200',
        label: 'Security'
      },
      business: { 
        icon: TrendingUp, 
        color: 'bg-green-100 text-green-700 border-green-200',
        label: 'Business'
      },
      custom: { 
        icon: Workflow, 
        color: 'bg-orange-100 text-orange-700 border-orange-200',
        label: 'Custom'
      }
    };
    return configs[type];
  };

  const getEnvironmentColor = (env: Dashboard['environment']) => {
    return env === 'PROD' 
      ? 'bg-blue-100 text-blue-700 border-blue-200' 
      : 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Observe Dashboards</h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Centralized access to all Observe dashboards across Capital One Tech ecosystem
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Table View
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-gray-600">Total Dashboards</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{filteredDashboards.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-gray-600">Production</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {mockDashboards.filter(d => d.environment === 'PROD').length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-gray-600">Teams</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(mockDashboards.map(d => d.owner)).size}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Workflow className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-medium text-gray-600">Categories</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(mockDashboards.map(d => d.category)).size}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search dashboards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Environment Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <select
                value={environmentFilter}
                onChange={(e) => setEnvironmentFilter(e.target.value)}
                className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Environments</option>
                <option value="PROD">Production</option>
                <option value="QA">QA</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Types</option>
                {types.filter(t => t !== 'all').map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Grid View - VERSION 2: Optimized for 2 or 4 columns per row */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredDashboards.map((dashboard) => {
              const typeConfig = getDashboardTypeConfig(dashboard.type);
              const TypeIcon = typeConfig.icon;

              return (
                <div
                  key={dashboard.id}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all hover:border-blue-300 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <TypeIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {dashboard.name}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${typeConfig.color}`}>
                        <TypeIcon className="w-3 h-3" />
                        {typeConfig.label}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getEnvironmentColor(dashboard.environment)}`}>
                        {dashboard.environment}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {dashboard.description}
                    </p>

                    {/* Metadata - Compact */}
                    <div className="space-y-1.5 mt-auto">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Owner
                        </span>
                        <span className="font-medium text-gray-900 truncate ml-2">{dashboard.owner}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Category</span>
                        <span className="font-medium text-gray-900 truncate ml-2">{dashboard.category}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          Views
                        </span>
                        <span className="font-medium text-gray-900">{dashboard.viewCount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Tags - Compact */}
                    {dashboard.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
                        {dashboard.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {dashboard.tags.length > 2 && (
                          <span className="px-1.5 py-0.5 text-xs text-gray-500">
                            +{dashboard.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer - Compact */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500 min-w-0">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{dashboard.lastUpdated}</span>
                      </div>
                      <a
                        href={dashboard.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dashboard
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Environment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDashboards.map((dashboard) => {
                    const typeConfig = getDashboardTypeConfig(dashboard.type);
                    const TypeIcon = typeConfig.icon;

                    return (
                      <tr key={dashboard.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <TypeIcon className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900">{dashboard.name}</div>
                              <div className="text-xs text-gray-500 mt-1 line-clamp-2">{dashboard.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border ${typeConfig.color}`}>
                            <TypeIcon className="w-3 h-3" />
                            {typeConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 text-xs font-medium rounded border ${getEnvironmentColor(dashboard.environment)}`}>
                            {dashboard.environment}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{dashboard.owner}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{dashboard.category}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-medium text-gray-900">{dashboard.viewCount.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <a
                            href={dashboard.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredDashboards.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No dashboards found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">About Observe Dashboards</h4>
              <p className="text-sm text-blue-800">
                These dashboards are hosted on the <span className="font-semibold">Observe platform</span> and provide real-time visibility into various aspects of our infrastructure and applications. 
                Click "Open" to access the full dashboard in Observe with interactive charts and drill-down capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservabilityDashboards;