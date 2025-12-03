// 'use client';

// import AdminLayout from '../components/AdminLayout';
// import { Search, Filter, Phone, Edit, RefreshCw, X, MessageSquare, Loader2 } from 'lucide-react';
// import { useEffect, useState, useRef, useCallback } from 'react';
// import { useRouter } from 'next/navigation';

// interface Lead {
//   _id: string;
//   name: string;
//   email?: string;
//   phoneNumber: string;
//   status: string;
//   address?: string;
//   budget?: number;
//   flatType?: string;
//   remark?: string;
//   assignedTo?: {
//     _id: string;
//     name: string;
//     phoneNumber: string;
//   };
// }

// const statusColors: Record<string, string> = {
//   open: 'bg-blue-100 text-blue-700',
//   assigned: 'bg-purple-100 text-purple-700',
//   contacted: 'bg-yellow-100 text-yellow-700',
//   closed: 'bg-green-100 text-green-700',
// };

// const statusOptions = ['open', 'assigned', 'contacted', 'closed'];

// export default function Leads() {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [showRemarkModal, setShowRemarkModal] = useState(false);
//   const [newStatus, setNewStatus] = useState('');
//   const [newRemark, setNewRemark] = useState('');
//   const [updating, setUpdating] = useState(false);
//   const router = useRouter();
  
//   // Pagination state
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [totalCount, setTotalCount] = useState(0);
  
//   // Search state
//   const [searchQuery, setSearchQuery] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');
  
//   // Refs for infinite scroll
//   const observerTarget = useRef<HTMLTableRowElement>(null);
//   const searchTimeoutRef = useRef<NodeJS.Timeout>();

//   console.log('🟢 RENDER:', { loading, leadsCount: leads.length, totalCount, hasMore, searchQuery, debouncedSearch });

//   // Debounce search input
//   useEffect(() => {
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }
    
//     searchTimeoutRef.current = setTimeout(() => {
//       // Only reset if search query actually changed
//       if (debouncedSearch !== searchQuery) {
//         console.log('🟡 Search changed from', debouncedSearch, 'to', searchQuery);
//         setDebouncedSearch(searchQuery);
//         setPage(1);
//         setLeads([]);
//         setHasMore(true);
//       }
//     }, 500);
    
//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, [searchQuery, debouncedSearch]);

//   // Fetch leads from API with pagination
//   const fetchLeads = useCallback(async (pageNum: number, search: string = '', append: boolean = false) => {
//     console.log('🔵 fetchLeads START:', { pageNum, search, append, currentLeadsCount: leads.length, loading });
//     try {
//       if (!append) {
//         setLoading(true);
//         console.log('🔵 Set loading to TRUE');
//       } else {
//         setLoadingMore(true);
//       }
//       setError(null);
      
//       const params = new URLSearchParams({
//         page: pageNum.toString(),
//         limit: '20',
//       });
      
//       if (search.trim()) {
//         params.append('search', search.trim());
//       }
      
//       const url = `http://localhost:7000/api/leads/admin/all?${params}`;
//       console.log('🔵 Fetching from:', url);
//       const response = await fetch(url);
//       console.log('🔵 Response:', response.status, response.ok);
//       if (!response.ok) throw new Error('Failed to fetch leads');
//       const result = await response.json();
//       console.log('🔵 Result data length:', result.data?.length, 'Total count:', result.pagination?.totalCount);
      
//       const newLeads = result.data || [];
//       setTotalCount(result.pagination?.totalCount || 0);
      
//       if (append) {
//         setLeads(prev => [...prev, ...newLeads]);
//         console.log('🔵 APPENDED leads, new total:', leads.length + newLeads.length);
//       } else {
//         setLeads(newLeads);
//         console.log('🔵 SET leads to:', newLeads.length, 'items');
//       }
      
//       setHasMore(result.pagination?.hasMore || false);
      
//     } catch (err) {
//       console.error('🔴 Error fetching leads:', err);
//       setError(err instanceof Error ? err.message : 'Failed to load leads');
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//       console.log('🔵 Set loading to FALSE');
//     }
//   }, []);

//   // Initial load
//   useEffect(() => {
//     fetchLeads(1, debouncedSearch, false);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [debouncedSearch]);

