@php
    $siteName = $siteSettings['site_name'] ?: config('app.name');
    $seoTitle = $siteSettings['seo_title'] ?: $siteName;
    $seoDescription = $siteSettings['seo_description'] ?: $siteSettings['tagline'];
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="application-name" content="{{ $siteName }}">

        {{-- Light mode only: match the page background from app.css before CSS loads --}}
        <style>
            html {
                background-color: #f7f8fd;
                color-scheme: light;
            }
        </style>

        @if ($siteSettings['site_favicon_url'])
            <link rel="icon" href="{{ $siteSettings['site_favicon_url'] }}">
            <link rel="apple-touch-icon" href="{{ $siteSettings['site_favicon_url'] }}">
        @else
            <link rel="icon" href="/favicon.ico" sizes="any">
            <link rel="icon" href="/favicon.svg" type="image/svg+xml">
            <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        @endif

        {{-- Default SEO tags. Pages may add more specific tags with Inertia <Head>. --}}
        @if ($seoDescription)
            <meta name="description" content="{{ $seoDescription }}">
        @endif
        @if ($siteSettings['seo_keywords'])
            <meta name="keywords" content="{{ $siteSettings['seo_keywords'] }}">
        @endif
        <meta property="og:site_name" content="{{ $siteName }}">
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ $seoTitle }}">
        @if ($seoDescription)
            <meta property="og:description" content="{{ $seoDescription }}">
        @endif
        <meta property="og:url" content="{{ url()->current() }}">
        @if ($siteSettings['seo_og_image_url'])
            <meta property="og:image" content="{{ $siteSettings['seo_og_image_url'] }}">
            <meta name="twitter:card" content="summary_large_image">
        @endif
        @if ($siteSettings['google_site_verification'])
            <meta name="google-site-verification" content="{{ $siteSettings['google_site_verification'] }}">
        @endif

        @if ($siteSettings['google_analytics_id'])
            <script async src="https://www.googletagmanager.com/gtag/js?id={{ $siteSettings['google_analytics_id'] }}"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', @json($siteSettings['google_analytics_id']));
            </script>
        @endif

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ $seoTitle }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
