import { useState, useRef, useEffect, ReactNode } from 'react';
import BarsIcon from './BarsIcon';
import { css } from 'styled-system/css';

const BORDER_MARGIN = 35; // px
const MENU_MARGIN = 16; // px

const coverStyle = css({
  display: 'none',
  zIndex: '1000000',
  height: '100vh',
  width: '100vw',
  position: 'fixed',
  top: '0',
  left: '0',
});

export default function Menu({ children }: { children: ReactNode }) {
  const [dragTransitioning, setDragTransitioning] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const isDraggingRef = useRef(false);
  const draggableMenuRef = useRef<HTMLDivElement>(null);
  const draggableMenuButtonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  let elemX = 0;
  let elemY = 0;
  let initialX = 0;
  let initialY = 0;

  const toggleMenuVisibility = () => {
    setMenuVisible(isVisible => !isVisible);
  };

  const setDragging = (isDragging: boolean) => {
    isDraggingRef.current = isDragging;
    setDragTransitioning(!isDragging);
  };

  const dragMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setDragging(false);
    initialX = elemX = e.clientX;
    initialY = elemY = e.clientY;
    document.addEventListener('pointerup', closeDragElement);
    document.addEventListener('pointermove', elementDrag, { passive: false });
    if (coverRef.current) {
      coverRef.current.style.display = 'block';
    }
  };

  const elementDrag = (e: MouseEvent) => {
    e.preventDefault();
    const elem = draggableMenuRef.current as HTMLElement;
    const rect = elem.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const dx = elemX - e.clientX;
    const dy = elemY - e.clientY;
    elemX = e.clientX;
    elemY = e.clientY;

    if (Math.abs(initialX - elemX) > 5 || Math.abs(initialY - elemY) > 5) {
      setDragging(true);
    }

    const newLeft = elem.offsetLeft - dx;
    const newTop = elem.offsetTop - dy;

    if (newLeft < centerX - rect.width / 2) {
      elem.style.left = `${newLeft}px`;
      elem.style.right = '';
    } else {
      elem.style.left = '';
      elem.style.right = `${window.innerWidth - newLeft - rect.width}px`;
    }

    if (newTop < centerY - rect.height / 2) {
      elem.style.top = `${newTop}px`;
      elem.style.bottom = '';
    } else {
      elem.style.top = '';
      elem.style.bottom = `${window.innerHeight - newTop - rect.height}px`;
    }

    elem.style.top = newTop + 'px';
    elem.style.left = newLeft + 'px';
  };

  const closeDragElement = () => {
    document.removeEventListener('pointermove', elementDrag);
    document.removeEventListener('pointerup', closeDragElement);

    if (isDraggingRef.current) {
      setDragTransitioning(true);
    } else {
      toggleMenuVisibility();
    }

    setDragging(false);

    if (coverRef.current) {
      coverRef.current.style.display = 'none';
    }
  };

  const snapToClosestEdge = () => {
    const elem = draggableMenuRef.current as HTMLElement;
    const rect = elem.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const elemCenterX = rect.left + rect.width / 2;
    const elemCenterY = rect.top + rect.height / 2;

    const vectorX = elemCenterX - centerX;
    const vectorY = elemCenterY - centerY;

    const ratioX = vectorX === 0 ? 1 : (centerX - rect.width / 2 - BORDER_MARGIN) / Math.abs(vectorX);
    const ratioY = vectorY === 0 ? 1 : (centerY - rect.height / 2 - BORDER_MARGIN) / Math.abs(vectorY);

    const newLeft = centerX + (vectorX * ratioY) - rect.width / 2;
    const newTop = centerY + (vectorY * ratioX) - rect.height / 2;

    const correctedLeft = Math.max(BORDER_MARGIN, Math.min(window.innerWidth - rect.width - BORDER_MARGIN, newLeft));
    const correctedTop = Math.max(BORDER_MARGIN, Math.min(window.innerHeight - rect.height - BORDER_MARGIN, newTop));

    elem.style.left = `${correctedLeft}px`;
    elem.style.top = `${correctedTop}px`;

    if (correctedLeft < centerX - rect.width / 2) {
      elem.style.left = `${correctedLeft}px`;
      elem.style.right = '';
    } else {
      elem.style.left = '';
      elem.style.right = `${window.innerWidth - correctedLeft - rect.width}px`;
    }

    if (correctedTop < centerY - rect.height / 2) {
      elem.style.top = `${correctedTop}px`;
      elem.style.bottom = '';
    } else {
      elem.style.top = '';
      elem.style.bottom = `${window.innerHeight - correctedTop - rect.height}px`;
    }

    placeMenuItems();
  };

  const placeMenuItems = () => {
    const elem = draggableMenuRef.current as HTMLElement;
    const menuItems = menuItemsRef.current as HTMLElement;
    const rect = elem.getBoundingClientRect();
    const isTopHalf = rect.top + rect.height / 2 < window.innerHeight / 2;

    if (isTopHalf) {
      menuItems.style.top = (rect.height + MENU_MARGIN) + 'px';
    } else {
      menuItems.style.top = (-menuItems.offsetHeight - MENU_MARGIN) + 'px';
    }
  };

  useEffect(() => {
    const elem = draggableMenuButtonRef.current as HTMLElement;
    elem.addEventListener('pointerdown', dragMouseDown);

    return () => {
      elem.removeEventListener('pointerdown', dragMouseDown);
    };
  }, []);

  useEffect(() => {
    if (dragTransitioning) {
      snapToClosestEdge();
    }
  }, [dragTransitioning]);

  useEffect(() => {
    if (menuVisible) {
      placeMenuItems();
    }
  }, [menuVisible]);

  return (
    <>
      <div ref={coverRef} className={coverStyle} />
      <div
        ref={draggableMenuRef}
        className={css(
          {
            width: '52px',
            height: '52px',
            position: 'fixed',
            zIndex: '1000000',
            bottom: `${BORDER_MARGIN}px`,
            right: `${BORDER_MARGIN}px`,
            transition: dragTransitioning ? 'top 0.5s ease, bottom 0.5s ease, left 0.5s ease, right 0.5s ease' : '',
          },
        )}
      >
        <button
          ref={draggableMenuButtonRef}
          className={css({
            touchAction: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'whitesmoke',
            color: 'white',
            textAlign: 'center',
            borderRadius: '20em',
            border: '3px solid transparent',
            _hover: {
              borderColor: 'red2',
            },
          })}
        >
          <BarsIcon width="32" height="32" className={css({ color: 'red1' })} />
        </button>
        <div
          ref={menuItemsRef}
          className={css(
            {
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5em',
              left: '-3px',
              '& button': {
                display: 'flex',
                borderRadius: '0.5em',
                border: '3px solid transparent',
                backgroundColor: 'transparent',
                overflow: 'auto',
                _hover: {
                  borderColor: 'red2',
                },
              },
            },
            !menuVisible ? {
              visibility: 'hidden',
              position: 'fixed',
              top: 0,
              left: 0,
            } : null,
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
}