//   // Intersection Observer for infinite scroll
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
//           const nextPage = page + 1;
//           setPage(nextPage);
//           fetchLeads(nextPage, debouncedSearch, true);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     const currentTarget = observerTarget.current;
//     if (currentTarget) {
//       observer.observe(currentTarget);
//     }

//     return () => {
//       if (currentTarget) {
//         observer.unobserve(currentTarget);
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [hasMore, loading, loadingMore, page, debouncedSearch]);

//   // Update lead status
//   const updateStatus = async () => {
//     if (!selectedLead || !newStatus) return;
    
//     try {
//       setUpdating(true);
//       const response = await fetch(`http://localhost:7000/api/leads/${selectedLead._id}/status`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: newStatus }),
//       });
      
//       if (!response.ok) throw new Error('Failed to update status');
      
//       // Update local state
//       setLeads(prev => prev.map(lead => 
//         lead._id === selectedLead._id ? { ...lead, status: newStatus } : lead
//       ));
      
//       setShowStatusModal(false);
//       setSelectedLead(null);
//       setNewStatus('');
//     } catch (err) {
//       alert(err instanceof Error ? err.message : 'Failed to update status');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Update lead remark
//   const updateRemark = async () => {
//     if (!selectedLead) return;
    
//     try {
//       setUpdating(true);
//       const response = await fetch(`http://localhost:7000/api/leads/${selectedLead._id}/remark`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ remark: newRemark }),
//       });
      
//       if (!response.ok) throw new Error('Failed to update remark');
      
//       // Update local state
//       setLeads(prev => prev.map(lead => 
//         lead._id === selectedLead._id ? { ...lead, remark: newRemark } : lead
//       ));
      
//       setShowRemarkModal(false);
//       setSelectedLead(null);
//       setNewRemark('');
//     } catch (err) {
//       alert(err instanceof Error ? err.message : 'Failed to update remark');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const openStatusModal = (lead: Lead) => {
//     setSelectedLead(lead);
//     setNewStatus(lead.status);
//     setShowStatusModal(true);
//   };

//   const openRemarkModal = (lead: Lead) => {
//     setSelectedLead(lead);
//     setNewRemark(lead.remark || '');
//     setShowRemarkModal(true);
//   };

//   const handleRefresh = () => {
//     setPage(1);
//     setLeads([]);
//     setHasMore(true);
//     fetchLeads(1, debouncedSearch, false);
//   };

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-800">Leads</h1>
//             <p className="text-slate-600 mt-1">
//               {totalCount > 0 ? `${totalCount} total leads` : 'Manage and track your leads'}
//             </p>
//           </div>
//           {/* <div className="flex gap-3">
//             <button
//               onClick={handleRefresh}
//               disabled={loading}
//               className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
//             >
//               <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
//               Refresh
//             </button>
//           </div> */}
//           <div className="flex gap-3 flex-wrap">
//   <button
//     onClick={handleRefresh}
//     disabled={loading}
//     className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
//   >
//     <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
//     Refresh
//   </button>

//   <button
//     onClick={() => router.push('/leads/newLead')}
//     className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
//   >
//     + Add Lead
//   </button>

//   <button
//     onClick={() => router.push('/leads/bulkLead')}
//     className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300"
//   >
//     + Bulk Leads
//   </button>
// </div>

//         </div>

//         {/* Search & Filters */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
//               <Search size={20} className="text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Search leads by name, phone, address..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
//               />
//               {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery('')}
//                   className="p-1 hover:bg-slate-200 rounded transition-colors"
//                 >
//                   <X size={16} className="text-slate-500" />
//                 </button>
//               )}
//             </div>
//             <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors duration-200">
//               <Filter size={20} />
//               Filters
//             </button>
//           </div>
//           {searchQuery && (
//             <p className="text-sm text-slate-500 mt-2">
//               Searching across all leads...
//             </p>
//           )}
//         </div>

//         {/* Error State */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
//             <p className="font-semibold">Error loading leads</p>
//             <p className="text-sm">{error}</p>
//           </div>
//         )}

//         {/* Loading State (initial) */}
//         {loading && leads.length === 0 && (
//           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
//             <RefreshCw size={32} className="animate-spin mx-auto text-indigo-600 mb-4" />
//             <p className="text-slate-600">Loading leads...</p>
//           </div>
//         )}

