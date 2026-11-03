import {getBearer,getSupabase,sendJson,methodNotAllowed} from "../../lib/supabase.js";
export default async function handler(req,res){
 if(req.method!=="GET")return methodNotAllowed(res,["GET"]);
 try{
  const token=getBearer(req);if(!token)return sendJson(res,401,{error:"Connecte-toi pour continuer."});
  const {data,error}=await getSupabase(token).auth.getUser(token);
  if(error||!data?.user)return sendJson(res,401,{error:"Session expirée."});
  return sendJson(res,200,{user:{id:data.user.id,email:data.user.email}});
 }catch(e){return sendJson(res,500,{error:e.message||"Impossible de vérifier la session."});}
}