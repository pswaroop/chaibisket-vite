
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Phone, Instagram, Utensils, Leaf, Coffee, Sandwich, Sprout, ShoppingCart } from "lucide-react";
import Menu from "@/components/Menu";
import Image from "next/image";

/**
 * Chai Bisket — Single‑file Landing Page
 * Tech: Next.js + Tailwind + local UI + Framer Motion
 */

const heroBg = `
  radial-gradient(1200px 600px at 10% -10%, rgba(255, 214, 153, 0.35), transparent 60%),
  radial-gradient(1000px 500px at 90% 0%, rgba(189, 255, 200, 0.30), transparent 60%),
  linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.75))
`;

const bananaLeafSvg = (
  <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="leafs" width="200" height="200" patternUnits="userSpaceOnUse">
        <path d="M20,100 C60,20 140,20 180,100 C140,180 60,180 20,100 Z" fill="none" stroke="#3BAA6B" strokeWidth="1.2" />
        <path d="M20,100 C60,60 140,60 180,100" fill="none" stroke="#74C69D" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#leafs)" />
  </svg>
);

const Section = ({ id, children, className = "" }: { id?: string, children: React.ReactNode, className?: string }) => (
  <section id={id} className={`relative py-16 md:py-24 ${className}`}>{children}</section>
);

const Container = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

// Local inline SVG artwork (data URIs) so no external requests are needed
const toDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
const art = {
  heroChai: toDataUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 900'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#fde68a' offset='0'/><stop stop-color='#a7f3d0' offset='1'/></linearGradient></defs>
    <rect fill='url(#g)' width='1200' height='900'/>
    <g fill='none' stroke='#059669' stroke-width='14'><rect x='280' y='240' rx='32' width='480' height='340'/><path d='M760 320 h80 a80 80 0 0 1 0 160 h-80'/></g>
    <g stroke='#10b981' stroke-width='6'><path d='M420 220 c40 -60 40 -60 0 -120'/><path d='M500 220 c40 -60 40 -60 0 -120'/><path d='M580 220 c40 -60 40 -60 0 -120'/></g>
    <text x='60' y='840' font-family='sans-serif' font-size='48' fill='#065f46'>Masala Chai</text>
  </svg>`),
  thumb1: toDataUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><rect width='800' height='600' fill='#fff7ed'/><circle cx='400' cy='320' r='180' fill='#fde68a' stroke='#f59e0b' stroke-width='10'/><ellipse cx='400' cy='360' rx='220' ry='60' fill='none' stroke='#16a34a' stroke-width='8'/></svg>`),
  thumb2: toDataUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><rect width='800' height='600' fill='#ecfeff'/><path d='M160 380 q240 -220 480 0' fill='#fcd34d' stroke='#f59e0b' stroke-width='10'/><path d='M160 380 q240 120 480 0' fill='#16a34a' opacity='0.25'/></svg>`),
  thumb3: toDataUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><rect width='800' height='600' fill='#f0fdf4'/><rect x='220' y='260' width='360' height='120' rx='60' fill='#fff' stroke='#10b981' stroke-width='8'/></svg>`),
  // Local images for menu items (Next.js public folder)
  iraniChai: "/images/iran%20chaai.png",
  biscuits: "/images/osimania%20biskets.png",
  biryani: "/images/Hyderabadi%20Biryani.jpg",
  bunMaska: "/images/Bun%20Maska.jpg",
  vadaPav: "/images/Vada%20Pav.jpg",
  chicken65: "/images/Chicken%2065.jpg",
  monuments: toDataUri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 900'><rect width='1200' height='900' fill='#ecfeff'/><path d='M160 700 h240 v-200 h-240 z' fill='#a7f3d0'/><path d='M520 700 h200 v-240 l-100 -80 -100 80 z' fill='#fef3c7'/><path d='M820 700 h220 v-160 h-220 z' fill='#fde68a'/></svg>`),
  gallery: [
    "/images/iran chaai.png",
    "/images/osimania biskets.png",
    "/images/Hyderabadi Biryani.jpg",
    "/images/Bun Maska.jpg",
    "/images/Vada Pav.jpg",
    "/images/Chicken 65.jpg",
    "/images/iran chaai.png",
    "/images/osimania biskets.png",
  ],
};

