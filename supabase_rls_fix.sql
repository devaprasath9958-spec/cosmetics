-- ============================================================
-- LUME — Supabase RLS Policy Fix (Full Admin CRUD)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ========================
-- cart_items
-- ========================
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can insert own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can update own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can delete own cart" ON cart_items;

CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- ========================
-- wishlist
-- ========================
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can insert own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can delete own wishlist" ON wishlist;

CREATE POLICY "Users can view own wishlist"
  ON wishlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist"
  ON wishlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist"
  ON wishlist FOR DELETE
  USING (auth.uid() = user_id);

-- ========================
-- orders
-- ========================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Admin can manage orders" ON orders;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin: allow anon to read/update/delete all orders (admin panel)
CREATE POLICY "Admin can manage orders"
  ON orders FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================
-- order_items
-- ========================
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;
DROP POLICY IF EXISTS "Admin can manage order items" ON order_items;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage order items"
  ON order_items FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================
-- reviews (public read, auth write, admin manage)
-- ========================
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Admin can manage reviews" ON reviews;

CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage reviews"
  ON reviews FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================
-- products (public read, admin full CRUD)
-- ========================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;

CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage products"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================
-- categories (public read, admin full CRUD)
-- ========================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read categories" ON categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON categories;

CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================
-- brands (public read, admin full CRUD)
-- ========================
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read brands" ON brands;
DROP POLICY IF EXISTS "Admin can manage brands" ON brands;

CREATE POLICY "Anyone can read brands"
  ON brands FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage brands"
  ON brands FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================
-- offers (public read, admin full CRUD)
-- ========================
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read offers" ON offers;
DROP POLICY IF EXISTS "Admin can manage offers" ON offers;

CREATE POLICY "Anyone can read offers"
  ON offers FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage offers"
  ON offers FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================
-- collections (public read, admin full CRUD)
-- ========================
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read collections" ON collections;
DROP POLICY IF EXISTS "Admin can manage collections" ON collections;

CREATE POLICY "Anyone can read collections"
  ON collections FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage collections"
  ON collections FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================
-- blog_posts (public read, admin full CRUD)
-- ========================
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can manage blog_posts" ON blog_posts;

CREATE POLICY "Anyone can read blog_posts"
  ON blog_posts FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage blog_posts"
  ON blog_posts FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================
-- newsletter_subscribers (admin manage)
-- ========================
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admin can manage newsletter" ON newsletter_subscribers;

CREATE POLICY "Anyone can subscribe newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can manage newsletter"
  ON newsletter_subscribers FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================
-- contact_messages (insert for anyone, admin reads)
-- ========================
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact" ON contact_messages;
DROP POLICY IF EXISTS "Admin can manage contact messages" ON contact_messages;

CREATE POLICY "Anyone can submit contact"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can manage contact messages"
  ON contact_messages FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================
-- profiles (auth-managed, admin can read/update)
-- ========================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can manage profiles" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin can manage profiles"
  ON profiles FOR ALL
  USING (true)
  WITH CHECK (true);
