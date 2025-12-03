// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import AdminLayout from '../../components/AdminLayout';
// import { Search, Home, DollarSign, MapPin, Phone, User, CheckCircle, X } from 'lucide-react';

// const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';

// const SERVICE_AREAS = [
//   'Whitefield', 'Indiranagar', 'Koramangala', 'Bengaluru', 'Jayanagar', 'Banashankari',
//   'Basaveshwaranagar', 'Bheemanahalli', 'Bommanahalli', 'Chikkalasandra', 'Dasarahalli',
//   'Domlur', 'Electronic City', 'Frazer Town', 'Girinagar', 'Gokula', 'Gopalapuram',
//   'Hanumanthanagar', 'HBR Layout', 'Hebbal', 'Hoysala', 'HSR Layout', 'Ittamadu',
//   'JP Nagar', 'Jyothinagar', 'Kammanahalli', 'Kaval Byrasandra', 'Kodichikkanahalli',
//   'Kommadi', 'Kundalahalli', 'Lingrajapuram', 'Mahadevapura', 'Malleswaram', 'Marathahalli',
//   'Mathikere', 'Mico Layout', 'Mookambika', 'Nagavara', 'Nagawara', 'Nagarathpet',
//   'Nandini Layout', 'Nayandahalli', 'Old Airport Road', 'Peenya', 'Prithviraj Road',
//   'RMV Extension', 'Sadashivnagar', 'Sahakarnagar', 'Sanjaynagar', 'Sarjapur Road',
//   'Seshadripuram', 'Shantinagar', 'Shivaji Nagar', 'Soladevanahalli', 'Subramanyanagar'
// ];

// const FLAT_TYPES = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Penthouse'];

// const BUDGET_RANGES = [
//   { label: '₹10,000 - ₹15,000', value: '10000-15000' },
//   { label: '₹15,000 - ₹20,000', value: '15000-20000' },
//   { label: '₹20,000 - ₹25,000', value: '20000-25000' },
//   { label: '₹25,000 - ₹35,000', value: '25000-35000' },
//   { label: '₹35,000 - ₹50,000', value: '35000-50000' },
//   { label: 'Above ₹50,000', value: '50000-above' },
// ];


// const PROPERTY_TYPES = [
//   'Standalone house',
//   'Apartment',
//   'Gated community',
//   'Independent house',
//   'Villa',
//   'PG / Co-living',
//   'Plot / Land',
//   'Anything is fine',
// ];

// const FURNISHING_TYPES = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];

// const AMENITIES = ['Parking', 'Security', 'Power backup', 'Lift', 'Balcony'];


// export default function AdminAddLeadPage() {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     name: '',
//     phoneNumber: '',
//     address: '',
//     budget: '',
//     flatType: '',
//     areaKey: '',
//     propertyType: '',   
//    furnishingType: '',
//   amenities: [] as string[]
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
//   const autocompleteRef = useRef<HTMLDivElement>(null);

//   const toggleAmenity = (amenity: string) => {
//   setFormData(prev => {
//     const exists = prev.amenities.includes(amenity);
//     return {
//       ...prev,
//       amenities: exists
//         ? prev.amenities.filter(a => a !== amenity)
//         : [...prev.amenities, amenity],
//     };
//   });
// };


