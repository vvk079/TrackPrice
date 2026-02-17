
import { createClient } from "@/utills/SupaBase/Server"
import {NextResponse }from "next/server";
export async function GET(request){
    const {searchParams}= new URL(request.url) 

    const code = searchParams.get("code")

    if(code){
        const supabase =  await createClient()
        await supabase.auth.exchangeCodeForSession(code)    
    }

    return NextResponse.redirect(new URL("/", request.url))
}