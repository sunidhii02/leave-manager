import { test, expect } from "@playwright/test";

test.describe("Critical user flow", () => {
  test("landing page loads and shows key elements", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("LeaveFlow");
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  });

  test("login page renders form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("404 page shows for unknown routes", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByText("Page not found")).toBeVisible();
  });
});
