import {requireUser,sendJson,methodNotAllowed} from "../lib/supabase.js";
export default async function handler(req,res){
 try{const a=await requireUser(req,res);if(!a)return;const {supabase,user}=a;
  if(req.method==="GET"){const {data,error}=await supabase.from("conversations").select("id,title,created_at,updated_at").eq("user_id",user.id).order("updated_at",{ascending:false}).limit(50);if(error)return sendJson(res,500,{error:error.message});return sendJson(res,200,{conversations:data||[]});}
  if(req.method==="POST"){const title=String(req.body?.title||"Nouvelle conversation").slice(0,100);const {data,error}=await supabase.from("conversations").insert({user_id:user.id,title}).select("id,title,created_at,updated_at").single();if(error)return sendJson(res,500,{error:error.message});return sendJson(res,201,{conversation:data});}
  return methodNotAllowed(res,["GET","POST"]);
 }catch(e){return sendJson(res,500,{error:e.message||"Erreur conversations."});}
}
