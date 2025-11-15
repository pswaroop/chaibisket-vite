"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart, Clock as ClockIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// Menu items with categories and time availability
const menuItems = [
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

// Menu timings
const menuTimings = [
  {
    id: "breakfast",
    name: "BREAKFAST MENU",
    time: "8:00 AM - 11:30 AM",
  },
  {
    id: "lunch",
    name: "LUNCH MENU",
    time: "11:00 AM - 4:00 PM",
  },
  {
    id: "snacks",
    name: "SNACKS",
    time: "3:00 PM - 6:30 PM",
  },
  {
    id: "dinner",
    name: "DINNER MENU",
    time: "6:30 PM - 10:30 PM",
  },
];

const Menu = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeMenu, setActiveMenu] = useState("breakfast");
  const [showAllItems, setShowAllItems] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Set up client-side only code
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Determine current menu based on time
  useEffect(() => {
    if (!currentTime) return;

    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Define menu time ranges in minutes since midnight
    const menuRanges = [
      { id: "breakfast", start: 8 * 60, end: 11.5 * 60 },
      { id: "lunch", start: 11 * 60, end: 16 * 60 },
      { id: "snacks", start: 15 * 60, end: 18.5 * 60 },
      { id: "dinner", start: 18.5 * 60, end: 22.5 * 60 },
    ];

    const currentMenu = menuRanges.find(
      (menu) => totalMinutes >= menu.start && totalMinutes < menu.end
    );

    if (currentMenu) {
      setActiveMenu(currentMenu.id);
    }
  }, [currentTime]);

  // Get unique categories for the active menu
  const categories = [
    "All",
    ...new Set(
      menuItems
        .filter((item) => item.availableTime.includes(activeMenu))
        .map((item) => item.category)
    ),
  ];

  if (!isClient) {
    return (
      <section id="menu" className="py-16 bg-white/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-6"></div>
              <div className="h-12 w-64 bg-gray-200 rounded mx-auto mb-8"></div>
              <div className="h-1 w-20 bg-gray-200 rounded mx-auto mb-12"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Filter items by active category and menu time
  const filteredItems = (() => {
    // If showAllItems is true, only filter by category if one is selected
    if (showAllItems) {
      return activeCategory === "All"
        ? [...menuItems] // Return all items if no category selected
        : menuItems.filter((item) => item.category === activeCategory);
    }

    // Otherwise, filter by both category and time
    return activeCategory === "All"
      ? menuItems.filter((item) => item.availableTime.includes(activeMenu))
      : menuItems.filter(
          (item) =>
            item.category === activeCategory &&
            item.availableTime.includes(activeMenu)
        );
  })();

  const addToCart = (itemId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === itemId);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prevCart, { id: itemId, quantity: 1 }];
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newCart));
      }

      return newCart;
    });
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    const [start, end] = timeString.split(" - ");
    return (
      <div className="text-xs text-gray-500 mt-1">
        <span className="font-medium">{start}</span> - {end}
      </div>
    );
  };

  return (
    <section id="menu" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center bg-rose-100 text-rose-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <ClockIcon className="h-3.5 w-3.5 mr-1.5 -mt-0.5" />
            {currentTime?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
            Our Menu
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-rose-500 to-amber-500 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our carefully crafted selection of authentic Indian
            cuisine, prepared with the finest ingredients and traditional
            recipes.
          </p>
        </div>

        {/* Menu Navigation */}
        <div className="mb-16">
          <div
            className={`flex flex-wrap justify-center gap-3 mb-6 transition-opacity duration-300 ${
              showAllItems ? "opacity-50" : "opacity-100"
            }`}
          >
            {menuTimings.map(
              (menu) =>
                !showAllItems && (
                  <button
                    key={menu.id}
                    onClick={() => setActiveMenu(menu.id)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center min-w-[140px] ${
                      activeMenu === menu.id
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-100"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <span className="font-semibold text-base">{menu.name}</span>
                    <span className="block text-xs font-normal opacity-80 mt-1">
                      {menu.time}
                    </span>
                  </button>
                )
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => {
                setShowAllItems(!showAllItems);
                // Reset to 'All' category when toggling showAllItems
                if (!showAllItems) setActiveCategory("All");
              }}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                showAllItems
                  ? "bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {showAllItems ? (
                <React.Fragment>
                  <span>Viewing All Items</span>
                  <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                    All Day
                  </span>
                </React.Fragment>
              ) : (
                "View All Menu Items"
              )}
            </button>

            {categories
              .filter((cat) => cat !== "All")
              .map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setShowAllItems(false);
                  }}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === category && !showAllItems
                      ? "bg-rose-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-rose-50 flex flex-col h-full"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority={item.id <= 3}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {item.name}
                        </h3>
                        <div className="flex items-center">
                          <span className="text-amber-300 font-medium text-lg">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="mx-3 text-white/30">•</span>
                          <div className="flex flex-wrap gap-1">
                            {item.availableTime.map((time) => (
                              <span
                                key={time}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white/90 backdrop-blur-sm"
                              >
                                {time.charAt(0).toUpperCase() + time.slice(1)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-auto">
                    <Button
                      onClick={() => addToCart(item.id)}
                      className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-medium py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add to Order
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500 mb-4">
              No items available in this category for the selected time.
            </p>
            <Button
              onClick={() => setActiveCategory("All")}
              variant="outline"
              className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
            >
              View All Menu Items
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Hungry for more?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Explore our full menu to discover more delicious options for any
              time of day.
            </p>
            <Button
              onClick={() => router.push("/cart")}
              className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-medium px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              View Cart & Checkout
              {getCartCount() > 0 && (
                <span className="ml-2 bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {getCartCount()} {getCartCount() === 1 ? "item" : "items"}
                </span>
              )}
            </Button>
            <p className="mt-3 text-xs text-gray-400">
              Menu items availability may vary by time of day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
