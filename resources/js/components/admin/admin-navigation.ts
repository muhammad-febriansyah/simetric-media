import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    ArchiveRestoreIcon,
    CircleHelpIcon,
    LightbulbIcon,
    QuoteIcon,
    Settings2Icon,
    UsersIcon,
    UserRoundIcon,
    BriefcaseBusinessIcon,
    Building2Icon,
    FolderKanbanIcon,
    HandshakeIcon,
    HistoryIcon,
    InboxIcon,
    LayoutGridIcon,
    MapPinIcon,
    NewspaperIcon,
    PlusIcon,
    ShieldCheckIcon,
    UserIcon,
} from 'lucide-react';
import { dashboard } from '@/routes';
import {
    create as createArticle,
    index as articlesIndex,
} from '@/routes/admin/articles';
import {
    create as createCaseStudy,
    index as caseStudiesIndex,
} from '@/routes/admin/case-studies';
import {
    create as createIndustry,
    index as industriesIndex,
} from '@/routes/admin/industries';
import { index as clientLogosIndex } from '@/routes/admin/client-logos';
import { index as faqsIndex } from '@/routes/admin/faqs';
import { index as leadsIndex } from '@/routes/admin/leads';
import { index as milestonesIndex } from '@/routes/admin/milestones';
import { index as officesIndex } from '@/routes/admin/offices';
import { edit as editSiteSettings } from '@/routes/admin/site-settings';
import {
    create as createSolution,
    index as solutionsIndex,
} from '@/routes/admin/solutions';
import { index as teamMembersIndex } from '@/routes/admin/team-members';
import { index as testimonialsIndex } from '@/routes/admin/testimonials';
import { index as trashIndex } from '@/routes/admin/trash';
import {
    create as createUser,
    index as usersIndex,
} from '@/routes/admin/users';
import {
    create as createService,
    index as servicesIndex,
} from '@/routes/admin/services';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

export type AdminNavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon: LucideIcon;
    /** Show the number of new leads next to this item. */
    showNewLeadsBadge?: boolean;
    keywords?: string[];
};

export type AdminNavGroup = {
    label: string;
    items: AdminNavItem[];
};

/**
 * Admin sidebar groups. The command menu searches these items too.
 */
export const adminNavGroups: AdminNavGroup[] = [
    {
        label: 'Utama',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGridIcon,
                keywords: ['beranda', 'ringkasan', 'statistik'],
            },
        ],
    },
    {
        label: 'Penjualan',
        items: [
            {
                title: 'Lead Konsultasi',
                href: leadsIndex(),
                icon: InboxIcon,
                showNewLeadsBadge: true,
                keywords: ['lead', 'klien', 'konsultasi', 'prospek'],
            },
        ],
    },
    {
        label: 'Konten Website',
        items: [
            {
                title: 'Studi Kasus',
                href: caseStudiesIndex(),
                icon: FolderKanbanIcon,
                keywords: ['portfolio', 'proyek', 'case study'],
            },
            {
                title: 'Layanan',
                href: servicesIndex(),
                icon: BriefcaseBusinessIcon,
                keywords: ['service', 'jasa'],
            },
            {
                title: 'Solusi',
                href: solutionsIndex(),
                icon: LightbulbIcon,
                keywords: ['solution', 'divisi', 'fungsi bisnis'],
            },
            {
                title: 'Industri',
                href: industriesIndex(),
                icon: Building2Icon,
                keywords: ['sektor', 'industry'],
            },
            {
                title: 'Insight',
                href: articlesIndex(),
                icon: NewspaperIcon,
                keywords: ['artikel', 'blog', 'ideas'],
            },
            {
                title: 'FAQ',
                href: faqsIndex(),
                icon: CircleHelpIcon,
                keywords: ['pertanyaan', 'tanya jawab'],
            },
            {
                title: 'Testimoni',
                href: testimonialsIndex(),
                icon: QuoteIcon,
                keywords: ['review', 'kutipan', 'klien'],
            },
        ],
    },
    {
        label: 'Perusahaan',
        items: [
            {
                title: 'Tim',
                href: teamMembersIndex(),
                icon: UserRoundIcon,
                keywords: ['team', 'anggota', 'karyawan'],
            },
            {
                title: 'Logo Klien',
                href: clientLogosIndex(),
                icon: HandshakeIcon,
                keywords: ['partner', 'klien', 'trusted'],
            },
            {
                title: 'Perjalanan Perusahaan',
                href: milestonesIndex(),
                icon: HistoryIcon,
                keywords: ['sejarah', 'history', 'milestone', 'timeline'],
            },
            {
                title: 'Kantor',
                href: officesIndex(),
                icon: MapPinIcon,
                keywords: ['alamat', 'cabang', 'office', 'kontak'],
            },
        ],
    },
    {
        label: 'Sistem',
        items: [
            {
                title: 'Pengguna',
                href: usersIndex(),
                icon: UsersIcon,
                keywords: ['user', 'admin', 'akun', 'pic'],
            },
            {
                title: 'Pengaturan Website',
                href: editSiteSettings(),
                icon: Settings2Icon,
                keywords: ['setting', 'kontak', 'whatsapp', 'sosial media'],
            },
            {
                title: 'Data Terhapus',
                href: trashIndex(),
                icon: ArchiveRestoreIcon,
                keywords: ['trash', 'sampah', 'pulihkan', 'restore'],
            },
        ],
    },
];

/**
 * Shortcuts that only appear in the command menu.
 */
export const adminQuickActions: AdminNavItem[] = [
    { title: 'Tambah studi kasus', href: createCaseStudy(), icon: PlusIcon },
    { title: 'Tambah layanan', href: createService(), icon: PlusIcon },
    { title: 'Tambah industri', href: createIndustry(), icon: PlusIcon },
    { title: 'Tulis artikel', href: createArticle(), icon: PlusIcon },
    { title: 'Tambah solusi', href: createSolution(), icon: PlusIcon },
    { title: 'Tambah pengguna', href: createUser(), icon: PlusIcon },
];

export const accountNavItems: AdminNavItem[] = [
    {
        title: 'Profil',
        href: editProfile(),
        icon: UserIcon,
        keywords: ['akun', 'nama', 'email'],
    },
    {
        title: 'Keamanan',
        href: editSecurity(),
        icon: ShieldCheckIcon,
        keywords: ['password', '2fa', 'passkey'],
    },
];
