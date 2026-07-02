import { supabase } from '../supabaseClient';

const ORDER_STATUS_TEXT = {
  Processing: 'Dermatological formulas are being verified and boxed.',
  'In Transit': 'Parcel is with the local courier for distribution.',
  Delivered: 'Delivered to reception. Signature acquired.',
  Cancelled: 'Order was cancelled by the customer.',
};

const parseColors = (colors) => {
  if (!colors) return ['#C9A769', '#8B3A4B'];
  return typeof colors === 'string' ? JSON.parse(colors) : colors;
};

const formatOrderDate = (createdAt) =>
  new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

const formatReviewDate = (createdAt) =>
  new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

const buildOrderTimeline = (status, createdAt) => {
  const placedDate = new Date(createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const steps = [
    { label: 'Ordered', key: 'ordered' },
    { label: 'Processing', key: 'processing' },
    { label: 'In Transit', key: 'transit' },
    { label: 'Delivered', key: 'delivered' },
  ];

  const statusIndex =
    status === 'Processing' ? 1 :
    status === 'In Transit' ? 2 :
    status === 'Delivered' ? 3 :
    status === 'Cancelled' ? 0 : 1;

  return steps.map((step, idx) => ({
    label: step.label,
    date: idx === 0 ? placedDate : idx <= statusIndex ? placedDate : idx === statusIndex + 1 ? 'Pending' : 'Est. soon',
    completed: idx <= statusIndex,
    current: idx === statusIndex && status !== 'Delivered' && status !== 'Cancelled',
  }));
};

const mapOrderItem = (orderItem) => {
  const product = orderItem.products || {};
  return {
    id: orderItem.product_id,
    name: product.name || 'Product',
    subtitle: product.subtitle || '',
    price: orderItem.price ?? product.price ?? 0,
    qty: orderItem.quantity,
    bottle: product.bottle || 'bottle',
    colors: parseColors(product.colors),
    selectedShadeIndex: 0,
  };
};

export const mapOrderRow = (row) => {
  const items = (row.order_items || []).map(mapOrderItem);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return {
    id: row.id,
    date: formatOrderDate(row.created_at),
    status: row.status,
    statusText: ORDER_STATUS_TEXT[row.status] || 'Order update in progress.',
    total: row.total ?? subtotal,
    shippingCost: 0,
    taxCost: 0,
    subtotal,
    paymentMethod: row.payment_method || 'Card',
    shippingAddress: row.shipping_address || '',
    carrier: 'Standard Shipping',
    trackingNumber: `REF-${row.id}`,
    items,
    timeline: buildOrderTimeline(row.status, row.created_at),
    created_at: row.created_at,
  };
};

const mapReviewRow = (row) => ({
  id: row.id,
  productId: row.product_id,
  product_id: row.product_id,
  productName: row.products?.name || row.product_name || 'Product',
  name: row.user_name || 'Customer',
  customer: row.user_name || 'Customer',
  user_name: row.user_name,
  location: row.location || 'Verified Buyer',
  rating: row.rating,
  quote: row.review,
  comment: row.review,
  content: row.review,
  review: row.review,
  date: row.created_at ? formatReviewDate(row.created_at) : '',
  created_at: row.created_at,
  status: row.status || 'Approved',
  swatch: '#C9A769',
});

// --- Auth Helpers ---
export const getAuthenticatedUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) return session.user;

  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// --- Products ---
let productsCache = null;

export const clearProductsCache = () => {
  productsCache = null;
};

// Set up realtime subscription for products
if (typeof window !== 'undefined') {
  supabase
    .channel('public:products')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
      productsCache = null;
      window.dispatchEvent(new Event('products-updated'));
      window.dispatchEvent(new Event('admin-data-updated')); // Sync admin panel
    })
    .subscribe();
}

export const fetchProducts = async (forceRefresh = false) => {
  if (productsCache && !forceRefresh) return productsCache;
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error || !data) return [];

    productsCache = data.map((p) => ({
      ...p,
      colors: parseColors(p.colors),
      oldPrice: p.old_price ?? p.oldPrice,
    }));
    return productsCache;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const searchProducts = async (query) => {
  if (!query || query.trim() === '') return [];

  // Normalize: lowercase and collapse whitespace
  const normalise = (str) =>
    (str || '').toLowerCase().replace(/\s+/g, ' ').trim();

  const normQuery = normalise(query);

  try {
    // Re-use the cache populated by fetchProducts when available,
    // otherwise fetch fresh from Supabase so new products are always searchable.
    const all = await fetchProducts();

    const matched = all.filter((p) => {
      const name     = normalise(p.name);
      const brand    = normalise(p.brand);
      const category = normalise(p.category);
      const subtitle = normalise(p.subtitle);
      return (
        name.includes(normQuery) ||
        brand.includes(normQuery) ||
        category.includes(normQuery) ||
        subtitle.includes(normQuery)
      );
    });

    return matched.slice(0, 8);
  } catch (e) {
    // Hard fallback: direct Supabase ilike query (name only, no tags)
    try {
      const searchTerm = `%${normQuery}%`;
      const { data } = await supabase
        .from('products')
        .select('*')
        .ilike('name', searchTerm)
        .limit(8);

      if (data) {
        return data.map((p) => ({
          ...p,
          colors: parseColors(p.colors),
          oldPrice: p.old_price ?? p.oldPrice,
        }));
      }
    } catch (_) {
      // ignore secondary error
    }
    return [];
  }
};

