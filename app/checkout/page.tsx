"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  CreditCard,
  MapPin,
  User,
} from "lucide-react";

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

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Form states
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    deliveryInstructions: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  // Initialize cart from localStorage
  useEffect(() => {
    setIsClient(true);

    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      // User not logged in, redirect to login
      router.push("/login?returnUrl=/checkout");
      return;
    }

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);

        // If cart is empty, redirect to cart page
        if (parsedCart.length === 0) {
          router.push("/cart");
        }
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
        setCart([]);
        router.push("/cart");
      }
    } else {
      // If no cart exists, redirect to menu
      router.push("/");
    }

    // Load user info
    if (user) {
      try {
        const userData = JSON.parse(user);
        setDeliveryInfo((prev) => ({
          ...prev,
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          city: userData.city || "",
          state: userData.state || "",
          zipCode: userData.zipCode || "",
        }));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, [router]);

  // Find menu item by ID
  const getMenuItem = (id: number) => {
    return menuItems.find((item) => item.id === id);
  };

  // Calculate total
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const menuItem = getMenuItem(item.id);
      return total + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  const calculateDeliveryFee = () => {
    return 2.99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateDeliveryFee();
  };

  // Handle form changes
  const handleDeliveryInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle place order
  const handlePlaceOrder = () => {
    // Get user info
    const user = localStorage.getItem("user");
    let userEmail = "";
    if (user) {
      try {
        const userData = JSON.parse(user);
        userEmail = userData.email || "";
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }

    // Create order object
    const orderItems = cart.map((item) => {
      const menuItem = getMenuItem(item.id);
      return {
        id: item.id,
        name: menuItem?.name || "",
        price: menuItem?.price || 0,
        quantity: item.quantity,
      };
    });

    const order = {
      orderId: `ORD-${Date.now()}`,
      userEmail: userEmail || deliveryInfo.email,
      orderDate: new Date().toLocaleString(),
      items: orderItems,
      deliveryInfo: deliveryInfo,
      paymentMethod: "Cash on Delivery",
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      deliveryFee: calculateDeliveryFee(),
      total: calculateTotal(),
      status: "Pending",
      deliveryAddress: `${deliveryInfo.address}, ${deliveryInfo.city}, ${deliveryInfo.state} ${deliveryInfo.zipCode}`,
    };

    // Save order to localStorage
    try {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Update user loyalty points (1 point per dollar)
      if (user) {
        try {
          const userData = JSON.parse(user);
          const pointsEarned = Math.floor(calculateSubtotal());
          const updatedUser = {
            ...userData,
            loyaltyPoints: (userData.loyaltyPoints || 0) + pointsEarned,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          // Update users array
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          const userIndex = users.findIndex(
            (u: any) => u.email === userData.email
          );
          if (userIndex !== -1) {
            users[userIndex].loyaltyPoints = updatedUser.loyaltyPoints;
            localStorage.setItem("users", JSON.stringify(users));
          }
        } catch (e) {
          console.error("Failed to update loyalty points", e);
        }
      }
    } catch (e) {
      console.error("Failed to save order", e);
    }

    // Clear cart
    localStorage.removeItem("cart");

    // Show success message
    setOrderPlaced(true);

    // Redirect to order confirmation after 3 seconds
    setTimeout(() => {
      router.push("/profile?tab=orders");
    }, 3000);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We've sent a confirmation email to your
              inbox.
            </p>
            <p className="text-gray-500 text-sm">Redirecting to homepage...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 border-rose-200 text-rose-700 hover:bg-rose-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Checkout
        </h1>
        <p className="text-gray-600 mb-8">Complete your order</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activeStep === step
                          ? "bg-rose-600 text-white"
                          : activeStep > step
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {activeStep > step ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      ) : (
                        step
                      )}
                    </div>
                    <div className="ml-2">
                      <div
                        className={`text-sm font-medium ${
                          activeStep === step
                            ? "text-rose-600"
                            : activeStep > step
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step === 1
                          ? "Delivery"
                          : step === 2
                          ? "Payment"
                          : "Confirm"}
                      </div>
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-16 h-0.5 mx-4 ${
                          activeStep > step ? "bg-green-200" : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Delivery Information */}
              {activeStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-rose-600" />
                    Delivery Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={deliveryInfo.name}
                        onChange={handleDeliveryInfoChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={deliveryInfo.email}
                        onChange={handleDeliveryInfoChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={deliveryInfo.phone}
                        onChange={handleDeliveryInfoChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={deliveryInfo.address}
                        onChange={handleDeliveryInfoChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
                        placeholder="123 Main St"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={deliveryInfo.city}
                        onChange={handleDeliveryInfoChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={deliveryInfo.state}
                        onChange={handleDeliveryInfoChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="zipCode"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={deliveryInfo.zipCode}
                        onChange={handleDeliveryInfoChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="deliveryInstructions"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      id="deliveryInstructions"
                      name="deliveryInstructions"
                      value={deliveryInfo.deliveryInstructions}
                      onChange={handleDeliveryInfoChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
                      placeholder="Leave at front door, ring bell, etc."
                    ></textarea>
                  </div>

                  <Button
                    onClick={() => setActiveStep(2)}
                    className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-medium py-3 rounded-xl"
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}

              {/* Step 2: Payment Information (Cash Only) */}
              {activeStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-rose-600" />
                    Payment Method
                  </h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-blue-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Cash Payment
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            You will pay with cash upon delivery. Please have
                            the exact amount ready.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setActiveStep(1)}
                      className="flex-1 border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setActiveStep(3)}
                      className="flex-1 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-medium py-3 rounded-xl"
                    >
                      Review Order
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Order Review */}
              {activeStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-rose-600" />
                    Review Your Order
                  </h2>

                  <div className="border border-gray-200 rounded-xl p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Delivery Information
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p>{deliveryInfo.name}</p>
                      <p>{deliveryInfo.email}</p>
                      <p>{deliveryInfo.phone}</p>
                      <p>
                        {deliveryInfo.address}, {deliveryInfo.city},{" "}
                        {deliveryInfo.state} {deliveryInfo.zipCode}
                      </p>
                      {deliveryInfo.deliveryInstructions && (
                        <p className="mt-2">
                          <span className="font-medium">Instructions:</span>{" "}
                          {deliveryInfo.deliveryInstructions}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Payment Method
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p>Cash Payment</p>
                      <p className="mt-1">Pay with cash upon delivery</p>
                    </div>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-medium py-3 rounded-xl"
                  >
                    Place Order - ${calculateTotal().toFixed(2)}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setActiveStep(2)}
                    className="w-full mt-3 border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    Back to Payment
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => {
                  const menuItem = getMenuItem(item.id);
                  if (!menuItem) return null;

                  return (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {menuItem.name}{" "}
                          <span className="text-gray-500">
                            x{item.quantity}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {menuItem.description}
                        </div>
                      </div>
                      <div className="font-medium">
                        ${(menuItem.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      ${calculateTax().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium">
                      ${calculateDeliveryFee().toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
