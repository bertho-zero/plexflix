'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import { Bebas_Neue as BebasNeue } from 'next/font/google';
import { css, sva, cx } from 'styled-system/css';
import { flex } from 'styled-system/patterns';
import Menu from '@/components/Menu';
import ServiceButtons from '@/components/ServiceButtons';

const bebasNeue = BebasNeue({
  subsets: ['latin'],
  weight: '400',
});

const plexflixLogo = sva({
  slots: ['root', 'stem', 'bowl'],
  base: {
    root: {
      '--P-bowl-witdh': '5.25em',
      pos: 'relative',
      w: 'calc(280px * var(--logo-scale))',
      h: 'calc(420px * var(--logo-scale))',
      overflow: 'hidden',
      _before: {
        content: '""',
        pos: 'absolute',
        left: 0,
        bottom: 'calc(-100px * var(--logo-scale))',
        w: 'full',
        h: 'calc(120px * var(--logo-scale))',
        bgColor: 'black',
        zIndex: 2,
        borderRadius: '100% 100% 0 0',
        transform: 'scaleX(1.5)',
      },
      _after: {
        content: '""',
        pos: 'absolute',
        top: 0,
        right: 0,
        w: '400%',
        h: '100%',
        bg: 'linear-gradient(to right, transparent, black, black)',
        zIndex: 3,
        animation: 'show 1.5s linear forwards',
      },
    },
    stem: {
      pos: 'absolute',
      top: 0,
      left: 0,
      w: 'calc(6em * var(--logo-scale))',
      h: 'full',
      bgColor: 'red2',
    },
    bowl: {
      _before: {
        content: '""',
        pos: 'absolute',
        right: 0,
        border: 'calc(var(--P-bowl-witdh) * var(--logo-scale)) solid token(colors.red1)',
        w: 'calc(100% + var(--P-bowl-witdh))',
        h: '60%',
        borderRightRadius: 'calc(var(--P-bowl-witdh) * 2)',
      },
    },
  },
});

const iframeStyle = css.raw({
  position: 'fixed',
  top: '0px',
  bottom: '0px',
  right: '0px',
  width: '100%',
  minWidth: '100%',
  border: 'none',
  margin: '0',
  padding: '0',
  overflow: 'hidden',
  zIndex: '999999',
  height: '100%',
  backgroundColor: 'white',
});

const iframeStyles = {
  plex: css.raw({ bgColor: '#212121' }),
  overseerr: css.raw({ bgColor: '#111827' }),
};

function encodeForURLHash(url: string): string {
  const charsToEncode = ['#', '%'];

  let encodedURL = '';
  for (let char of url) {
    if (charsToEncode.includes(char)) {
      encodedURL += '%' + char.charCodeAt(0).toString(16).toUpperCase();
    } else {
      encodedURL += char;
    }
  }

  return encodedURL;
}

function getServiceUrl(service: string) {
  if (service === 'joal') {
    return '/joal/ui/';
  }

  return `/${service}/`;
}

export default function HomePage() {
  const [iframes, setIframes] = useState<{ service: string, src: string, url: string }[]>([]);
  const [selectedIframe, setSelectedIframe] = useState<string>();

  const onOpenIframe = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { service } = e.currentTarget.dataset as { service: string };

    const iframe = iframes.find(iframe => iframe.service === service);

    if (!iframe) {
      const serviceUrl = getServiceUrl(service);
      setIframes(prevIframes => [
        ...prevIframes,
        {
          service,
          src: serviceUrl,
          url: serviceUrl,
        },
      ]);
    } else {
      window.location.hash = '!' + encodeForURLHash(iframe.url);
    }

    setSelectedIframe(service);
  };

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#!')) return;
    const decodedIframeSrc = decodeURIComponent(hash.substring(3));
    const service = decodedIframeSrc.split('/')[0];
    setIframes([{
      service,
      src: `/${decodedIframeSrc}`,
      url: `/${decodedIframeSrc}`,
    }]);
    setSelectedIframe(service);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'urlChange') {
        const newUrl = new URL(event.data.url);
        const serviceUrl = newUrl.pathname + newUrl.search + newUrl.hash;
        window.location.hash = '!' + encodeForURLHash(serviceUrl);

        const iframeIndex = iframes.findIndex(iframe => iframe.service === selectedIframe);

        setIframes(prevIframes => [
          ...prevIframes.slice(0, iframeIndex),
          {
            ...prevIframes[iframeIndex],
            url: serviceUrl,
          },
          ...prevIframes.slice(iframeIndex + 1),
        ]);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [iframes, selectedIframe]);

  const plexflixLogoClasses = plexflixLogo();

  return (
    <main className={flex()}>
      {iframes.length === 0 ? (
        <div
          className={css({
            '@media only screen and (max-height: 36em)': {
              '--logo-scale': 0.5,
            },
            '@media only screen and (max-height: 48em)': {
              '--logo-scale': 0.7,
            },
            '--logo-scale': {
              base: 0.5,
              sm: 0.7,
              md: 1,
            },
            display: 'flex',
            flexDir: 'column',
            alignItems: 'center',
            gap: 4,
            mx: 4,
            my: 12,
          })}
        >
          <div className={plexflixLogoClasses.root}>
            <span className={plexflixLogoClasses.stem} />
            <span className={plexflixLogoClasses.bowl} />
          </div>

          <h3
            className={cx(bebasNeue.className, css({
              textAlign: 'center',
              color: 'white',
              fontSize: `calc(5rem * var(--logo-scale))`,
              textTransform: 'uppercase',
              letterSpacing: `calc(10px * var(--logo-scale))`,
              overflow: 'hidden',
              animation: 'expand 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) both',
            }))}
          >
            Plexflix
          </h3>

          <div
            className={flex({
              direction: 'row',
              wrap: 'wrap',
              justify: 'center',
              gap: '1.25em',
            })}
          >
            <ServiceButtons onClick={onOpenIframe} />
          </div>
        </div>
      ) : null}

      {iframes.map(iframe => (
        <iframe
          key={iframe.service}
          className={css(
            iframeStyle,
            { visibility: selectedIframe === iframe.service ? 'visible' : ' hidden' },
            iframeStyles[iframe.service as keyof typeof iframeStyles] ?? null,
          )}
          sandbox="
            allow-downloads
            allow-forms
            allow-modals
            allow-orientation-lock
            allow-pointer-lock
            allow-popups
            allow-popups-to-escape-sandbox
            allow-presentation
            allow-same-origin
            allow-scripts
            allow-top-navigation
          "
          src={iframe.src}
        />
      ))}

      {iframes.length > 0 ? (
        <Menu>
          <ServiceButtons onClick={onOpenIframe} />
        </Menu>
      ) : null}
    </main>
  );
};
