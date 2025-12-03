'use client';

import AdminLayout from '../components/AdminLayout';
import { Search, Filter, MoreVertical, Star, TrendingUp, RefreshCw, X, Loader2 } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';

interface BrokerStats {
  packageTotalLeads: number;
  remainingLeads: number;
  newLeads: number;
  contacted: number;
  totalAssigned: number;
}

interface Broker {
  _id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  serviceAreas?: string[];
  createdAt?: string;

  monthlyFlatsAvailable?: number;
  customerExpectations?: string;

  stats?: BrokerStats; // new
}


const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';

export default function Brokers() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Refs for infinite scroll
  const observerTarget = useRef<HTMLTableRowElement>(null);
  // const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      // Only reset if search query actually changed
      if (debouncedSearch !== searchQuery) {
        setDebouncedSearch(searchQuery);
        setPage(1);
        setBrokers([]);
        setHasMore(true);
      }
    }, 500);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, debouncedSearch]);

  // Fetch brokers from API with pagination
  const fetchBrokers = useCallback(async (pageNum: number, search: string = '', append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20',
      });
      
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      const response = await fetch(`${baseurl}/api/brokers/admin/all?${params}`);
      if (!response.ok) throw new Error('Failed to fetch brokers');
      const result = await response.json();
      
      const newBrokers = result.data || [];
      setTotalCount(result.pagination?.totalCount || 0);
      
      if (append) {
        setBrokers(prev => [...prev, ...newBrokers]);
      } else {
        setBrokers(newBrokers);
      }
      
      setHasMore(result.pagination?.hasMore || false);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load brokers');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBrokers(1, debouncedSearch, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchBrokers(nextPage, debouncedSearch, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, loadingMore, page, debouncedSearch]);

  const handleRefresh = () => {
    setPage(1);
    setBrokers([]);
    setHasMore(true);
    fetchBrokers(1, debouncedSearch, false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Brokers</h1>
            <p className="text-slate-600 mt-1">
              {totalCount > 0 ? `${totalCount} total brokers` : 'Manage your broker network'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300">
              + Add New Broker
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Total Brokers</p>
                <p className="text-2xl font-bold text-slate-800">{totalCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <Star size={24} className="text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Active Brokers</p>
                <p className="text-2xl font-bold text-slate-800">{brokers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Loaded</p>
                <p className="text-2xl font-bold text-slate-800">{brokers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search brokers by name, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:bg-slate-200 rounded transition-colors"
                >
                  <X size={16} className="text-slate-500" />
                </button>
              )}
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors duration-200">
              <Filter size={20} />
              Filters
            </button>
          </div>
          {searchQuery && (
            <p className="text-sm text-slate-500 mt-2">
              Searching across all brokers...
            </p>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
            <p className="font-semibold">Error loading brokers</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State (initial) */}
        {loading && brokers.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <RefreshCw size={32} className="animate-spin mx-auto text-indigo-600 mb-4" />
            <p className="text-slate-600">Loading brokers...</p>
          </div>
        )}

        {/* Brokers Table */}
        {(!loading || brokers.length > 0) && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Broker</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Service Areas</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Flats / Month</th>      
    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Expectations</th>   
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead> */}
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
  <tr>
    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Broker</th>
    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Contact</th>
    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Service Areas</th>
    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Flats / Month</th>
    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Expectations</th>
    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Leads</th> {/* NEW */}
    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Joined</th>
    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
  </tr>
</thead>

                <tbody className="divide-y divide-slate-200">
                  {brokers.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                        {searchQuery ? 'No brokers found matching your search' : 'No brokers found'}
                      </td>
                    </tr>
                  ) : (
                    <>
                      {brokers.map((broker, index) => (
                        <tr 
                          key={broker._id}
                          ref={index === brokers.length - 5 ? observerTarget : null}
                          className="hover:bg-slate-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {broker.name?.charAt(0) || 'B'}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">{broker.name || 'N/A'}</p>
                                <p className="text-sm text-slate-500">ID: {broker._id.slice(-6)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-slate-700">{broker.email || 'N/A'}</p>
                              <p className="text-sm text-slate-500">{broker.phoneNumber || 'N/A'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {broker.serviceAreas && broker.serviceAreas.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {broker.serviceAreas.map((area, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                                    {area}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-slate-500">No areas</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
  <span className="text-sm text-slate-700">
    {broker.monthlyFlatsAvailable ?? 'N/A'}
  </span>
</td>

<td className="px-6 py-4 max-w-xs">
  <span className="text-xs text-slate-600 line-clamp-2">
    {broker.customerExpectations || '—'}
  </span>
</td>

{/* NEW: Leads info */}
<td className="px-6 py-4">
  <div className="space-y-1">
    <p className="text-sm font-semibold text-slate-800">
      Total Package Leads: {broker.stats?.packageTotalLeads ?? 0}
    </p>
    <p className="text-xs text-slate-600">
      Pending leads: {broker.stats?.remainingLeads ?? 0}
    </p>
    <p className="text-xs text-slate-600">
      New: {broker.stats?.newLeads ?? 0} · Contacted: {broker.stats?.contacted ?? 0}
    </p>
  </div>
</td>

<td className="px-6 py-4">
  <span className="text-sm text-slate-600">
    {broker.createdAt
      ? new Date(broker.createdAt).toLocaleDateString('en-IN')
      : 'N/A'}
  </span>
</td>

                          <td className="px-6 py-4">
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                              <MoreVertical size={18} className="text-slate-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="border-t border-slate-200 p-6 text-center">
                <Loader2 size={24} className="animate-spin mx-auto text-indigo-600 mb-2" />
                <p className="text-sm text-slate-600">Loading more brokers...</p>
              </div>
            )}
            
            {/* End of Results */}
            {!hasMore && brokers.length > 0 && (
              <div className="border-t border-slate-200 p-4 text-center">
                <p className="text-sm text-slate-500">You've reached the end of the list</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
