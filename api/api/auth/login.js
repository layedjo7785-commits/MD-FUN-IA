import {getSupabase,sendJson,methodNotAllowed} from "../../lib/supabase.js";
export default async function handler(req,res){
 if(req.method!=="POST")return methodNotAllowed(res,["POST"]);
 try{
  const {email,password}=req.body||{}; if(!email||!password)return sendJson(res,400,{error:"Adresse e-mail et mot de passe obligatoires."});
  const {data,error}=await getSupabase().auth.signInWithPassword({email:String(email).trim().toLowerCase(),password:String(password)});
  if(error)return sendJson(res,401,{error:"Adresse e-mail ou mot de passe incorrect."});
  return sendJson(res,200,{token:data.session.access_token,user:{id:data.user.id,email:data.user.email}});
 }catch(e){return sendJson(res,500,{error:e.message||"Erreur de connexion."});}
}
