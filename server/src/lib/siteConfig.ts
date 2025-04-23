import { db } from "../db/postgres/postgres.js";
import { sites } from "../db/postgres/schema.js";

// Site configuration interface
interface SiteConfigData {
  public: boolean;
  saltUserIds: boolean;
}

class SiteConfig {
  private siteConfigMap: Map<number, SiteConfigData> = new Map();
  private initialized: boolean = false;

  async loadSiteConfigs() {
    try {
      const allSites = await db
        .select({
          siteId: sites.siteId,
          public: sites.public,
          saltUserIds: sites.saltUserIds,
        })
        .from(sites);

      // Reset the map
      this.siteConfigMap.clear();

      // Populate the map with site IDs and their configuration
      for (const site of allSites) {
        this.siteConfigMap.set(site.siteId, {
          public: site.public || false,
          saltUserIds: site.saltUserIds || false,
        });
      }

      this.initialized = true;
      console.log(
        `Loaded ${this.siteConfigMap.size} sites into site config cache`
      );
    } catch (error) {
      console.error("Error loading site configurations:", error);
      this.initialized = false;
    }
  }

  /**
   * Check if a site is public without hitting the database
   */
  isSitePublic(siteId: string | number): boolean {
    const numericSiteId = Number(siteId);
    const config = this.siteConfigMap.get(numericSiteId);
    return config?.public || false;
  }

  /**
   * Check if a site has user ID salting enabled
   */
  shouldSaltUserIds(siteId: string | number): boolean {
    const numericSiteId = Number(siteId);
    const config = this.siteConfigMap.get(numericSiteId);
    return config?.saltUserIds || false;
  }

  /**
   * Update the public status of a site in the cache
   */
  updateSitePublicStatus(siteId: number, isPublic: boolean): void {
    const config = this.siteConfigMap.get(siteId) || {
      public: false,
      saltUserIds: false,
    };
    config.public = isPublic;
    this.siteConfigMap.set(siteId, config);
  }

  /**
   * Update the salt user IDs setting of a site in the cache
   */
  updateSiteSaltSetting(siteId: number, saltUserIds: boolean): void {
    const config = this.siteConfigMap.get(siteId) || {
      public: false,
      saltUserIds: false,
    };
    config.saltUserIds = saltUserIds;
    this.siteConfigMap.set(siteId, config);
  }

  /**
   * Add a new site to the cache
   */
  addSite(siteId: number, config: SiteConfigData): void {
    this.siteConfigMap.set(siteId, config);
  }

  /**
   * Remove a site from the cache
   */
  removeSite(siteId: number): void {
    this.siteConfigMap.delete(siteId);
  }

  /**
   * Ensure the cache is initialized
   */
  async ensureInitialized() {
    if (!this.initialized) {
      await this.loadSiteConfigs();
    }
  }
}

// Singleton instance
export const siteConfig = new SiteConfig();
