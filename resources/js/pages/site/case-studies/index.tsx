import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    FilterXIcon,
    FolderSearchIcon,
} from 'lucide-react';
import { OptionSelect } from '@/components/admin/option-select';
import { CaseStudyCard } from '@/components/site/case-study-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
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

            <Card>
                <CardContent className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="grid flex-1 gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-2 text-sm font-medium">
                            Industri
                            <FilterSelect
                                id="filter-industry"
                                value={filters.industry}
                                options={industryOptions}
                                allLabel="Semua industri"
                                onChange={(industry) => visit({ industry })}
                            />
                        </label>
                        <label className="flex flex-col gap-2 text-sm font-medium">
                            Layanan
                            <FilterSelect
                                id="filter-service"
                                value={filters.service}
                                options={serviceOptions}
                                allLabel="Semua layanan"
                                onChange={(service) => visit({ service })}
                            />
                        </label>
                    </div>
                    {hasFilters && (
                        <Button
                            variant="secondary"
                            onClick={() => visit({ industry: '', service: '' })}
                        >
                            <FilterXIcon data-icon="inline-start" />
                            Hapus filter
                        </Button>
                    )}
                </CardContent>
            </Card>

            {caseStudies.data.length === 0 ? (
                <Card>
                    <CardContent>
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <FolderSearchIcon />
                                </EmptyMedia>
                                <EmptyTitle>
                                    Studi kasus tidak ditemukan
                                </EmptyTitle>
                                <EmptyDescription>
                                    Coba ubah filter industri atau layanan.
                                </EmptyDescription>
                            </EmptyHeader>
                            {hasFilters && (
                                <EmptyContent>
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            visit({ industry: '', service: '' })
                                        }
                                    >
                                        <FilterXIcon data-icon="inline-start" />
                                        Hapus filter
                                    </Button>
                                </EmptyContent>
                            )}
                        </Empty>
                    </CardContent>
                </Card>
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

            {lastPage > 1 && (
                <div className="flex items-center justify-center gap-3">
                    <Button
                        variant="secondary"
                        disabled={currentPage <= 1}
                        onClick={() => visit({ page: currentPage - 1 })}
                    >
                        <ChevronLeftIcon data-icon="inline-start" />
                        Sebelumnya
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Halaman {currentPage} dari {lastPage}
                    </span>
                    <Button
                        variant="secondary"
                        disabled={currentPage >= lastPage}
                        onClick={() => visit({ page: currentPage + 1 })}
                    >
                        Berikutnya
                        <ChevronRightIcon data-icon="inline-end" />
                    </Button>
                </div>
            )}

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
    title: 'Studi Kasus',
    description:
        'Perjalanan konsultasi nyata: dari tantangan, temuan assessment, rekomendasi, sampai hasil yang terukur.',
};
