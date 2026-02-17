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


  const products = user ?   await getProducts() : []; 




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
    <main className="min-h-screen bg-linear-to-br from-pink-50 via-white 
    to-pink-50 ">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200
      sticky top-0 z-10">
        <div className=" max-w-7xl mx-auto px-4 py-4 flex justify-between iteams-center">
          <div className="flex items-center gap-3">
            <Image src="/image.png" alt="logo"
              width={600}
              height={200}
              className="h-10 w-auto"
            />
          </div>

          {/* auth button */}
          <AuthButton user={user} />



        </div>
      </header>

      <section className="py-20 px-4" >
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Never Miss a Price Drop Again</h3>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Track prices on thousands of products and get notified when they drop
          </p>


          {/* add product form */}
          <AddProductForm user={user} />
          {/* feature  */}
          {products.length === 0 && (
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                >
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Icon className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          )}

        </div>




      </section>

      {user && products.length>0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
             Your Tracked Products</h3>
            <span className="text-sm text-gray-500">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-start">
            {products.map((product)=>(
              <ProductCard key={product.id} product={product}/>
            ))}

          </div>
        
      </section>)}

      {user && products.length ===0 && (
        <section className="max-w-2xl mx-auto pb-20 px-4 text-center" >
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300
          p-12">
            <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
            <h3 className="text-xl font-semibold text-gray-900 
            mb-2">No Products Added</h3>
            <p className="text-gray-600 ">Add your first product to get started</p>
            <Button>Add Product</Button>

          </div>
          
        </section>
      )}

    </main>
  );
}
