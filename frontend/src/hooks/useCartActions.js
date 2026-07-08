/**
 * useCartActions
 * Single, reusable hook for all Add-to-Cart operations across the app.
 *
 * Features:
 *  - Auth check via requireAuth (redirects to /login if not logged in)
 *  - Prevents adding during auth loading (avoids false "not logged in" redirects)
 *  - Gets the current user via supabase.auth.getUser() before each insert
 *  - Checks existing cart to prevent duplicates (increments qty instead)
 *  - Dispatches "cart-updated" window event so the Navbar badge refreshes
 *  - Shows success toast on add and error toast on failure
 *  - Per-product loading and added state
 */
import { useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { fetchCart, updateCartItem } from "../services/api.js";

export function useCartActions() {
  const { requireAuth, loading: authLoading, showToast } = useAuth();

  // Maps productId -> boolean
  const [addingMap, setAddingMap] = useState({});
  const [addedMap, setAddedMap] = useState({});

  /**
   * addToCart(product, quantity?)
   * @param {object} product  - Full product object (must have .id and .price)
   * @param {number} quantity - Units to add (defaults to 1)
   */
  const addToCart = useCallback(
    async (product, quantity = 1) => {
      if (!product?.id) return;

      // Do NOT call requireAuth while auth is still resolving — it would see
      // user=null and wrongly redirect to /login even for logged-in users.
      if (authLoading) {
        showToast("Still loading your session, please try again in a moment.");
        return;
      }

      if (!requireAuth("Please sign in to add items to your cart.")) return;

      const productId = product.id;
      setAddingMap((prev) => ({ ...prev, [productId]: true }));

      try {
        // Get the latest cart to check for duplicates
        const cart = await fetchCart();
        const existing = cart.find((item) => item.id === productId);
        const newQty = existing ? existing.qty + quantity : quantity;

        const result = await updateCartItem(product, newQty);

        if (result?.success === false) {
          console.error("[addToCart] Supabase error:", result.error);
          showToast(result.error || "Failed to add to cart. Please try again.");
          return;
        }

        // Fire the global event so Navbar badge & Cart page refresh
        window.dispatchEvent(new Event("cart-updated"));

        // Show success toast
        showToast(`${product.name || "Item"} added to cart!`);

        // Flip the "added" button state for 2 s
        setAddedMap((prev) => ({ ...prev, [productId]: true }));
        setTimeout(
          () => setAddedMap((prev) => ({ ...prev, [productId]: false })),
          2000
        );
      } catch (err) {
        console.error("[addToCart] Unexpected error:", err);
        showToast("Something went wrong. Please try again.");
      } finally {
        setAddingMap((prev) => ({ ...prev, [productId]: false }));
      }
    },
    [authLoading, requireAuth, showToast]
  );

  /** Helpers to read per-product state in JSX */
  const isAdding = (productId) => !!addingMap[productId];
  const isAdded = (productId) => !!addedMap[productId];

  return { addToCart, isAdding, isAdded };
}