//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = SERVICE_AREAS.filter(area =>
//         area.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredAreas(filtered);
//     } else {
//       setFilteredAreas(SERVICE_AREAS);
//     }
//   }, [searchTerm]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value.replace(/\D/g, '');
//     if (value.length > 10) value = value.slice(0, 10);
//     setFormData({ ...formData, phoneNumber: value });
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     if (e.target.name === 'phoneNumber') return handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleAreaSelect = (area: string) => {
//     setFormData({
//       ...formData,
//       address: 'Bangalore',
//       areaKey: area,
//     });
//     setSearchTerm(area);
//     setShowSuggestions(false);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     if (formData.phoneNumber.length !== 10) {
//       setMessage({ type: 'error', text: 'Phone number must be exactly 10 digits' });
//       setLoading(false);
//       return;
//     }

//     let budgetValue: number | undefined;
//     if (formData.budget) {
//       const [min] = formData.budget.split('-');
//       const parsed = parseInt(min, 10);
//       if (!isNaN(parsed)) budgetValue = parsed;
//     }

//     if (!formData.propertyType) {
//   setMessage({ type: 'error', text: 'Please select a property type' });
//   setLoading(false);
//   return;
// }

// if (!formData.flatType) {
//   setMessage({ type: 'error', text: 'Please select a BHK / flat type' });
//   setLoading(false);
//   return;
// }

// if (!formData.areaKey) {
//   setMessage({ type: 'error', text: 'Please select a preferred location' });
//   setLoading(false);
//   return;
// }

// if (!formData.budget) {
//   setMessage({ type: 'error', text: 'Please select a budget range' });
//   setLoading(false);
//   return;
// }


//     try {
//       const response = await fetch(`${baseurl}/api/leads`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: formData.name,
//           phoneNumber: '+91' + formData.phoneNumber,
//           address: formData.address || 'Bangalore',
//           budget: budgetValue,
//           flatType: formData.flatType,
//           areaKey: formData.areaKey,
//           propertyType: formData.propertyType, 
//             furnishingType: formData.furnishingType || undefined,
//   amenities: formData.amenities,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ type: 'success', text: 'Lead created successfully and assigned if broker available.' });
//         setFormData({ name: '', phoneNumber: '', address: '', budget: '', flatType: '', areaKey: '', propertyType: '', furnishingType: '', amenities: [] });
//         setSearchTerm('');
//       } else {
//         setMessage({ type: 'error', text: data.message || 'Something went wrong.' });
//       }
//     } catch (err) {
//       setMessage({ type: 'error', text: 'Network error. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="max-w-3xl mx-auto space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-slate-800">Add Lead</h1>
//           <button
//             onClick={() => router.push('/leads')}
//             className="text-sm text-slate-600 hover:text-slate-900"
//           >
//             Back to leads
//           </button>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-5"
//         >
//           {/* Name */}
//           <div>
//             <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//               <User className="w-4 h-4 mr-2 text-blue-600" />
//               Name *
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               placeholder="Enter full name"
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-black"
//             />
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//               <Phone className="w-4 h-4 mr-2 text-blue-600" />
//               Phone Number *
//             </label>
//             <div className="flex">
//               <span className="inline-flex items-center px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
//                 +91
//               </span>
//               <input
//                 type="tel"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 required
//                 placeholder="10 digit number"
//                 className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-r-xl focus:border-blue-500 focus:outline-none text-black"
//                 maxLength={10}
//               />
//             </div>
//           </div>

//           {/* Location autocomplete */}
//           <div ref={autocompleteRef}>
//             <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//               <MapPin className="w-4 h-4 mr-2 text-blue-600" />
//               Preferred Location *
//             </label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setShowSuggestions(true);
//                 }}
//                 onFocus={() => setShowSuggestions(true)}
//                 placeholder="Search or select location"
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-black"
//                 required
//               />

//               {showSuggestions && filteredAreas.length > 0 && (
//                 <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
//                   {filteredAreas.map((area, index) => (
//                     <button
//                       key={index}
//                       type="button"
//                       onClick={() => handleAreaSelect(area)}
//                       className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 text-black"
//                     >
//                       <div className="flex items-center">
//                         <MapPin className="w-4 h-4 mr-2 text-blue-600" />
//                         <span>{area}</span>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Flat type */}
//           {/* <div>
//             <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//               <Home className="w-4 h-4 mr-2 text-blue-600" />
//               Property Type *
//             </label>
//             <select
//               name="flatType"
//               value={formData.flatType}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-black"
//             >
//               <option value="">Select property type</option>
//               {FLAT_TYPES.map((t) => (
//                 <option key={t} value={t}>{t}</option>
//               ))}
//             </select>
//           </div> */}

//           {/* Property Type */}
// <div>
//   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//     <Home className="w-4 h-4 mr-2 text-blue-600" />
//     Property Type *
//   </label>
//   <select
//     name="propertyType"
//     value={formData.propertyType}
//     onChange={handleChange}
//     required
//     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-black"
//   >
//     <option value="">Select property type</option>
//     {PROPERTY_TYPES.map((t) => (
//       <option key={t} value={t}>{t}</option>
//     ))}
//   </select>
// </div>

// {/* Flat / BHK Type (optional) */}
// <div>
//   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//     <Home className="w-4 h-4 mr-2 text-blue-400" />
//     BHK / Flat Type (optional)
//   </label>
//   <select
//     name="flatType"
//     value={formData.flatType}
//     onChange={handleChange}
//     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-black"
//   >
//     <option value="">Select BHK / flat type</option>
//     {FLAT_TYPES.map((t) => (
//       <option key={t} value={t}>{t}</option>
//     ))}
//   </select>
// </div>


//           {/* Budget */}
//           <div>
//             <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//               <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
//               Budget Range *
//             </label>
//             <select
//               name="budget"
//               value={formData.budget}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-black"
//             >
//               <option value="">Select budget range</option>
//               {BUDGET_RANGES.map((r) => (
//                 <option key={r.value} value={r.value}>{r.label}</option>
//               ))}
//             </select>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 <span>Creating...</span>
//               </>
//             ) : (
//               <>
//                 <CheckCircle className="w-5 h-5" />
//                 <span>Create Lead</span>
//               </>
//             )}
//           </button>

//           {message && (
//             <div
//               className={`mt-4 p-3 rounded-xl flex items-start gap-2 ${
//                 message.type === 'success'
//                   ? 'bg-green-50 border border-green-200 text-green-700'
//                   : 'bg-red-50 border border-red-200 text-red-700'
//               }`}
//             >
//               {message.type === 'success' ? (
//                 <CheckCircle className="w-4 h-4 mt-0.5" />
//               ) : (
//                 <X className="w-4 h-4 mt-0.5" />
//               )}
//               <p className="text-sm">{message.text}</p>
//             </div>
//           )}
//         </form>
//       </div>
//     </AdminLayout>
//   );
// }



'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';
import {
  Search,
  Home,
  DollarSign,
  MapPin,
  Phone,
  User,
  CheckCircle,
  X,
} from 'lucide-react';

const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';

const SERVICE_AREAS = [
  'Whitefield',
  'Indiranagar',
  'Koramangala',
  'Bengaluru',
  'Jayanagar',
  'Banashankari',
  'Basaveshwaranagar',
  'Bheemanahalli',
  'Bommanahalli',
  'Chikkalasandra',
  'Dasarahalli',
  'Domlur',
  'Electronic City',
  'Frazer Town',
  'Girinagar',
  'Gokula',
  'Gopalapuram',
  'Hanumanthanagar',
  'HBR Layout',
  'Hebbal',
  'Hoysala',
  'HSR Layout',
  'Ittamadu',
  'JP Nagar',
  'Jyothinagar',
  'Kammanahalli',
  'Kaval Byrasandra',
  'Kodichikkanahalli',
  'Kommadi',
  'Kundalahalli',
  'Lingrajapuram',
  'Mahadevapura',
  'Malleswaram',
  'Marathahalli',
  'Mathikere',
  'Mico Layout',
  'Mookambika',
  'Nagavara',
  'Nagawara',
  'Nagarathpet',
  'Nandini Layout',
  'Nayandahalli',
  'Old Airport Road',
  'Peenya',
  'Prithviraj Road',
  'RMV Extension',
  'Sadashivnagar',
  'Sahakarnagar',
  'Sanjaynagar',
  'Sarjapur Road',
  'Seshadripuram',
  'Shantinagar',
  'Shivaji Nagar',
  'Soladevanahalli',
  'Subramanyanagar',
];

const FLAT_TYPES = [
  'Anything is fine',
  '1RK',
  '1BHK',
  '2BHK',
  '3BHK',
  '4BHK',
  'Villa',
  'Penthouse',
];

const BUDGET_RANGES = [
  { label: '₹10,000 - ₹15,000', value: '10000-15000' },
  { label: '₹15,000 - ₹20,000', value: '15000-20000' },
  { label: '₹20,000 - ₹25,000', value: '20000-25000' },
  { label: '₹25,000 - ₹35,000', value: '25000-35000' },
  { label: '₹35,000 - ₹50,000', value: '35000-50000' },
  { label: 'Above ₹50,000', value: '50000-above' },
];

const PROPERTY_TYPES = [
  'Anything is fine',
  'Standalone house',
  'Apartment',
  'Gated community',
  'Independent house',
  'Villa',
  'PG / Co-living',
  'Plot / Land',
];

const FURNISHING_TYPES = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];

