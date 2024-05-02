import { useState } from 'react';
import { css } from 'styled-system/css';
import { flex } from 'styled-system/patterns';
import BarsIcon from '../BarsIcon';

const labelStyle = flex.raw({
  flex: '0 0 10rem',
  justifyContent: 'flex-end',
  mr: 3,
  fontWeight: 'bold',
});

const fuckCursorStyle = css.raw({
  cursor: 'url(\'/fuck.cur\'), pointer',
  _active: {
    cursor: 'url(\'/fuck-grab.cur\'), pointer',
  },
});

const itemStyle = css.raw({
  border: '1px solid token(colors.red2)',
  borderRadius: 4,
  px: 2,
  py: 1,
}, flex.raw({ direction: 'row', justify: 'space-between', align: 'center' }));

const profileTest = {
  name: '',
  qualities: ['2160p', '1080p'],
  languages: [{
    code: 'FR',
    frenchAudioVersions: [
      {
        acronym: 'VOF',
        enabled: true
      },
      {
        acronym: 'VFF',
        enabled: true
      },
      {
        acronym: 'VF',
        enabled: false,
      },
      {
        acronym: 'VFI',
        enabled: false,
      },
      {
        acronym: 'VF2',
        enabled: false,
      },
      {
        acronym: 'VFQ',
        enabled: false,
      },
      {
        acronym: 'VOQ',
        enabled: false,
      },
      {
        acronym: 'VQ',
        enabled: false,
      },
      {
        acronym: 'VFB',
        enabled: false,
      },
      {
        acronym: 'VOSTFR',
        enabled: false,
      }
    ],
  }],
};

function Profile({ profile, onChange }: any) {
  const qualities = new Set([...profile.qualities ?? [], '2160p', '1080p']);

  return (
    <li
      className={flex({
        direction: 'column',
        gap: 6,
        borderLeft: '2px solid token(colors.red2)',
        borderRadius: 4,
      })}
    >
      <div className={flex()}>
        <label className={css(labelStyle)}>
          Qualities
        </label>
        <div
          className={flex({
            flexDir: 'column',
            flexGrow: 1,
            gap: 2,
          })}
        >
          <label className={css(fuckCursorStyle, itemStyle)}>
            <div>
              <input type="checkbox" className={css({ cursor: 'inherit' })} /> 2160p
            </div>
            <BarsIcon width="16" height="16" className={css({ color: 'red1' })} />
          </label>
          <label className={css(fuckCursorStyle, itemStyle)}>
            <div>
              <input type="checkbox" className={css({ cursor: 'inherit' })} /> 1080p
            </div>
            <BarsIcon width="16" height="16" className={css({ color: 'red1' })} />
          </label>
        </div>
      </div>

      <div className={flex()}>
        <label className={css(labelStyle)}>
          Languages
        </label>
        <div className={flex({ grow: 1, direction: 'column', gap: 2 })}>
          <div className={css(itemStyle)}>
            French
            <BarsIcon width="16" height="16" className={css({ color: 'red1' })} />
          </div>
          <div className={css(itemStyle)}>
            English
            <BarsIcon width="16" height="16" className={css({ color: 'red1' })} />
          </div>

          <div className={flex({ direction: 'row', gap: 4 })}>
            <select className={css({ color: 'black', w: 'full' })}>
              <option value="" disabled selected hidden>Select a language</option>
              <option value="FR">French</option>
            </select>
            <button className={css({ border: '1px solid token(colors.red2)', px: 2, borderRadius: 2 })}>
              Add
            </button>
          </div>
        </div>
      </div>

      <div className={flex()}>
        <label className={css(labelStyle)}>
          Name
        </label>
        <input defaultValue="FR HD" className={css({ color: 'black', flexGrow: 1 })} />
      </div>
    </li>
  );
}

export default function Settings() {
  const [profiles, setProfiles] = useState([{}]);

  return (
    <main
      className={css({
        color: 'white',
        border: '3px solid token(colors.red2)',
        borderRadius: 8,
        p: 4,
        minW: 'xl',
      })}
    >
      <div className={flex({ direction: 'column' })}>
        <div className={flex({ justify: 'space-between', borderBottom: '1px solid white', pb: 4 })}>
          <div>Profiles</div>
          <button>Add a profile</button>
        </div>

        <ul className={css({ pt: 4, display: 'flex', flexDirection: 'column', gap: 8 })}>
          {profiles.map((profile, index) => (
            <Profile key={index} profile={profile} onChange={() => {}} />
          ))}
        </ul>
      </div>
    </main>
  );
}
