import { css } from 'styled-system/css';
import Image from 'next/image';

const appButtonStyle = css.raw({
  display: 'flex',
  borderRadius: '0.5em',
  border: '3px solid transparent',
  backgroundColor: 'transparent',
  overflow: 'auto',
  opacity: 0,
  transform: 'translateY(20px)',
  animation: 'appearAnimation 0.15s ease-in-out forwards',
  animationDelay: 'calc(0.5s + 0.08s * var(--pos))',
  _hover: {
    borderColor: 'red2',
  },
});

export default function ServiceButtons({ onClick }: { onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <>
      <button className={css({ '--pos': 0 }, appButtonStyle)} onClick={onClick} data-service="plex">
        <Image
          src="/plex.svg"
          width={52}
          height={52}
          alt="Plex"
        />
      </button>

      <button className={css({ '--pos': 1 }, appButtonStyle)} onClick={onClick} data-service="overseerr">
        <Image
          src="/overseerr.svg"
          width={52}
          height={52}
          alt="Overseerr"
        />
      </button>

      <button className={css({ '--pos': 2 }, appButtonStyle)} onClick={onClick} data-service="radarr">
        <Image
          src="/radarr.svg"
          width={52}
          height={52}
          alt="Radarr"
        />
      </button>

      <button className={css({ '--pos': 3 }, appButtonStyle)} onClick={onClick} data-service="sonarr">
        <Image
          src="/sonarr.svg"
          width={52}
          height={52}
          alt="Sonarr"
        />
      </button>

      <button className={css({ '--pos': 4 }, appButtonStyle)} onClick={onClick} data-service="prowlarr">
        <Image
          src="/prowlarr.svg"
          width={52}
          height={52}
          alt="Prowlarr"
        />
      </button>

      <button className={css({ '--pos': 5 }, appButtonStyle)} onClick={onClick} data-service="qbittorrent">
        <Image
          src="/qbittorrent.svg"
          width={52}
          height={52}
          alt="qBittorrent"
        />
      </button>

      <button className={css({ '--pos': 6 }, appButtonStyle)} onClick={onClick} data-service="joal">
        <Image
          src="/joal.64x64.png"
          width={52}
          height={52}
          alt="JOAL"
        />
      </button>

      <button className={css({ '--pos': 6 }, appButtonStyle)} onClick={onClick} data-service="tautulli">
        <Image
          src="/tautulli.svg"
          width={52}
          height={52}
          alt="Tautulli"
        />
      </button>
    </>
  );
}
