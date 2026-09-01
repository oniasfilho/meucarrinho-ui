import { expect, test } from "@playwright/test";

test("creates a session and retrieves it after reload", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Nova sessão" }).click();

  await expect(page).toHaveURL(/\/sessions\/[0-9a-f-]+$/);
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).not.toHaveText("");
  const sessionName = await heading.innerText();

  await expect(page.getByText("Sua sessão ainda não tem itens.")).toBeVisible();

  await page.reload();

  await expect(heading).toHaveText(sessionName);
  await expect(page.getByText("Sua sessão ainda não tem itens.")).toBeVisible();
});
