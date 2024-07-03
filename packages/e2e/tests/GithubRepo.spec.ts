import { test, expect } from "@playwright/test";
import { GitHubPage } from "../pages/GithubPage";

test("should have a title", async ({ page }) => {
  const githubPage = new GitHubPage(page);
  await githubPage.goto();
  const title = await githubPage.getTitle();
  expect(title).toBeTruthy();
});

test("should have a next button", async ({ page }) => {
  const githubPage = new GitHubPage(page);
  await githubPage.goto();
  const nextButton = await githubPage.getNextButton();
  expect(nextButton).toBeTruthy();
  expect(await nextButton.textContent()).toBe("Next");

  const prevButton = await githubPage.getPreviousButton();
  expect(await prevButton.textContent()).toBe("Previous");
});

test("should correctly select the repo card WHEN user selects the first ", async ({
  page,
}) => {
  const githubPage = new GitHubPage(page);
  await githubPage.goto();
  await githubPage.selectFirstRepoCard();
  await githubPage.assertRepoCardSelected(true);
});

test("should preserve selection WHEN user navigates between pages", async ({
  page,
}) => {
  const githubPage = new GitHubPage(page);
  await githubPage.goto();
  await githubPage.selectFirstRepoCard();
  await githubPage.navigateToNextPage();
  await githubPage.navigateToPreviousPage();
  await githubPage.assertRepoCardSelected(true);
});

test("should correctly unselect previous selection WHEN user selects a new repo card", async ({
  page,
}) => {
  const githubPage = new GitHubPage(page);
  await githubPage.goto();
  await githubPage.selectFirstRepoCard();
  await githubPage.unselectFirstRepoCard();
  await githubPage.assertRepoCardSelected(false);
});
