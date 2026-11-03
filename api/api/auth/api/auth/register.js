import {getSupabase,sendJson,methodNotAllowed} from "../../lib/supabase.js";
export default async function handler(req,res){
 if(req.method!=="POST")return methodNotAllowed(res,["POST"]);
 try{
  const {email,password}=req.body||{};
  if(!email||!password||String(password).length<8)return sendJson(res,400,{error:"Entre une adresse e-mail et un mot de passe d'au moins 8 caractères."});
  const {data,error}=await getSupabase().auth.signUp({email:String(email).trim().toLowerCase(),password:String(password)});
  if(error)return sendJson(res,400,{error:error.message});
  if(!data.session?.access_token)return sendJson(res,409,{error:"Compte créé, mais une confirmation par e-mail est nécessaire. Vérifie ta boîte mail, puis connecte-toi."});
  return sendJson(res,201,{token:data.session.access_token,user:{id:data.user.id,email:data.user.email}});
 }catch(e){return sendJson(res,500,{error:e.message||"Impossible de créer le compte."});}
}
