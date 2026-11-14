import { Head, Link, router } from '@inertiajs/react';
import { FilterXIcon, FolderSearchIcon } from 'lucide-react';
import { OptionSelect } from '@/components/admin/option-select';
import { CaseStudyCard } from '@/components/site/case-study-card';
import { FilterPills } from '@/components/site/filter-pills';
import { SiteEmpty } from '@/components/site/site-empty';
import { SitePagination } from '@/components/site/site-pagination';
import { Button } from '@/components/ui/button';
import { home } from '@/routes';
import { index } from '@/routes/case-studies';
import { create as consultationCreate } from '@/routes/consultation';
import type { CaseStudy, Option, Paginated } from '@/types';

type Filters = {
    industry: string;
    service: string;
};

type Props = {
    caseStudies: Paginated<CaseStudy>;
    filters: Filters;
    industryOptions: Option[];
    serviceOptions: Option[];
};

const ALL = 'all';

export default function CaseStudyIndex({
    caseStudies,
    filters,
    industryOptions,
    serviceOptions,
}: Props) {
    const { current_page: currentPage, last_page: lastPage } = caseStudies.meta;
    const hasFilters = Boolean(filters.industry || filters.service);

    const visit = (query: Partial<Filters> & { page?: number }) => {
        const next = { ...filters, ...query };

        router.get(
            index.url(),
            {
                industry: next.industry || undefined,
                service: next.service || undefined,
                page: query.page,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Studi Kasus" />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <FilterPills
                    label="Filter industri"
                    allLabel="Semua industri"
                    options={industryOptions}
                    value={filters.industry}
                    onChange={(industry) => visit({ industry })}
                />
                <div className="flex items-center gap-2 lg:w-72">
                    <label htmlFor="filter-service" className="sr-only">
                        Layanan
                    </label>
                    <FilterSelect
                        id="filter-service"
                        value={filters.service}
                        options={serviceOptions}
                        allLabel="Semua layanan"
                        onChange={(service) => visit({ service })}
                    />
                </div>
            </div>

            {caseStudies.data.length === 0 ? (
                <SiteEmpty
                    icon={FolderSearchIcon}
                    title="Studi kasus tidak ditemukan"
                    description="Coba ubah filter industri atau layanan."
                >
                    {hasFilters && (
                        <Button
                            variant="secondary"
                            onClick={() => visit({ industry: '', service: '' })}
                        >
                            <FilterXIcon data-icon="inline-start" />
                            Hapus filter
                        </Button>
                    )}
                </SiteEmpty>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {caseStudies.data.map((caseStudy) => (
                        <CaseStudyCard
                            key={caseStudy.id}
                            caseStudy={caseStudy}
                        />
                    ))}
                </div>
            )}

            <SitePagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={(page) => visit({ page })}
            />

            <p className="text-center text-sm text-muted-foreground">
                Punya tantangan serupa?{' '}
                <Link
                    href={consultationCreate()}
                    className="font-semibold text-primary"
                >
                    Ceritakan kepada kami
                </Link>
            </p>
        </>
    );
}

function FilterSelect({
    id,
    value,
    options,
    allLabel,
    onChange,
}: {
    id: string;
    value: string;
    options: Option[];
    allLabel: string;
    onChange: (value: string) => void;
}) {
    return (
        <OptionSelect
            key={value || ALL}
            id={id}
            name={id}
            options={options}
            defaultValue={value || ALL}
            emptyValue={ALL}
            emptyLabel={allLabel}
            placeholder={allLabel}
            onValueChange={(selected) =>
                onChange(selected === ALL ? '' : selected)
            }
        />
    );
}

CaseStudyIndex.layout = {
    breadcrumbs: [
        { title: 'Beranda', href: home() },
        { title: 'Studi Kasus', href: index() },
    ],
    eyebrow: 'Bukti nyata',
    title: 'Studi Kasus',
    description:
        'Perjalanan konsultasi nyata: dari tantangan, temuan assessment, rekomendasi, sampai hasil yang terukur.',
};
