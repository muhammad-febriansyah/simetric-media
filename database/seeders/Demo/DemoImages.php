<?php

namespace Database\Seeders\Demo;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

/**
 * Fetches free-license demo images into storage/app/public/demo.
 *
 * - Photos: a curated pool of business/industry photos from the Unsplash CDN
 *   (Unsplash License: free for commercial use, no attribution required).
 * - Avatars: api.dicebear.com "notionists" illustrations (CC0, not real people).
 * - Client logos: generated locally as SVG for fictional companies.
 *
 * Files are reused when they already exist, so re-running the seeder is fast.
 */
class DemoImages
{
    private const DISK = 'public';

    /**
     * Unsplash photo IDs (offices, teams, factories, warehouses, dashboards, ...).
     *
     * @var list<string>
     */
    private const PHOTO_IDS = [
        '1581091226825-a6a2a5aee158',
        '1518770660439-4636190af475',
        '1504384308090-c894fdcc538d',
        '1522071820081-009f0129c71c',
        '1551288049-bebda4e38f71',
        '1460925895917-afdab827c52f',
        '1553877522-43269d4ea984',
        '1497366216548-37526070297c',
        '1486406146926-c627a92ad1ab',
        '1565043589221-1a6fd9ae45c7',
        '1581092160562-40aa08e78837',
        '1586528116311-ad8dd3c8310d',
        '1553413077-190dd305871c',
        '1541888946425-d81bb19240f5',
        '1504307651254-35680f356dfd',
        '1556761175-5973dc0f32e7',
        '1531482615713-2afd69097998',
        '1600880292203-757bb62b4baf',
        '1573164713988-8665fc963095',
        '1519389950473-47ba0277781c',
        '1498050108023-c5249f4df085',
        '1461749280684-dccba630e2f6',
        '1488590528505-98d2b5aba04b',
        '1517694712202-14dd9538aa97',
        '1556155092-490a1ba16284',
        '1542744173-8e7e53415bb0',
        '1559136555-9303baea8ebd',
        '1521791136064-7986c2920216',
        '1454165804606-c3d57bc86b40',
        '1507679799987-c73779587ccf',
        '1494412574643-ff11b0a5c1c3',
        '1578575437130-527eed3abbec',
        '1587293852726-70cdb56c2866',
        '1516937941344-00b4e0337589',
        '1567789884554-0b844b597180',
        '1576091160550-2173dba999ef',
        '1563986768609-322da13575f3',
        '1556742049-0cfed4f6a45d',
        '1441986300917-64674bd600d8',
        '1625246333195-78d9c38ad449',
        '1566073771259-6a8506099945',
        '1544620347-c4fd4a3d5957',
        '1558494949-ef010cbdcc31',
        '1544197150-b99a580bb7a8',
        '1531297484001-80022131f5a1',
        '1550751827-4bd374c3f58b',
        '1504868584819-f8e8b4b6d7e3',
        '1551434678-e076c223a692',
        '1497215728101-856f4ea42174',
        '1504328345606-18bbc8c9d7d1',
        '1513828583688-c52646db42da',
        '1600880292089-90a7e086ee0c',
        '1552664730-d307ca884978',
        '1520607162513-77705c0f0d4a',
        '1537462715879-360eeb61a0ad',
        '1590650153855-d9e808231d41',
        '1563013544-824ae1b704d3',
        '1580894894513-541e068a3e2b',
        '1532622785990-d2c36a76f5a6',
    ];

    private static int $nextPhoto = 0;

    /**
     * Download a landscape photo. Returns the stored path, or null when offline.
     */
    public static function photo(string $seed, string $folder, int $width = 1200, int $height = 675): ?string
    {
        $path = "demo/{$folder}/".Str::slug($seed).'.jpg';
        $photoId = self::PHOTO_IDS[self::$nextPhoto++ % count(self::PHOTO_IDS)];

        return self::download(
            "https://images.unsplash.com/photo-{$photoId}?w={$width}&h={$height}&fit=crop&crop=entropy&q=75&fm=jpg",
            $path,
        );
    }

    /**
     * Download an illustrated avatar (not a photo of a real person).
     */
    public static function avatar(string $seed): ?string
    {
        $path = 'demo/avatars/'.Str::slug($seed).'.png';

        return self::download(
            'https://api.dicebear.com/9.x/notionists/png?size=256&backgroundColor=eef1fe,e5e9f2,dbe4ff&seed='.rawurlencode($seed),
            $path,
        );
    }

    /**
     * Create a simple wordmark logo for a fictional company.
     */
    public static function logo(string $company, string $color): string
    {
        $path = 'demo/logos/'.Str::slug($company).'.svg';
        $initials = collect(explode(' ', $company))
            ->reject(fn (string $word): bool => in_array(strtolower($word), ['pt', 'cv', 'tbk', '&'], true))
            ->take(2)
            ->map(fn (string $word): string => mb_strtoupper(mb_substr($word, 0, 1)))
            ->implode('');
        $name = e($company);

        Storage::disk(self::DISK)->put($path, <<<SVG
        <svg xmlns="http://www.w3.org/2000/svg" width="320" height="96" viewBox="0 0 320 96">
          <rect x="8" y="16" width="64" height="64" rx="16" fill="{$color}"/>
          <text x="40" y="58" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="26" font-weight="700" fill="#ffffff">{$initials}</text>
          <text x="86" y="56" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="19" font-weight="600" fill="#34364a">{$name}</text>
        </svg>
        SVG);

        return $path;
    }

    private static function download(string $url, string $path): ?string
    {
        $disk = Storage::disk(self::DISK);

        if ($disk->exists($path)) {
            return $path;
        }

        try {
            $response = Http::timeout(20)->retry(2, 300, throw: false)->get($url);

            if (! $response->successful() || $response->body() === '') {
                return null;
            }

            $disk->put($path, $response->body());

            return $path;
        } catch (Throwable) {
            return null;
        }
    }
}