const Placeholder = ({ label = "Image" }: { label?: string }) => (
  <div className="w-full h-full grid place-items-center bg-gradient-to-br from-emerald-100 via-amber-100 to-white text-emerald-900">
    <div className="text-center p-4">
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-2xl font-extrabold">Chai Bisket</div>
    </div>
  </div>
);

const SafeImage = ({ src, alt, className = "", label }: { src: string, alt?: string, className?: string, label?: string }) => {
  const [broken, setBroken] = React.useState(false);
  return (
    <div className={className}>
      {!broken ? (
        <img
          src={src}
          alt={alt || ""}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => {
            console.error(`Image failed to load: ${src}`);
            setBroken(true);
          }}
        />
      ) : (
        <Placeholder label={label || alt} />
      )}
    </div>
  );
};
// --- Robust ContactForm (paste above the default export in app/page.tsx) ---
function ContactForm() {
  const [status, setStatus] = React.useState<"idle"|"sending"|"ok"|"error">("idle");
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      message: String(fd.get("message") || ""),
    };

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = {};
      try { data = await res.json(); } catch { /* ignore parse errors */ }

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      setStatus("ok");
      formEl.reset(); // clear fields on success
    } catch (err: any) {
      setErrorMsg(err?.message || "Unknown error");
      setStatus("error");
    }
  };

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <input name="name" className="border border-rose-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="Your name" required />
      <input name="email" type="email" className="border border-rose-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="Email address" required />
      <input name="phone" className="border border-rose-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="Phone number (optional)" />
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <textarea name="message" rows={4} className="border border-rose-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300" placeholder="Tell us about your event or question (e.g., party size, date, special requests)" required />
      <Button className="bg-rose-700 hover:bg-rose-800" type="submit" disabled={status==="sending"}>
        {status==="sending" ? "Sending..." : "Send Message"}
      </Button>
      {status==="ok" && <div className="text-sm text-rose-700 font-medium">Thanks! We’ve received your message and will get back to you shortly.</div>}
      {status==="error" && <div className="text-sm text-red-600">Something went wrong. Please try again. {errorMsg && <span className="opacity-70">({errorMsg})</span>}</div>}
    </form>
  );
}


