'use client';

import { useState } from 'react';
import { Bebas_Neue as BebasNeue } from 'next/font/google';
import Image from 'next/image';
import './page.css';
import Menu from '../components/Menu';

const bebasNeue = BebasNeue({
  subsets: ['latin'],
  weight: '400',
});

function getServiceUrl(service) {
  if (service === 'joal') {
    return '/joal/joal/ui/';
  }

  return `/${service}`
}

function ServiceButtons({ onClick }) {
  return (
    <>
      <button onClick={onClick} data-service="plex">
        <Image
          src="/plex.svg"
          width={52}
          height={52}
          alt="Plex"
        />
      </button>

      <button onClick={onClick} data-service="overseerr">
        <Image
          src="/overseerr.svg"
          width={52}
          height={52}
          alt="Overseerr"
        />
      </button>

      <button onClick={onClick} data-service="radarr">
        <Image
          src="/radarr.svg"
          width={52}
          height={52}
          alt="Radarr"
        />
      </button>

      <button onClick={onClick} data-service="sonarr">
        <Image
          src="/sonarr.svg"
          width={52}
          height={52}
          alt="Sonarr"
        />
      </button>

      <button onClick={onClick} data-service="prowlarr">
        <Image
          src="/prowlarr.svg"
          width={52}
          height={52}
          alt="Prowlarr"
        />
      </button>

      <button onClick={onClick} data-service="qbittorrent">
        <Image
          src="/qbittorrent.svg"
          width={52}
          height={52}
          alt="qBittorrent"
        />
      </button>

      <button onClick={onClick} data-service="joal">
        <Image
          src="/joal.64x64.png"
          width={52}
          height={52}
          alt="JOAL"
        />
      </button>
    </>
  );
}

export default function Home() {
  const [iframes, setIframes] = useState([]);
  const [selectedIframe, setSelectedIframe] = useState();

  const onOpenIframe = e => {
    e.preventDefault();
    const { service } = e.currentTarget.dataset;

    if (!iframes.find(iframe => iframe.service === service)) {
      setIframes(prevIframes => [
        ...prevIframes,
        {
          service,
          src: getServiceUrl(service),
        }
      ]);
    }

    setSelectedIframe(service);
  };

  return (
    <main style={{ display: 'flex' }}>
      {iframes.length === 0 ? (
        <div className="container">
          <div className="plexflix-logo">
            <span />
            <span />
          </div>

          <h3 className={bebasNeue.className}>Plexflix</h3>

          <div className="app-shortcuts">
            <ServiceButtons onClick={onOpenIframe} />
          </div>
        </div>
      ) : null}

      {iframes.map(iframe => (
        <iframe
          key={iframe.service}
          className={`iframe iframe-${iframe.service}${selectedIframe === iframe.service ? '' : ' hidden'}`}
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
}