// --- Categories ---
export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error || !data) return [];

    return data.map((c) => ({
      ...c,
      swatches: typeof c.swatches === 'string' ? JSON.parse(c.swatches) : c.swatches,
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
};

// --- Brands ---
export const fetchBrands = async () => {
  try {
    const { data, error } = await supabase.from('brands').select('name');
    if (error || !data) return [];
    return data.map((b) => b.name);
  } catch (e) {
    console.error(e);
    return [];
  }
};

// --- Reviews ---
export const fetchReviews = async () => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, products(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapReviewRow);
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const fetchProductReviews = async (productId) => {
  if (!productId) return [];

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapReviewRow);
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const submitReview = async ({ productId, rating, review, userName }) => {
  const user = await getAuthenticatedUser();
  if (!user) {
    window.location.href = '/login';
    return { success: false, error: 'Authentication required' };
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        product_id: productId,
        rating,
        review,
        user_name: userName || user.user_metadata?.name || user.email?.split('@')[0] || 'Customer',
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: mapReviewRow(data) };
  } catch (e) {
    console.error('Review submit error:', e);
    return { success: false, error: e.message };
  }
};

// --- Offers ---
export const fetchOffers = async () => {
  try {
    const { data, error } = await supabase.from('offers').select('*');
    if (error || !data) return [];
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

// --- Collections ---
let collectionsCache = null;
export const fetchCollections = async () => {
  if (collectionsCache) return collectionsCache;
  try {
    const { data, error } = await supabase.from('collections').select('*');
    if (error || !data) return [];

    collectionsCache = data.map((c) => ({
      ...c,
      categories: typeof c.categories === 'string' ? JSON.parse(c.categories) : c.categories,
      badges: typeof c.badges === 'string' ? JSON.parse(c.badges) : c.badges,
      priceRange: typeof c.price_range === 'string' ? JSON.parse(c.price_range) : c.price_range || c.priceRange,
    }));
    return collectionsCache;
  } catch (e) {
    console.error(e);
    return [];
  }
};

// --- Blog Posts ---
export const fetchBlogPosts = async () => {
  try {
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (error || !data) return [];
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

// --- Newsletter ---
export const subscribeNewsletter = async (email) => {
  try {
    const { error } = await supabase.from('newsletter_subscribers').insert({ email });
    if (error) throw error;
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: e.message };
  }
};

// --- Cart Items ---
export const fetchCart = async () => {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', user.id);

    if (error) throw error;

    return data
      ? data.filter(row => row.products).map((row) => ({
          ...row.products,
          colors: parseColors(row.products?.colors),
          oldPrice: row.products?.old_price ?? row.products?.oldPrice,
          qty: row.quantity,
          selectedShadeIndex: 0,
        }))
      : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const updateCartItem = async (product, quantity) => {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'Authentication required' };

  try {
    if (quantity <= 0) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', product.id);

      if (error) throw error;
    } else {
      const { data: existing, error: selectError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existing) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity,
          });

        if (error) throw error;
      }
    }

    return { success: true };
  } catch (e) {
    console.error('Cart update error:', e);
    return { success: false, error: e.message };
  }
};

export const clearCart = async () => {
  const user = await getAuthenticatedUser();
  if (!user) return;

  try {
    const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);
    if (error) throw error;
  } catch (e) {
    console.error(e);
  }
};

// --- Wishlist ---
export const fetchWishlist = async () => {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select('*, products(*)')
      .eq('user_id', user.id);

    if (error) throw error;

    return data
      ? data.filter(item => item.products).map((item) => ({
          ...item.products,
          colors: parseColors(item.products?.colors),
          oldPrice: item.products?.old_price ?? item.products?.oldPrice,
        }))
      : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const toggleWishlist = async (product, isAdding) => {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'Authentication required' };

  try {
    if (!isAdding) {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', product.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: product.id,
        });

      if (error) throw error;
    }

    return { success: true };
  } catch (e) {
    console.error('Wishlist error:', e);
    return { success: false, error: e.message };
  }
};

// --- Orders ---
export const saveOrder = async (orderData) => {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  try {
    const orderId = `LM-${Math.floor(1000 + Math.random() * 9000)}`;

    const { error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      user_id: user.id,
      status: orderData.status,
      total: orderData.total,
      payment_method: orderData.paymentMethod,
      shipping_address: orderData.shippingAddress,
    });

    if (orderError) throw orderError;

    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*, products(price)')
      .eq('user_id', user.id);

    if (cartError) throw cartError;

    if (cartItems && cartItems.length > 0) {
      const orderItems = cartItems.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products?.price ?? 0,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;
    }

    await clearCart();
    window.dispatchEvent(new Event('orders-updated'));
    return orderId;
  } catch (e) {
    console.error('Save order error:', e);
    return null;
  }
};

export const fetchOrders = async () => {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapOrderRow);
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const fetchAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapOrderRow);
  } catch (e) {
    console.error(e);
    return [];
  }
};

// --- Admin / Customers ---
export const fetchCustomers = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error || !data) return [];
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

// --- Contact Enquiries ---
export const submitContact = async (formData) => {
  try {
    await supabase.from('contact_messages').insert(formData);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: e.message };
  }
};