//         {/* Leads Table */}
//         {(!loading || leads.length > 0) && (
//           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Contact</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Budget/Type</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Remark</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-200">
//                   {leads.length === 0 && !loading ? (
//                     <tr>
//                       <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
//                         {searchQuery ? 'No leads found matching your search' : 'No leads found'}
//                       </td>
//                     </tr>
//                   ) : (
//                     <>
//                       {leads.map((lead, index) => (
//                         <tr 
//                           key={lead._id} 
//                           ref={index === leads.length - 5 ? observerTarget : null}
//                           className="hover:bg-slate-50 transition-colors duration-200"
//                         >
//                           <td className="px-6 py-4">
//                             <div className="flex items-center gap-3">
//                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
//                                 {lead.name?.charAt(0) || 'L'}
//                               </div>
//                               <div>
//                                 <p className="font-semibold text-slate-800">{lead.name || 'N/A'}</p>
//                                 <p className="text-sm text-slate-500">ID: {lead._id.slice(-6)}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="space-y-1">
//                               <div className="flex items-center gap-2 text-sm text-slate-600">
//                                 <Phone size={14} />
//                                 {lead.phoneNumber || 'N/A'}
//                               </div>
//                               {lead.address && (
//                                 <div className="flex items-center gap-2 text-sm text-slate-500">
//                                   📍 {lead.address}
//                                 </div>
//                               )}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="space-y-1">
//                               {lead.budget && (
//                                 <p className="text-sm font-semibold text-slate-700">₹{lead.budget.toLocaleString('en-IN')}</p>
//                               )}
//                               {lead.flatType && (
//                                 <p className="text-xs text-slate-500">{lead.flatType}</p>
//                               )}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <button
//                               onClick={() => openStatusModal(lead)}
//                               className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[lead.status] || 'bg-slate-100 text-slate-700'} hover:opacity-80 transition-opacity`}
//                             >
//                               {lead.status}
//                             </button>
//                           </td>
//                           <td className="px-6 py-4">
//                             <button
//                               onClick={() => openRemarkModal(lead)}
//                               className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
//                             >
//                               <MessageSquare size={14} />
//                               {lead.remark ? (
//                                 <span className="truncate max-w-[150px]">{lead.remark}</span>
//                               ) : (
//                                 <span className="text-slate-400">Add remark</span>
//                               )}
//                             </button>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() => openStatusModal(lead)}
//                                 className="p-2 hover:bg-indigo-50 rounded-lg transition-colors duration-200 text-indigo-600"
//                                 title="Update Status"
//                               >
//                                 <Edit size={16} />
//                               </button>
//                               <button
//                                 onClick={() => openRemarkModal(lead)}
//                                 className="p-2 hover:bg-purple-50 rounded-lg transition-colors duration-200 text-purple-600"
//                                 title="Update Remark"
//                               >
//                                 <MessageSquare size={16} />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </>
//                   )}
//                 </tbody>
//               </table>
//             </div>
            
//             {/* Loading More Indicator */}
//             {loadingMore && (
//               <div className="border-t border-slate-200 p-6 text-center">
//                 <Loader2 size={24} className="animate-spin mx-auto text-indigo-600 mb-2" />
//                 <p className="text-sm text-slate-600">Loading more leads...</p>
//               </div>
//             )}
            
//             {/* End of Results */}
//             {!hasMore && leads.length > 0 && (
//               <div className="border-t border-slate-200 p-4 text-center">
//                 <p className="text-sm text-slate-500">You've reached the end of the list</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Status Update Modal */}
//         {showStatusModal && selectedLead && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold text-slate-800">Update Lead Status</h3>
//                 <button
//                   onClick={() => setShowStatusModal(false)}
//                   className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//               <p className="text-slate-600 mb-4">
//                 Update status for <span className="font-semibold">{selectedLead.name}</span>
//               </p>
//               <div className="space-y-3 mb-6">
//                 {statusOptions.map((status) => (
//                   <button
//                     key={status}
//                     onClick={() => setNewStatus(status)}
//                     className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all ${
//                       newStatus === status
//                         ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
//                         : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                     }`}
//                   >
//                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                   </button>
//                 ))}
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowStatusModal(false)}
//                   className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={updateStatus}
//                   disabled={updating || !newStatus}
//                   className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
//                 >
//                   {updating ? 'Updating...' : 'Update Status'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Remark Update Modal */}
//         {showRemarkModal && selectedLead && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold text-slate-800">Update Remark</h3>
//                 <button
//                   onClick={() => setShowRemarkModal(false)}
//                   className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//               <p className="text-slate-600 mb-4">
//                 Add or update remark for <span className="font-semibold">{selectedLead.name}</span>
//               </p>
//               <textarea
//                 value={newRemark}
//                 onChange={(e) => setNewRemark(e.target.value)}
//                 placeholder="Enter remark..."
//                 rows={4}
//                 className="w-full px-4 py-3 rounded-xl bg-slate-100 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all resize-none"
//               />
//               <div className="flex gap-3 mt-4">
//                 <button
//                   onClick={() => setShowRemarkModal(false)}
//                   className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={updateRemark}
//                   disabled={updating}
//                   className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
//                 >
//                   {updating ? 'Updating...' : 'Update Remark'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }



'use client';

import AdminLayout from '../components/AdminLayout';
import {
  Search,
  Filter,
  Phone,
  Edit,
  RefreshCw,
  X,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface Lead {
  _id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  status: string;
  address?: string;
  budget?: number;
  flatType?: string;
  remark?: string;
  areaKey?: string;
  assignedTo?: {
    _id: string;
    name: string;
    phoneNumber: string;
  };
}

interface BrokerOption {
  _id: string;
  name: string;
  phoneNumber: string;
  serviceAreas?: string[];
}

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700',
  assigned: 'bg-purple-100 text-purple-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  closed: 'bg-green-100 text-green-700',
};

const statusOptions = ['open', 'assigned', 'contacted', 'closed'];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newRemark, setNewRemark] = useState('');
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  // pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // search
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');



  // infinite scroll
  const observerTarget = useRef<HTMLTableRowElement | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // assign broker modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [brokers, setBrokers] = useState<BrokerOption[]>([]);
  const [brokersLoading, setBrokersLoading] = useState(false);
  const [selectedBrokerId, setSelectedBrokerId] = useState('');
  const [assignError, setAssignError] = useState<string | null>(null);

  const [brokerSearch, setBrokerSearch] = useState('');
const [isBrokerDropdownOpen, setIsBrokerDropdownOpen] = useState(false);


  const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';
  
    const filteredBrokers = useMemo(() => {
  const term = brokerSearch.trim().toLowerCase();
  if (!term) return brokers;

  return brokers.filter(b => {
    const name = b.name?.toLowerCase() || '';
    const phone = b.phoneNumber?.toLowerCase() || '';
    const areas = (b.serviceAreas || []).join(' ').toLowerCase();

    return (
      name.includes(term) ||
      phone.includes(term) ||
      areas.includes(term)
    );
  });
}, [brokerSearch, brokers]);

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (debouncedSearch !== searchQuery) {
        setDebouncedSearch(searchQuery);
        setPage(1);
        setLeads([]);
        setHasMore(true);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, debouncedSearch]);

  // Fetch leads from API with pagination
  const fetchLeads = useCallback(
    async (pageNum: number, search: string = '', append: boolean = false) => {
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

        const url = `${baseurl}/api/leads/admin/all?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch leads');

        const result = await response.json();
        const newLeads: Lead[] = result.data || [];
        setTotalCount(result.pagination?.totalCount || 0);

        if (append) {
          setLeads(prev => [...prev, ...newLeads]);
        } else {
          setLeads(newLeads);
        }

        setHasMore(result.pagination?.hasMore || false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leads');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // initial load and on search change
  useEffect(() => {
    fetchLeads(1, debouncedSearch, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchLeads(nextPage, debouncedSearch, true);
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

  // update status
  const updateStatus = async () => {
    if (!selectedLead || !newStatus) return;

    try {
      setUpdating(true);
      const response = await fetch(
        `${baseurl}/api/leads/${selectedLead._id}/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error('Failed to update status');

      setLeads(prev =>
        prev.map(lead =>
          lead._id === selectedLead._id ? { ...lead, status: newStatus } : lead
        )
      );

      setShowStatusModal(false);
      setSelectedLead(null);
      setNewStatus('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  // update remark
  const updateRemark = async () => {
    if (!selectedLead) return;

    try {
      setUpdating(true);
      const response = await fetch(
        `${baseurl}/api/leads/${selectedLead._id}/remark`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ remark: newRemark }),
        }
      );

      if (!response.ok) throw new Error('Failed to update remark');

      setLeads(prev =>
        prev.map(lead =>
          lead._id === selectedLead._id ? { ...lead, remark: newRemark } : lead
        )
      );

      setShowRemarkModal(false);
      setSelectedLead(null);
      setNewRemark('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update remark');
    } finally {
      setUpdating(false);
    }
  };

  const openStatusModal = (lead: Lead) => {
    setSelectedLead(lead);
    setNewStatus(lead.status);
    setShowStatusModal(true);
  };

  const openRemarkModal = (lead: Lead) => {
    setSelectedLead(lead);
    setNewRemark(lead.remark || '');
    setShowRemarkModal(true);
  };

  const handleRefresh = () => {
    setPage(1);
    setLeads([]);
    setHasMore(true);
    fetchLeads(1, debouncedSearch, false);
  };

  // load brokers for given lead based on areaKey or address
  const loadBrokersForLead = async (lead: Lead) => {
    try {
      setBrokersLoading(true);
      setAssignError(null);

      const params = new URLSearchParams();
      if (lead.areaKey) {
        params.append('areaKey', lead.areaKey);
      } else if (lead.address) {
        params.append('address', lead.address);
      }

      const url = `${baseurl}/api/leads/by-area?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch brokers for this area');

      const json = await res.json();
      setBrokers(json.data || []);
    } catch (err) {
      setAssignError(
        err instanceof Error ? err.message : 'Failed to load brokers'
      );
      setBrokers([]);
    } finally {
      setBrokersLoading(false);
    }
  };

  // const openAssignModal = (lead: Lead) => {
  //   setSelectedLead(lead);
  //   setShowAssignModal(true);
  //   setSelectedBrokerId('');
  //   setBrokers([]);
  //   loadBrokersForLead(lead);
  // };

  const openAssignModal = (lead: Lead) => {
  setSelectedLead(lead);
  setShowAssignModal(true);
  setSelectedBrokerId('');
  setBrokers([]);
  setBrokerSearch(''); // clear autocomplete text
  loadBrokersForLead(lead);
};


  const handleAssignBroker = async () => {
    if (!selectedLead || !selectedBrokerId) return;

    try {
      setAssignLoading(true);
      setAssignError(null);

      let url = '';
      let payload: any = {};

      if (!selectedLead.assignedTo || selectedLead.status === 'open') {
        url = `${baseurl}/api/leads/assign-to-broker`;
        payload = {
          brokerId: selectedBrokerId,
          leadIds: [selectedLead._id],
        };
      } else {
        url = `${baseurl}/api/leads/reassign-leads`;
        payload = {
          fromBrokerId: selectedLead.assignedTo._id,
          toBrokerId: selectedBrokerId,
          leadIds: [selectedLead._id],
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Failed to assign lead');
      }

      // find selected broker to update UI
      const broker = brokers.find(b => b._id === selectedBrokerId);

      setLeads(prev =>
        prev.map(l =>
          l._id === selectedLead._id
            ? {
                ...l,
                status: 'assigned',
                assignedTo: broker
                  ? {
                      _id: broker._id,
                      name: broker.name,
                      phoneNumber: broker.phoneNumber,
                    }
                  : l.assignedTo,
              }
            : l
        )
      );

      setShowAssignModal(false);
      setSelectedLead(null);
      setSelectedBrokerId('');
    } catch (err) {
      setAssignError(
        err instanceof Error ? err.message : 'Failed to assign lead'
      );
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-black">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Leads</h1>
            <p className="text-slate-600 mt-1">
              {totalCount > 0
                ? `${totalCount} total leads`
                : 'Manage and track your leads'}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={loading ? 'animate-spin' : ''}
              />
              Refresh
            </button>

            <button
              onClick={() => router.push('/leads/newLead')}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
            >
              + Add Lead
            </button>

            <button
              onClick={() => router.push('/leads/bulkLead')}
              className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300"
            >
              + Bulk Leads
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search leads by name, phone, address..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
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
              Searching across all leads...
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
            <p className="font-semibold">Error loading leads</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Initial loading */}
        {loading && leads.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <RefreshCw
              size={32}
              className="animate-spin mx-auto text-indigo-600 mb-4"
            />
            <p className="text-slate-600">Loading leads...</p>
          </div>
        )}

        {/* Leads table */}
        {(!loading || leads.length > 0) && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Budget/Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Broker
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Remark
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {leads.length === 0 && !loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        {searchQuery
                          ? 'No leads found matching your search'
                          : 'No leads found'}
                      </td>
                    </tr>
                  ) : (
                    <>
                      {leads.map((lead, index) => (
                        <tr
                          key={lead._id}
                          ref={
                            index === leads.length - 5
                              ? observerTarget
                              : null
                          }
                          className="hover:bg-slate-50 transition-colors duration-200"
                        >
                          {/* Name */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {lead.name?.charAt(0) || 'L'}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">
                                  {lead.name || 'N/A'}
                                </p>
                                <p className="text-sm text-slate-500">
                                  ID: {lead._id.slice(-6)}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone size={14} />
                                {lead.phoneNumber || 'N/A'}
                              </div>
                              {lead.address && (
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <span>📍 {lead.address}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Budget / Type */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {lead.budget && (
                                <p className="text-sm font-semibold text-slate-700">
                                  ₹
                                  {lead.budget.toLocaleString('en-IN')}
                                </p>
                              )}
                              {lead.flatType && (
                                <p className="text-xs text-slate-500">
                                  {lead.flatType}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() => openStatusModal(lead)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                statusColors[lead.status] ||
                                'bg-slate-100 text-slate-700'
                              } hover:opacity-80 transition-opacity`}
                            >
                              {lead.status}
                            </button>
                          </td>

                          {/* Broker */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm text-slate-700 font-medium">
                                {lead.assignedTo?.name || 'Unassigned'}
                              </span>
                              {lead.assignedTo?.phoneNumber && (
                                <span className="text-xs text-slate-500">
                                  {lead.assignedTo.phoneNumber}
                                </span>
                              )}
                              {lead.areaKey && (
                                <span className="text-xs text-slate-400">
                                  Area: {lead.areaKey}
                                </span>
                              )}
                              <button
                                onClick={() => openAssignModal(lead)}
                                className="mt-1 inline-flex items-center text-xs px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                              >
                                {lead.assignedTo
                                  ? 'Reassign broker'
                                  : 'Assign broker'}
                              </button>
                            </div>
                          </td>

                          {/* Remark */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() => openRemarkModal(lead)}
                              className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                              <MessageSquare size={14} />
                              {lead.remark ? (
                                <span className="truncate max-w-[150px]">
                                  {lead.remark}
                                </span>
                              ) : (
                                <span className="text-slate-400">
                                  Add remark
                                </span>
                              )}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openStatusModal(lead)}
                                className="p-2 hover:bg-indigo-50 rounded-lg transition-colors duration-200 text-indigo-600"
                                title="Update Status"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => openRemarkModal(lead)}
                                className="p-2 hover:bg-purple-50 rounded-lg transition-colors duration-200 text-purple-600"
                                title="Update Remark"
                              >
                                <MessageSquare size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Loading more */}
            {loadingMore && (
              <div className="border-t border-slate-200 p-6 text-center">
                <Loader2
                  size={24}
                  className="animate-spin mx-auto text-indigo-600 mb-2"
                />
                <p className="text-sm text-slate-600">
                  Loading more leads...
                </p>
              </div>
            )}

            {/* End of list */}
            {!hasMore && leads.length > 0 && (
              <div className="border-t border-slate-200 p-4 text-center">
                <p className="text-sm text-slate-500">
                  You have reached the end of the list
                </p>
              </div>
            )}
          </div>
        )}

        {/* Status modal */}
        {showStatusModal && selectedLead && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">
                  Update Lead Status
                </h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-slate-600 mb-4">
                Update status for{' '}
                <span className="font-semibold">{selectedLead.name}</span>
              </p>
              <div className="space-y-3 mb-6">
                {statusOptions.map(status => (
                  <button
                    key={status}
                    onClick={() => setNewStatus(status)}
                    className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all ${
                      newStatus === status
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateStatus}
                  disabled={updating || !newStatus}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Remark modal */}
        {showRemarkModal && selectedLead && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">
                  Update Remark
                </h3>
                <button
                  onClick={() => setShowRemarkModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-slate-600 mb-4">
                Add or update remark for{' '}
                <span className="font-semibold">{selectedLead.name}</span>
              </p>
              <textarea
                value={newRemark}
                onChange={e => setNewRemark(e.target.value)}
                placeholder="Enter remark..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowRemarkModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateRemark}
                  disabled={updating}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Remark'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assign broker modal */}
        {showAssignModal && selectedLead && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">
                  {selectedLead.assignedTo
                    ? 'Reassign Broker'
                    : 'Assign Broker'}
                </h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* <div className="mb-4">
                <p className="text-slate-700 font-medium">
                  {selectedLead.name}
                </p>
                {selectedLead.phoneNumber && (
                  <p className="text-sm text-slate-500">
                    {selectedLead.phoneNumber}
                  </p>
                )}
                {(selectedLead.areaKey || selectedLead.address) && (
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedLead.areaKey
                      ? `Area: ${selectedLead.areaKey}`
                      : `Address: ${selectedLead.address}`}
                  </p>
                )}
              </div> */}

              <div className="mb-4">
  <p className="text-slate-700 font-medium">
    {selectedLead.name}
  </p>
  {selectedLead.phoneNumber && (
    <p className="text-sm text-slate-500">
      {selectedLead.phoneNumber}
    </p>
  )}
  {(selectedLead.areaKey || selectedLead.address) && (
    <p className="text-xs text-slate-500 mt-1">
      {selectedLead.areaKey
        ? `Area: ${selectedLead.areaKey}`
        : `Address: ${selectedLead.address}`}
    </p>
  )}

  {selectedLead.assignedTo && (
    <p className="text-xs text-slate-500 mt-2">
      Present broker:{' '}
      <span className="font-semibold">
        {selectedLead.assignedTo.name} ({selectedLead.assignedTo.phoneNumber})
      </span>
    </p>
  )}
</div>


              {assignError && (
                <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {assignError}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select broker
                </label>

                {/* {brokersLoading ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Loading brokers for this area...</span>
                  </div>
                ) : brokers.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No brokers found for this area. Add brokers with this
                    service area or update the lead location.
                  </p>
                ) : (
                  <select
                    value={selectedBrokerId}
                    onChange={e => setSelectedBrokerId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none text-sm"
                  >
                    <option value="">Select a broker</option>
                    {brokers.map(b => (
                      <option key={b._id} value={b._id}>
                        {b.name} ({b.phoneNumber})
                      </option>
                    ))}
                  </select>
                )} */}
{brokersLoading ? (
  <div className="flex items-center gap-2 text-sm text-slate-500">
    <Loader2 size={16} className="animate-spin" />
    <span>Loading brokers for this area...</span>
  </div>
) : brokers.length === 0 ? (
  <p className="text-sm text-slate-500">
    No eligible brokers found for this area. Only paid brokers with remaining
    capacity are shown. Add brokers with this service area or update the lead
    location.
  </p>
) : (
  <div className="relative">
    <input
      type="text"
      value={brokerSearch}
      onChange={e => {
        setBrokerSearch(e.target.value);
        setIsBrokerDropdownOpen(true);
      }}
      onFocus={() => setIsBrokerDropdownOpen(true)}
      placeholder="Search and select broker..."
      className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none text-sm"
    />

    {isBrokerDropdownOpen && filteredBrokers.length > 0 && (
      <div className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
        {filteredBrokers.map(b => {
          const isCurrent =
            selectedLead?.assignedTo &&
            selectedLead.assignedTo._id === b._id;

          return (
            <button
              key={b._id}
              type="button"
              onClick={() => {
                setSelectedBrokerId(b._id);
                setBrokerSearch(`${b.name} (${b.phoneNumber})`);
                setIsBrokerDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-100 flex flex-col"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-slate-800">
                  {b.name} ({b.phoneNumber})
                </span>

                {isCurrent && (
                  <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                    Present broker
                  </span>
                )}
              </div>

              {b.serviceAreas && b.serviceAreas.length > 0 && (
                <span className="text-xs text-slate-500 mt-1">
                  Areas: {b.serviceAreas.join(', ')}
                </span>
              )}
            </button>
          );
        })}
      </div>
    )}
  </div>
)}



              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignBroker}
                  disabled={
                    assignLoading || !selectedBrokerId || brokersLoading
                  }
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {assignLoading
                    ? 'Assigning...'
                    : selectedLead.assignedTo
                    ? 'Reassign'
                    : 'Assign'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
