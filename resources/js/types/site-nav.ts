/**
 * Mega menu content shared with every page (see HandleInertiaRequests::siteNavData).
 */
export type SiteNavService = {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    headline: string | null;
};

export type SiteNavExpertise = {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    services: SiteNavService[];
};

export type SiteNavIndustry = {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    summary: string | null;
};

export type SiteNav = {
    expertises: SiteNavExpertise[];
    industries: SiteNavIndustry[];
};
