"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Plus, Minus, X } from "lucide-react";

// Define types
type CartItem = {
  id: number;
  quantity: number;
};

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  availableTime: string[];
};

// Menu items data (same as in Menu component)
const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Masala Chai",
    price: 3.49,
    description: "Slow-brewed, aromatic, soul-warming.",
    image: "/images/iran chaai.png",
    category: "Beverages",
    availableTime: ["breakfast", "lunch", "dinner"],
  },
  {
    id: 2,
    name: "Osmania Biscuits",
    price: 4.99,
    description: "Crisp, buttery, perfect with chai.",
    image: "/images/osimania biskets.png",
    category: "Snacks",
    availableTime: ["breakfast", "snacks"],
  },
  {
    id: 3,
    name: "Hyderabadi Biryani",
    price: 14.99,
    description: "Long-grain basmati, rich masala, royal aroma.",
    image: "/images/Hyderabadi Biryani.jpg",
    category: "Main Course",
    availableTime: ["lunch", "dinner"],
  },
  {
    id: 4,
    name: "Bun Maska",
    price: 5.99,
    description: "Pillow-soft bun, lashings of butter.",
    image: "/images/Bun Maska.jpg",
    category: "Snacks",
    availableTime: ["breakfast", "snacks"],
  },
  {
    id: 5,
    name: "Vada Pav",
    price: 6.99,
    description: "Mumbai's favorite — fiery & fun.",
    image: "/images/Vada Pav.jpg",
    category: "Street Food",
    availableTime: ["lunch", "dinner"],
  },
  {
    id: 6,
    name: "Chicken 65",
    price: 12.99,
    description: "Crispy, tangy, dangerously addictive.",
    image: "/images/Chicken 65.jpg",
    category: "Appetizers",
    availableTime: ["lunch", "dinner"],
  },
];

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Initialize cart from localStorage
  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
        setCart([]);
      }
    }
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isClient]);

  // Find menu item by ID
  const getMenuItem = (id: number) => {
    return menuItems.find((item) => item.id === id);
  };

  // Update item quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const menuItem = getMenuItem(item.id);
      return total + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);
  };

  // Handle checkout
  const handleCheckout = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("user");

    if (isLoggedIn) {
      // User is logged in, proceed to checkout
      router.push("/checkout");
    } else {
      // User is not logged in, redirect to login with return URL
      router.push("/login?returnUrl=/checkout");
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 border-rose-200 text-rose-700 hover:bg-rose-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Your Cart
        </h1>
        <p className="text-gray-600 mb-8">Review your items before checkout</p>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => {
                    const menuItem = getMenuItem(item.id);
                    if (!menuItem) return null;

                    return (
                      <div
                        key={item.id}
                        className="p-6 flex flex-col sm:flex-row gap-4"
                      >
                        <div className="relative w-full sm:w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={menuItem.image}
                            alt={menuItem.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {menuItem.name}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {menuItem.description}
                              </p>
                            </div>
                            <Button
                              variant="secondary"
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <Button
                                variant="secondary"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="px-3 py-1 text-gray-900">
                                {item.quantity}
                              </span>
                              <Button
                                variant="secondary"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="font-semibold text-gray-900">
                              ${(menuItem.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      ${(calculateTotal() * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium">$2.99</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${(calculateTotal() * 1.08 + 2.99).toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-medium py-3 rounded-xl"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full mt-3 border-rose-200 text-rose-700 hover:bg-rose-50"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
