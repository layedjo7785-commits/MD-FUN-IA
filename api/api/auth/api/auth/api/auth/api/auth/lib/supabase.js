import { createClient } from "@supabase/supabase-js";
export function getSupabase(token) {
  const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_ANON_KEY;
  if(!url||!key) throw new Error("Configuration Supabase manquante sur Vercel.");
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:token?{headers:{Authorization:`Bearer ${token}`}}:{}});
}
export function getBearer(req){const m=(req.headers.authorization||"").match(/^Bearer\\s+(.+)$/i);return m?m[1]:null;}
export function sendJson(res,status,body){res.status(status).setHeader("Content-Type","application/json; charset=utf-8");res.setHeader("Cache-Control","no-store");return res.end(JSON.stringify(body));}
export function methodNotAllowed(res,allowed){res.setHeader("Allow",allowed.join(", "));return sendJson(res,405,{error:"Méthode non autorisée."});}
export async function requireUser(req,res){
 const token=getBearer(req); if(!token){sendJson(res,401,{error:"Connecte-toi pour continuer."});return null;}
 const supabase=getSupabase(token); const {data,error}=await supabase.auth.getUser(token);
 if(error||!data?.user){sendJson(res,401,{error:"Session expirée. Reconnecte-toi."});return null;}
 return {supabase,user:data.user,token};
}
