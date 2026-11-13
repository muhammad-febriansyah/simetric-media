export type Option = {
    value: string;
    label: string;
};

export type Industry = {
    id: number;
    name: string;
    slug: string;
    summary: string | null;
    pain_points: string[];
    icon: string | null;
    sort_order: number;
    is_published: boolean;
    meta_title: string | null;
    meta_description: string | null;
    case_studies_count?: number;
};

export type Expertise = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    sort_order: number;
    is_published: boolean;
    meta_title: string | null;
    meta_description: string | null;
    services_count?: number;
    services?: Service[];
};

export type Service = {
    id: number;
    name: string;
    slug: string;
    expertise_id: number;
    expertise?: RelatedRecord;
    headline: string | null;
    problem_statement: string | null;
    body: string | null;
    capabilities: TitledItem[];
    methodology: TitledItem[];
    icon: string | null;
    sort_order: number;
    is_published: boolean;
    meta_title: string | null;
    meta_description: string | null;
    case_studies_count?: number;
};

export type TitledItem = {
    title: string;
    description: string | null;
};

export type CaseStudyImage = {
    id: number;
    url: string;
    caption: string | null;
    sort_order: number;
};

export type CaseStudyResult = {
    label: string;
    value: string;
};

export type RelatedRecord = {
    id: number;
    name: string;
    slug: string;
};

export type CaseStudy = {
    id: number;
    title: string;
    slug: string;
    client_name: string;
    project_period: string | null;
    organization_type: Option | null;
    excerpt: string | null;
    cover_image_url: string | null;
    challenge: string;
    assessment: string | null;
    recommendation: string | null;
    solution: string;
    results: CaseStudyResult[];
    key_insights: TitledItem[];
    is_featured: boolean;
    sort_order: number;
    is_published: boolean;
    meta_title: string | null;
    meta_description: string | null;
    images?: CaseStudyImage[];
    solutions?: RelatedRecord[];
    industry?: RelatedRecord | null;
    services?: RelatedRecord[];
};

export type Lead = {
    id: number;
    name: string;
    email: string;
    phone: string;
    job_title: string | null;
    company_name: string;
    company_size: Option | null;
    problem_area: Option;
    problem_description: string;
    timeline: Option | null;
    budget_range: Option | null;
    status: Option;
    source_page: string | null;
    utm: Record<string, string>;
    industry?: { id: number; name: string } | null;
    assignee?: { id: number; name: string } | null;
    created_at: string | null;
    created_at_label: string | null;
};

export type LeadActivity = {
    id: number;
    type: Option;
    from_status: Option | null;
    to_status: Option | null;
    note: string | null;
    user?: { id: number; name: string } | null;
    created_at_label: string | null;
};

export type ProcessStep = {
    title: string;
    description: string;
    deliverable: string;
    duration: string;
};

export type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page?: number;
    total: number;
    from?: number | null;
    to?: number | null;
};

export type Paginated<T> = {
    data: T[];
    meta: PaginationMeta;
};

export type Article = {
    id: number;
    title: string;
    slug: string;
    category: string | null;
    excerpt: string | null;
    body: string;
    cover_image_url: string | null;
    meta_title: string | null;
    meta_description: string | null;
    is_published: boolean;
    published_at_label: string | null;
    author?: { id: number; name: string } | null;
    services?: RelatedRecord[];
};

export type ClientLogo = {
    id: number;
    name: string;
    logo_url: string;
    website_url: string | null;
    sort_order: number;
    is_active: boolean;
    industry?: { id: number; name: string } | null;
    product?: { id: number; name: string } | null;
};

export type CompanyMilestone = {
    id: number;
    year: number;
    title: string;
    description: string | null;
    sort_order: number;
};

export type Office = {
    id: number;
    name: string;
    type: Option;
    address: string;
    city: string;
    phone: string | null;
    email: string | null;
    map_url: string | null;
    sort_order: number;
    is_active: boolean;
};

export type Product = {
    id: number;
    name: string;
    slug: string;
    category: string | null;
    tagline: string | null;
    summary: string | null;
    body: string | null;
    website_url: string | null;
    logo_url: string | null;
    cover_image_url: string | null;
    features: TitledItem[];
    highlights: CaseStudyResult[];
    is_featured: boolean;
    sort_order: number;
    is_published: boolean;
    meta_title: string | null;
    meta_description: string | null;
};

export type Solution = {
    id: number;
    name: string;
    slug: string;
    business_function: Option;
    headline: string | null;
    problem_statement: string | null;
    body: string | null;
    features: TitledItem[];
    icon: string | null;
    sort_order: number;
    is_published: boolean;
    meta_title: string | null;
    meta_description: string | null;
    case_studies_count?: number;
};

export type Faq = {
    id: number;
    question: string;
    answer: string;
    placement: string;
    placement_label: string;
    sort_order: number;
    is_active: boolean;
};

export type OptionGroup = {
    label: string;
    options: Option[];
};

export type TeamMember = {
    id: number;
    name: string;
    position: string;
    bio: string | null;
    photo_url: string | null;
    linkedin_url: string | null;
    sort_order: number;
    is_active: boolean;
};

export type Testimonial = {
    id: number;
    author_name: string;
    author_position: string | null;
    company: string | null;
    quote: string;
    photo_url: string | null;
    sort_order: number;
    is_active: boolean;
    case_study?: { id: number; title: string } | null;
    product?: { id: number; name: string } | null;
};

export type AdminUser = {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    is_current: boolean;
    two_factor_enabled: boolean;
    assigned_leads_count?: number;
    created_at_label: string | null;
};

export type TrashItem = {
    key: string;
    id: number;
    type: 'lead' | 'case-study' | 'article';
    type_label: string;
    title: string;
    deleted_at_label: string | null;
};

export type SiteSettings = {
    site_name: string | null;
    tagline: string | null;
    footer_text: string | null;
    site_logo: string | null;
    site_favicon: string | null;
    site_logo_url: string | null;
    site_favicon_url: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    contact_whatsapp: string | null;
    contact_address: string | null;
    business_hours: string | null;
    maps_embed_url: string | null;
    social_linkedin: string | null;
    social_instagram: string | null;
    social_youtube: string | null;
    social_facebook: string | null;
    social_x: string | null;
    social_tiktok: string | null;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;
    seo_og_image: string | null;
    seo_og_image_url: string | null;
    google_analytics_id: string | null;
    google_site_verification: string | null;
    expertise_page_title: string | null;
    expertise_page_description: string | null;
};
