// githubPage.ts

import { Page, expect } from "@playwright/test";

export class GitHubPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("http://localhost:3000/");
  }

  async getTitle() {
    const el = await this.page.$("text=browse Github");
    return el;
  }

  async getNextButton() {
    const nextButton = await this.page.waitForSelector(".next-button");
    return nextButton;
  }

  async getPreviousButton() {
    const prevButton = await this.page.waitForSelector(".previous-button");
    return prevButton;
  }

  async getFirstRepoCard() {
    const firstRepo = await this.page.waitForSelector(".repo-card");
    return firstRepo;
  }

  async selectFirstRepoCard() {
    const firstRepo = await this.getFirstRepoCard();
    await firstRepo.click();
    await this.page.waitForSelector(".repo-card.bg-slate-200");
  }

  async unselectFirstRepoCard() {
    const firstRepo = await this.getFirstRepoCard();
    await firstRepo.click();
    await this.page.waitForSelector(".repo-card.bg-white");
  }

  async navigateToNextPage() {
    const nextButton = await this.getNextButton();
    await nextButton.click();
  }

  async navigateToPreviousPage() {
    const prevButton = await this.getPreviousButton();
    await prevButton.click();
  }

  async assertRepoCardSelected(expectedSelected: boolean) {
    const firstRepo = await this.getFirstRepoCard();
    const hasClass = await firstRepo.evaluate((el) =>
      el.classList.contains("bg-slate-200")
    );
    expect(hasClass).toBe(expectedSelected);
  }
}
