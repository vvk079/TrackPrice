import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogIn, Rabbit, Shield, Bell, TrendingDown } from "lucide-react";
import AddProductForm from "@/components/ui/AddProductForm";
import AuthButton from "@/components/ui/AuthButton";
import { createClient } from "@/utills/SupaBase/Server";
import { getProducts } from "./Action";
import ProductCard from "@/components/ui/ProductCard";




export default async function Home() {

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser();


  const products = user ? await getProducts() : [];




  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",
    },
  ];
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-pink-500/30">
      <header className="bg-background/60 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-center">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
              <Image src="/image.png" alt="logo"
                width={40}
                height={40}
                className="h-8 w-auto invert dark:invert-0"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">
              TrackPrice
            </span>
          </div>

          <AuthButton user={user} />
        </div>
      </header>

      <section className="relative py-24 px-6 overflow-hidden">
        {/* Abstract Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50" />

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]">
            Track Prices <br />
            <span className="bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Never pay full price again. Monitor thousands of products across all major e-commerce sites with smart instant alerts.
          </p>

          <AddProductForm user={user} />

          {products.length === 0 && (
            <div className="grid md:grid-cols-3 gap-8 mt-24">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group relative bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-primary/10"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {user && products.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Your Tracking List</h2>
              <p className="text-muted-foreground text-sm mt-1">Manage your active product monitors</p>
            </div>
            <div className="px-4 py-2 bg-secondary rounded-full border border-border">
              <span className="text-sm font-semibold">
                {products.length} {products.length === 1 ? "Product" : "Products"}
              </span>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 items-start">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {user && products.length === 0 && (
        <section className="max-w-2xl mx-auto pb-24 px-6 text-center" >
          <div className="bg-card/50 rounded-3xl border-2 border-dashed border-border p-16 backdrop-blur-sm">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingDown className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">No Products Tracked</h3>
            <p className="text-muted-foreground mb-8 text-lg">Your watchlist is currently empty. Add your first product URL above to start saving.</p>
            <Button size="lg" variant="secondary" className="px-10 h-14 rounded-full font-bold shadow-xl shadow-primary/10">
              Get Started
            </Button>
          </div>
        </section>
      )}

      <footer className="py-12 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">© 2024 TrackPrice. Built for shoppers who love a good deal.</p>
        </div>
      </footer>
    </main>
  );
}
