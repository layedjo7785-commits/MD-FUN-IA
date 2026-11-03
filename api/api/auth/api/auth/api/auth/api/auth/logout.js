import {getBearer,getSupabase,sendJson,methodNotAllowed} from "../../lib/supabase.js";
export default async function handler(req,res){
 if(req.method!=="POST")return methodNotAllowed(res,["POST"]);
 try{const token=getBearer(req);if(token)await getSupabase(token).auth.signOut({scope:"local"});return sendJson(res,200,{success:true});}
 catch{return sendJson(res,200,{success:true});}
}