const AMENITIES = ['Parking', 'Security', 'Power backup', 'Lift', 'Balcony'];

type FormState = {
  name: string;
  phoneNumber: string;
  address: string;
  budget: string;
  flatType: string;
  areaKey: string;
  propertyType: string;
  furnishingType: string;
  amenities: string[];
};

export default function AdminAddLeadPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormState>({
    name: '',
    phoneNumber: '',
    address: '',
    budget: '',
    flatType: '',
    areaKey: '',
    propertyType: '',
    furnishingType: '',
    amenities: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm) {
      const filtered = SERVICE_AREAS.filter(area =>
        area.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAreas(filtered);
    } else {
      setFilteredAreas(SERVICE_AREAS);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    setFormData(prev => ({ ...prev, phoneNumber: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') return handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAreaSelect = (area: string) => {
    setFormData(prev => ({
      ...prev,
      address: 'Bangalore',
      areaKey: area,
    }));
    setSearchTerm(area);
    setShowSuggestions(false);
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (formData.phoneNumber.length !== 10) {
      setMessage({ type: 'error', text: 'Phone number must be exactly 10 digits' });
      setLoading(false);
      return;
    }

    if (!formData.propertyType) {
      setMessage({ type: 'error', text: 'Please select a property type' });
      setLoading(false);
      return;
    }

    if (!formData.flatType) {
      setMessage({ type: 'error', text: 'Please select a BHK / flat type' });
      setLoading(false);
      return;
    }

    if (!formData.areaKey) {
      setMessage({ type: 'error', text: 'Please select a preferred location' });
      setLoading(false);
      return;
    }

    if (!formData.budget) {
      setMessage({ type: 'error', text: 'Please select a budget range' });
      setLoading(false);
      return;
    }

    let budgetValue: number | undefined;
    if (formData.budget) {
      const [min] = formData.budget.split('-');
      const parsed = parseInt(min, 10);
      if (!isNaN(parsed)) budgetValue = parsed;
    }

    try {
      const response = await fetch(`${baseurl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: '+91' + formData.phoneNumber,
          address: formData.address || 'Bangalore',
          budget: budgetValue,
          flatType: formData.flatType,
          areaKey: formData.areaKey,
          propertyType: formData.propertyType,
          furnishingType: formData.furnishingType || undefined,
          amenities: formData.amenities,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Lead created successfully and assigned if broker available.',
        });
        setFormData({
          name: '',
          phoneNumber: '',
          address: '',
          budget: '',
          flatType: '',
          areaKey: '',
          propertyType: '',
          furnishingType: '',
          amenities: [],
        });
        setSearchTerm('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Something went wrong.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Add Lead</h1>
          <button
            onClick={() => router.push('/leads')}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Back to leads
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-5"
        >
          {/* Name */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-black"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4 mr-2 text-blue-600" />
              Phone Number *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
                +91
              </span>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="10 digit number"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-r-xl focus:border-blue-500 focus:outline-none text-black"
                maxLength={10}
              />
            </div>
          </div>

          {/* Location autocomplete */}
          <div ref={autocompleteRef}>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
              Preferred Location *
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search or select location"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-black"
                required
              />

              {showSuggestions && filteredAreas.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                  {filteredAreas.map((area, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAreaSelect(area)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 text-black"
                    >
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                        <span>{area}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Home className="w-4 h-4 mr-2 text-blue-600" />
              Property Type *
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-black"
            >
              <option value="">Select property type</option>
              {PROPERTY_TYPES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Flat / BHK Type */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Home className="w-4 h-4 mr-2 text-blue-600" />
              BHK / Flat Type *
            </label>
            <select
              name="flatType"
              value={formData.flatType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-black"
            >
              <option value="">Select BHK / flat type</option>
              {FLAT_TYPES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
              Budget Range *
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-black"
            >
              <option value="">Select budget range</option>
              {BUDGET_RANGES.map(r => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Furnishing Type */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Home className="w-4 h-4 mr-2 text-blue-600" />
              Furnishing (optional)
            </label>
            <select
              name="furnishingType"
              value={formData.furnishingType}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-black"
            >
              <option value="">Select furnishing</option>
              {FURNISHING_TYPES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Amenities */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Home className="w-4 h-4 mr-2 text-blue-600" />
              Amenities (optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES.map(a => (
                <label
                  key={a}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm cursor-pointer ${
                    formData.amenities.includes(a)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={formData.amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Create Lead</span>
              </>
            )}
          </button>

          {message && (
            <div
              className={`mt-4 p-3 rounded-xl flex items-start gap-2 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4 mt-0.5" />
              ) : (
                <X className="w-4 h-4 mt-0.5" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}