export default function Page() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // Get cart count from localStorage
  const getCartCount = () => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          return cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);
        } catch (e) {
          return 0;
        }
      }
    }
    return 0;
  };

  // Check login status
  const checkLoginStatus = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          setIsLoggedIn(true);
          setUserName(userData.name || '');
        } catch (e) {
          setIsLoggedIn(false);
          setUserName('');
        }
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    }
  };

  // Update cart count and login status on component mount and when localStorage changes
  useEffect(() => {
    setCartCount(getCartCount());
    checkLoginStatus();
    
    // Listen for storage changes (in case cart is updated in another tab)
    const handleStorageChange = () => {
      setCartCount(getCartCount());
      checkLoginStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes periodically
    const interval = setInterval(() => {
      setCartCount(getCartCount());
      checkLoginStatus();
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 text-slate-800">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-amber-100">
        <Container className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-rose-600 grid place-items-center text-white font-bold">CB</div>
            <div>
              <div className="text-lg font-semibold tracking-tight">Chai Bisket LLC</div>
              <div className="text-[12px] text-slate-500">an Indian eatery</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#menu" className="hover:text-rose-700">Menu</a>
            <a href="#story" className="hover:text-rose-700">Our Story</a>
            <a href="#location" className="hover:text-rose-700">Location & Hours</a>
            <a href="#gallery" className="hover:text-rose-700">Gallery</a>
            <a href="#contact" className="hover:text-rose-700">Contact</a>
            <a href="/profile" className="hover:text-rose-700">Profile</a>
            <a href="/cart" className="hover:text-rose-700 flex items-center gap-1">
              <ShoppingCart className="h-4 w-4" />
              View Cart {cartCount > 0 && `(${cartCount})`}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-slate-600 hidden md:block">Welcome, {userName}</span>
                <Button variant="outline" asChild className="border-rose-600 text-rose-700 hover:bg-rose-50">
                  <a href="/profile">Profile</a>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-rose-600 text-rose-700 hover:bg-rose-50"
                  onClick={() => {
                    localStorage.removeItem('user');
                    setIsLoggedIn(false);
                    setUserName('');
                    window.location.href = '/';
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="border-rose-600 text-rose-700 hover:bg-rose-50">
                  <a href="/signup">Sign Up</a>
                </Button>
                <Button variant="outline" asChild className="border-rose-600 text-rose-700 hover:bg-rose-50">
                  <a href="/login">Login</a>
                </Button>
              </>
            )}
          </div>
        </Container>
      </header>

      {/* HERO */}
      <Section id="home" className="relative overflow-hidden pt-20 md:pt-24 lg:pt-32 min-h-[90vh] flex items-center">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-amber-50 opacity-90"></div>
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                radial-gradient(at 10% 10%, #fbcfe8 0px, transparent 50%),
                radial-gradient(at 90% 20%, #fde68a 0px, transparent 50%),
                radial-gradient(at 30% 80%, #c7d2fe 0px, transparent 50%)
              `,
              animation: 'gradient 15s ease infinite',
              backgroundSize: '200% 200%',
            }}
          ></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-amber-400"
              style={{
                width: Math.random() * 10 + 5 + 'px',
                height: Math.random() * 10 + 5 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>

        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10"
            >
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-rose-800 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6 border border-amber-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                </span>
                Now serving in Cumming, GA
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                Biryani is an{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-rose-700">emotion</span>
                  <span className="absolute -bottom-1 left-0 w-full h-3 bg-rose-100/70 -z-0 transform -rotate-1"></span>
                </span>
                ,<br />
                chai is for{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-violet-700">mood</span>
                  <span className="absolute -bottom-1 left-0 w-full h-3 bg-violet-100/70 -z-0 transform rotate-1"></span>
                </span>
                .
              </h1>

              <p className="mt-6 text-lg md:text-xl text-slate-700 max-w-xl leading-relaxed">
                From crispy samosas to soul-warming Irani chai, we bring the authentic flavors of India's street food scene to your table. Every bite tells a story of tradition and taste.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white py-6 px-8 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  size="lg"
                  asChild
                >
                  <a href="#menu" className="flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    Explore Our Menu
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-violet-500 text-violet-700 hover:bg-violet-50 py-6 px-8 text-base font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1"
                  size="lg"
                  asChild
                >
                  <a href="#contact" className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Order Now
                  </a>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm border border-amber-100">
                  <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                  <span>Freshly brewed chai</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm border border-amber-100">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <span>Daily specials</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm border border-amber-100">
                  <div className="h-2 w-2 rounded-full bg-violet-500"></div>
                  <span>Vegetarian options</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/images/iran chaai.png"
                  alt="Irani Chai"
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -right-6 z-0 w-64 h-64 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -top-6 -left-6 z-0 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </motion.div>
          </div>
        </Container>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-slate-400 rounded-full animate-scroll"></div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0) rotate(0deg); }
          }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          @keyframes scroll {
            0% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(10px); opacity: 0.5; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-scroll {
            animation: scroll 2s infinite;
          }
        `}</style>
      </Section>

      {/* MARQUEE */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-transparent to-white"/>
        <div className="whitespace-nowrap animate-[marquee_30s_linear_infinite] py-3 text-sm font-medium text-emerald-800">
          <span className="mx-8">Irani Chai</span>
          <span className="mx-8">Osmania Biscuits</span>
          <span className="mx-8">Hyderabadi Biryani</span>
          <span className="mx-8">Samosa & Cutlets</span>
          <span className="mx-8">Bun Maska</span>
          <span className="mx-8">Vada Pav</span>
          <span className="mx-8">Chicken 65</span>
          <span className="mx-8">Kulfi & Falooda</span>
        </div>
      </div>

      {/* MENU SECTION */}
      <Section id="menu" className="py-16 bg-white/70">
        <Menu />
      </Section>

      {/* STORY */}
      <Section id="story" className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-rose-50 to-amber-50">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-1/4 -right-20 w-64 h-64 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/2 -left-20 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
        
        <Container>
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-rose-700 text-sm font-semibold tracking-wider uppercase mb-2">
                Our Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Story</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-rose-600 mx-auto"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative z-10 bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-rose-50">
                  <p className="text-lg leading-relaxed text-gray-700 mb-8 relative">
                    <span className="absolute -left-6 -top-4 text-6xl text-rose-200 font-serif">"</span>
                    Born from Hyderabadi passion and Indian street‑food nostalgia, Chai Bisket blends the warmth of 
                    traditional <em className="font-medium text-rose-700">chai addas</em> with a fresh, contemporary vibe. 
                    Think banana leaves, coastal breezes, and the timeless silhouettes of Charminar, Gateway of India, 
                    and the Taj — all on your plate, in your city.
                    <span className="text-rose-200 font-serif text-6xl absolute -right-4 -bottom-8">"</span>
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { 
                        icon: <Leaf className="h-5 w-5 text-rose-700" />,
                        text: 'House‑blend masalas'
                      },
                      { 
                        icon: <Sprout className="h-5 w-5 text-rose-700" />,
                        text: 'Fresh, local ingredients'
                      },
                      { 
                        icon: <Utensils className="h-5 w-5 text-rose-700" />,
                        text: 'Vegetarian & non‑veg'
                      },
                      { 
                        icon: <Coffee className="h-5 w-5 text-rose-700" />,
                        text: 'Chai & biscuit pairings'
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-rose-100 hover:shadow-md transition-all hover:border-rose-200">
                        <div className="p-2 bg-rose-50 rounded-lg">
                          {item.icon}
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-rose-100 rounded-full"></div>
              </motion.div>

              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                  <Image
                    src="/images/iran chaai.png"
                    alt="Chai Bisket experience"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-amber-100 shadow-lg">
                      <div className="text-xl font-bold text-rose-800">"Mass & class — same glass."</div>
                      <div className="text-sm text-rose-600 mt-1">— Hyderabadi proverb (our vibe)</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-100 rounded-full -z-10"></div>
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>
      {/* LOCATION & HOURS */}
      <Section id="location" className="bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            <Card className="rounded-3xl border-rose-100">
              <CardHeader>
                <CardTitle className="text-2xl">Visit Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-rose-700 mt-1" />
                  <div>
                    <div className="font-medium">911 Market Pl Blvd, Suite L</div>
                    <div>Cumming, GA 30041</div>
                    <a 
                      href="https://www.google.com/maps/dir//911+Market+Pl+Blvd+%23L,+Cumming,+GA+30041" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-rose-700 hover:underline text-sm inline-flex items-center gap-1 mt-1"
                    >
                      <span>Get Directions</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-rose-700 mt-1" />
                  <div>
                    <div className="font-medium">Hours</div>
                    <div>Mon–Thu: 11:00 AM – 9:30 PM</div>
                    <div>Fri–Sat: 11:00 AM – 10:30 PM</div>
                    <div>Sun: 11:00 AM – 9:00 PM</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-rose-700 mt-1" />
                  <div>
                    <div className="font-medium">Call Us</div>
                    <a href="tel:+17705550123" className="hover:underline">(770) 555-0123</a>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button className="bg-rose-700 hover:bg-rose-800">
                    <a href="#menu">View Menu</a>
                  </Button>
                  <Button variant="outline" className="border-rose-200 hover:bg-rose-50">
                    <a href="#contact">Catering Inquiries</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="rounded-3xl overflow-hidden shadow-xl h-full">
              <div className="relative h-full min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.125603227977!2d-84.2151689243235!3d34.18057607322581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f59f6c9bafb7b9%3A0x8c5f6b6b6b6b6b6b6!2s911%20Market%20Pl%20Blvd%20%23L%2C%20Cumming%2C%20GA%2030041!5e0!3m2!1sen!2sus!4v1623456789012!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Chai Bisket Location"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* GALLERY */}
      <Section id="gallery" className="bg-amber-50/60">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Moments & Mood</h2>
            <p className="mt-3 text-slate-600">Swipe through the vibe — tag us <span className="font-semibold text-rose-700">@chaibisket_eats</span> on Instagram to get featured!</p>
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {art.gallery.map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-2xl">
                <SafeImage
                  src={src}
                  alt={`Chai Bisket gallery ${i+1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button variant="outline" className="border-slate-300">
              <a href="https://instagram.com/chaibisket_eats" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                <Instagram className="mr-2 h-4 w-4"/>Follow @chaibisket_eats
              </a>
            </Button>
          </div>
        </Container>
      </Section>

      {/* CONTACT / CATERING */}
      <Section id="contact" className="bg-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="rounded-3xl border-rose-100">
              <CardHeader>
                <CardTitle>Contact & Catering</CardTitle>
              </CardHeader>
              <CardContent>

                <ContactForm />
              </CardContent>
            </Card>
            <div className="bg-gradient-to-br from-rose-600 to-rose-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full"/>
              <h3 className="text-2xl font-semibold">Hosting a Party?</h3>
              <p className="mt-3 text-rose-50">From chai counters to biryani bars — we cater birthdays, office events, and desi celebrations.</p>
              <ul className="mt-4 space-y-2 text-rose-100 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> Customizable menus</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> Bulk chai, biscuits & snacks</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> On‑site live stations</li>
              </ul>
              <Button variant="secondary" className="mt-6 text-rose-900 bg-white hover:bg-rose-50">
                <a href="#contact">Get a Catering Quote</a>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* FOOTER */}
      <footer className="bg-emerald-950 text-emerald-50">
        <Container className="py-10 grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-semibold">Chai Bisket LLC</div>
            <div className="text-emerald-200 text-sm">an Indian eatery</div>
            <p className="mt-3 text-emerald-200 text-sm max-w-sm">
              Light, emotional, and full of passion & food — welcome to your new chai adda in Cumming.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-3">Quick Links</div>
            <ul className="space-y-2 text-emerald-200 text-sm">
              <li><a href="#menu" className="hover:text-white">Menu</a></li>
              <li><a href="#story" className="hover:text-white">Our Story</a></li>
              <li><a href="#location" className="hover:text-white">Location & Hours</a></li>
              <li><a href="#contact" className="hover:text-white">Catering</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Find Us</div>
            <div className="text-sm text-emerald-200 flex items-start gap-2"><MapPin className="h-4 w-4 mt-1"/> 911 Market Pl Blvd, Suite L, Cumming, GA 30041</div>
            <div className="text-sm text-emerald-200 mt-2">Phone: (770) 555‑0123</div>
            <a href="https://instagram.com/chaibisket_eats" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 text-emerald-100 hover:text-white">
              <Instagram className="h-4 w-4"/> Follow on Instagram
            </a>
          </div>
        </Container>
        <div className="border-t border-emerald-800">
          <Container className="py-4 text-xs text-emerald-300 flex flex-wrap items-center justify-between">
            <span>© {new Date().getFullYear()} Chai Bisket LLC. All rights reserved.</span>
            <span>Made with ❤ chai & biscuits.</span>
          </Container>
        </div>
      </footer>

      {/* KEYFRAMES */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}
