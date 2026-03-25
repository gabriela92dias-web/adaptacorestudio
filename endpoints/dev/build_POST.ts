import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function handle(req: Request): Promise<Response> {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  
  try {
    // Run vite build via npx
    const { stdout, stderr } = await execAsync("npx vite build", { maxBuffer: 1024 * 1024 * 10 }); // 10MB buffer just in case
    
    return new Response(JSON.stringify({ success: true, message: "Build completed", out: stdout }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: "Build failed", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
