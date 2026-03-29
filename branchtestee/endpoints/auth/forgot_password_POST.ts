import { db } from "../../helpers/db";
import { sql } from "kysely";
import { schema } from "./forgot_password_POST.schema";
import { generatePasswordHash } from "../../helpers/generatePasswordHash";

export async function handle(request: Request) {
  try {
    const json = await request.json();
    const { email } = schema.parse(json);

    const normalizedEmail = email.toLowerCase();

    // 1. Check if user exists
    const user = await db
      .selectFrom("users")
      .select("id")
      .where(sql`LOWER(email)`, "=", normalizedEmail)
      .executeTakeFirst();

    if (!user) {
      // Security: do not reveal that the email doesn't exist.
      return Response.json({ message: "Se o email estiver correto, sua senha foi redefinida provisoriamente para Adapta@2026" });
    }

    // 2. Generate hash for a known temporary password
    const tempPasswordHash = await generatePasswordHash("Adapta@2026");

    // 3. Update the password hash for this user
    await db
      .updateTable("userPasswords")
      .set({
        passwordHash: tempPasswordHash,
        updatedAt: new Date(),
      })
      .where("userId", "=", user.id)
      .execute();

    return Response.json({ 
      message: "Senha redefinida com sucesso! Volte e entre com a senha provisória: Adapta@2026"
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return Response.json({ message: "Erro ao redefinir a senha" }, { status: 400 });
  }
}
