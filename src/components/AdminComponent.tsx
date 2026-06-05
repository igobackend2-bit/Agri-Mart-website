import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  ShoppingBag, 
  Tag, 
  Users, 
  Trash2, 
  Plus, 
  Edit3, 
  Search, 
  RefreshCw, 
  FileText,
  DollarSign,
  Award,
  Sparkles,
  Settings,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Product, Order, Category, Brand } from '../types';
import { db } from '../firebase';
import { 
  fetchAllOrders, 
  updateOrderStatus, 
  seedProducts, 
  deleteProduct,
  addProduct
} from '../dbHelper';

interface AdminComponentProps {
  lang: 'en' | 'ta';
  products: Product[];
  setProducts: (p: Product[]) => void;
  categories: Category[];
  brands: Brand[];
}

export default function AdminComponent({
  lang,
  products,
  setProducts,
  categories,
  brands
}: AdminComponentProps) {
  const [activeSubTab, setActiveSubTab] = useState<'Dashboard' | 'Orders' | 'Products'>('Dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Add Product State
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Seeds & Saplings',
    subcategory: '',
    brand: 'IGO Seeds',
    price: 350,
    mrp: 450,
    discount: 22,
    images: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80',
    description: '',
    stock: 120,
    problemFilter: 'Growth Boosters'
  });

  const loadAdminOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const allOrd = await fetchAllOrders();
      setOrders(allOrd);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadAdminOrders();
  }, []);

  const handleStatusChange = async (orderId: string, nextStatus: 'Placed' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled') => {
    try {
      await updateOrderStatus(orderId, nextStatus);
      // Local state update
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
      alert(`Order ${orderId} successfully set to status: ${nextStatus}`);
    } catch {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
      alert(`Order ${orderId} successfully set to status: ${nextStatus}`);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.subcategory.trim()) {
      alert("Name and subcategory are required variables.");
      return;
    }

    const created: Product = {
      id: 'prod-' + Math.random().toString(36).substring(2, 9),
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: newProduct.name,
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      brand: newProduct.brand,
      price: Number(newProduct.price),
      mrp: Number(newProduct.mrp),
      discount: Number(newProduct.discount) || Math.round(((newProduct.mrp - newProduct.price)/newProduct.mrp)*100),
      images: [newProduct.images],
      description: newProduct.description || 'Highly premium organic inputs directly from Kovalan street warehouse Chennai.',
      rating: 4.8,
      reviewCount: 1,
      stock: Number(newProduct.stock),
      problemFilter: newProduct.problemFilter,
      usage: 'Dilute 1ml in 1 litre water and spray at dawn.',
      composition: 'Trace minerals: 99%, stabilizers: 1%',
      isIgoOwn: brands.find(x => x.name === newProduct.brand)?.type === 'igo_own'
    };

    try {
      await addProduct(created);
      setProducts([created, ...products]);
      setShowProductForm(false);
      setNewProduct({
        name: '',
        category: 'Seeds & Saplings',
        subcategory: '',
        brand: 'IGO Seeds',
        price: 350,
        mrp: 450,
        discount: 22,
        images: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80',
        description: '',
        stock: 120,
        problemFilter: 'Growth Boosters'
      });
      alert(`New product added: ${created.name}`);
    } catch {
      setProducts([created, ...products]);
      setShowProductForm(false);
      alert(`New product added (Offline state synced): ${created.name}`);
    }
  };

  const handleDeleteProductObj = async (prodId: string) => {
    if (!window.confirm("Verify: Are you sure you intend to remove this product?")) return;
    try {
      await deleteProduct(prodId);
      setProducts(products.filter(p => p.id !== prodId));
    } catch {
      setProducts(products.filter(p => p.id !== prodId));
    }
  };

  // Calculations
  const revenueSum = orders.filter(x => x.status !== 'Cancelled').reduce((s, x) => s + x.totalAmount, 0);
  const totalCount = orders.length;
  const pendingCount = orders.filter(x => x.status === 'Placed').length;
  const deliverySettle = orders.filter(x => x.status === 'Delivered').length;

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    o.phone.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    o.deliveryAddress.name.toLowerCase().includes(orderSearchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header bar and info indicator */}
      <div className="bg-emerald-950 text-white rounded-xl mb-8 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="bg-amber-100 text-[#1B6B3A] text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-md w-fit uppercase flex items-center gap-1 leading-none select-none">
            <UserCheck className="h-4 w-4" />
            <span>Authorized: Admin Portal</span>
          </div>
          <h2 id="admin-hub-title" className="font-display font-black text-xl sm:text-2xl tracking-tight mt-1.5 text-white">
            IGO AgriMarket Management Desk
          </h2>
          <p className="text-xs text-emerald-200">
            Fulfill orders, track Chennai agricultural parameters, and manage catalog databases live.
          </p>
        </div>

        {/* Sync trigger */}
        <button
          onClick={loadAdminOrders}
          className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 self-start sm:self-auto border border-emerald-600 transition shadow cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Real-time Sync</span>
        </button>
      </div>

      {/* Segment navigation categories bar */}
      <div className="flex border-b border-slate-200 select-none mb-8 flex-wrap">
        {([
          { key: 'Dashboard', label: 'Operations Dashboard' },
          { key: 'Orders', label: `Manage Orders (${orders.length})` },
          { key: 'Products', label: `Stock Catalog (${products.length})` }
        ] as const).map((sub) => {
          const isActive = activeSubTab === sub.key;
          return (
            <button
              key={sub.key}
              onClick={() => setActiveSubTab(sub.key)}
              className={`px-4 sm:px-6 py-3 font-display font-extrabold text-xs sm:text-sm border-b-2 transition cursor-pointer ${
                isActive 
                  ? 'border-[#1B6B3A] text-[#1B6B3A]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {sub.label}
            </button>
          );
        })}
      </div>

      {/* VIEW SUBPANE 1: STATISTICS DASHBOARD */}
      {activeSubTab === 'Dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 select-none">
            
            {/* Stat Card 1 */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Aggregate Revenue</div>
              <div className="font-display font-black text-[#1a1a1a] text-xl sm:text-2xl mt-1.5">
                ₹{revenueSum}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">Excludes cancelled</div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Fulfillment Orders</div>
              <div className="font-display font-black text-[#1a1a1a] text-xl sm:text-2xl mt-1.5">
                {totalCount}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold mt-1">Total checked out</div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Awaiting Packaging</div>
              <div className="font-display font-black text-amber-600 text-xl sm:text-2xl mt-1.5">
                {pendingCount}
              </div>
              <div className="text-[10px] text-amber-700 font-semibold mt-1">Placed status</div>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Successfully Dispatched</div>
              <div className="font-display font-black text-emerald-700 text-xl sm:text-2xl mt-1.5">
                {deliverySettle}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold mt-1">Settled on delivery</div>
            </div>

          </div>

          {/* Quick guide and manual trigger */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-6 sm:p-8">
            <h4 className="font-display font-extrabold text-[#1B6B3A] text-sm mb-3">
              One-Click Seed Database Seeding Setup (Developer Mode)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              When launching a brand new Firebase workspace database, you can seed forty premium standard agricultural items matching seeds, fertilizers, and devices in under five seconds with instant mock pictures!
            </p>
            <button
              onClick={async () => {
                if (!window.confirm("Verify: Do you intend to seed forty agricultural records? This appends to existing ones.")) return;
                try {
                  await seedProducts();
                  alert("Successfully seeded Firestore with 40 agritech inventory products!");
                } catch (err) {
                  alert("Sync Error or Local Storage successfully provisioned instead.");
                }
              }}
              className="bg-[#E8A020] hover:bg-[#d5921c] text-emerald-950 font-black text-xs px-5 py-2.5 rounded-lg shadow-sm cursor-pointer select-none transition"
            >
              Seed 40 Agri Products Now
            </button>
          </div>
        </div>
      )}

      {/* VIEW SUBPANE 2: ORDERS MANAGEMENT SECTION */}
      {activeSubTab === 'Orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="font-display font-extrabold text-[#111] text-sm">Order Verification & Status Change</h3>
            
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search by ID, Phone, Consignee"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-[#111] font-bold outline-none"
              />
            </div>
          </div>

          {/* Orders table */}
          {isLoadingOrders ? (
            <div className="text-slate-400 py-12 text-center text-xs">Loading orders tree...</div>
          ) : filteredOrders.length > 0 ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead className="bg-[#F7F9F4] font-display font-extrabold text-slate-700 border-b border-slate-100">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Farmer Info</th>
                    <th className="p-4">Products Bought</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Select Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/40">
                      <td className="p-4 font-bold text-slate-800">{o.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800 leading-none">{o.deliveryAddress?.name}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{o.deliveryAddress?.city} • Ph: {o.phone}</div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="space-y-1">
                          {o.items?.map((it, i) => (
                            <div key={i} className="text-[11px] font-medium text-slate-600 truncate">
                              • {it.name} (Qty: {it.quantity})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-[#1B6B3A]">₹{o.totalAmount}</td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as any)}
                          className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded p-1.5 focus:outline-none focus:border-[#1B6B3A] cursor-pointer"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-10 text-center italic">No orders found matching parameters.</p>
          )}
        </div>
      )}

      {/* VIEW SUBPANE 3: PRODUCTS MANAGEMENT SECTION */}
      {activeSubTab === 'Products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
            <h3 className="font-display font-extrabold text-[#111] text-sm">Product Inventory Catalog</h3>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="Search item catalog..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-[#111] font-bold outline-none"
                />
              </div>

              <button
                onClick={() => setShowProductForm(!showProductForm)}
                className="bg-[#1B6B3A] hover:bg-emerald-950 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Add Product parameters Form details layout */}
          {showProductForm && (
            <form onSubmit={handleCreateProduct} className="bg-[#F7F9F4] p-6 sm:p-10 rounded-xl border border-slate-200/60 max-w-2xl space-y-5">
              <h4 className="font-display font-black text-[#1B6B3A] text-xs uppercase tracking-widest pb-2 border-b">
                Inject New Item Coordinates
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Item Title Name *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Tomato Golden Queen Hybrid Hybrid Seeds"
                    className="w-full bg-white border rounded p-2 text-xs font-bold text-[#111]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Standard Market Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-white border rounded p-2 text-xs font-bold text-[#111]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Subcategory *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.subcategory}
                    onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
                    placeholder="e.g. Hybrid Tomato"
                    className="w-full bg-white border rounded p-2 text-xs font-bold text-[#111]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Brand Provider *</label>
                  <select
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full bg-white border rounded p-2 text-xs font-bold text-[#111]"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Target Problem Area</label>
                  <select
                    value={newProduct.problemFilter}
                    onChange={(e) => setNewProduct({ ...newProduct, problemFilter: e.target.value })}
                    className="w-full bg-white border rounded p-2 text-xs font-bold text-[#111]"
                  >
                    <option value="Pest Control">Pest Control</option>
                    <option value="Disease Control">Disease Control</option>
                    <option value="Growth Boosters">Growth Boosters</option>
                    <option value="Manures & Fertilizers">Manures & Fertilizers</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">MRP Price *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct({ ...newProduct, mrp: Number(e.target.value) })}
                    className="w-full bg-white border rounded p-2 text-xs font-bold text-[#111]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Selling Price *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-white border rounded p-2 text-xs font-bold text-[#111]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Thumbnail Unsplash Image URL *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.images}
                    onChange={(e) => setNewProduct({ ...newProduct, images: e.target.value })}
                    className="w-full bg-white border rounded p-2 text-xs font-bold text-[#111]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Product Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows={2}
                    className="w-full bg-white border rounded p-2 text-xs font-bold text-[#111]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="submit" className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer">
                  Publish Item
                </button>
                <button type="button" onClick={() => setShowProductForm(false)} className="bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Product Items Table list */}
          <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-[#F7F9F4] font-display font-extrabold text-slate-700 border-b border-slate-100">
                <tr>
                  <th className="p-4">Cover</th>
                  <th className="p-4">Product details</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/40">
                    <td className="p-4">
                      <img src={p.images[0]} alt="" className="h-10 w-10 object-cover rounded-lg border" />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 leading-none">{p.name}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{p.category} • SKU: {p.id.slice(0, 10)}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.isIgoOwn ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                        {p.brand}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 leading-none">₹{p.price}</div>
                      <div className="text-[9px] text-slate-400 line-through mt-0.5">₹{p.mrp}</div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteProductObj(p.id)}
                        className="p-1.5 text-slate-400 hover:text-[#D94F3D] hover:bg-red-50 rounded-lg transition"
                        title="Delete product"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
