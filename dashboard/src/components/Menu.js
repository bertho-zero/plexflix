import { useState, useRef, useEffect } from 'react';
import './menu.css';
import BarsIcon from './BarsIcon';

const BORDER_MARGIN = 35; // px
const MENU_MARGIN = 16; // px

export default function Menu({ children }) {
  const [dragTransitioning, setDragTransitioning] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const isDraggingRef = useRef(false);
  const draggableMenuRef = useRef(null);
  const draggableMenuButtonRef = useRef(null);
  const menuItemsRef = useRef(null);
  const coverRef = useRef(null);

  let elemX = 0;
  let elemY = 0;
  let initialX = 0;
  let initialY = 0;

  const toggleMenuVisibility = () => {
    setMenuVisible(isVisible => !isVisible);
  };

  const setDragging = isDragging => {
    isDraggingRef.current = isDragging;
    setDragTransitioning(!isDragging);
  }

  const dragMouseDown = (e) => {
    e.preventDefault();
    setDragging(false);
    initialX = elemX = e.clientX;
    initialY = elemY = e.clientY;
    document.addEventListener('pointerup', closeDragElement);
    document.addEventListener('pointermove', elementDrag, { passive: false });
    coverRef.current.style.display = 'block';
  };

  const elementDrag = (e) => {
    e.preventDefault();
    const elem = draggableMenuRef.current;
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

    const newLeft = draggableMenuRef.current.offsetLeft - dx;
    const newTop = draggableMenuRef.current.offsetTop - dy;

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

    draggableMenuRef.current.style.top = newTop + "px";
    draggableMenuRef.current.style.left = newLeft + "px";
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

    coverRef.current.style.display = 'none';
  };

  const snapToClosestEdge = () => {
    const elem = draggableMenuRef.current;
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
    const elem = draggableMenuRef.current;
    const menuItems = menuItemsRef.current;
    const rect = elem.getBoundingClientRect();
    const isTopHalf = rect.top + rect.height / 2 < window.innerHeight / 2;

    if (isTopHalf) {
      menuItems.style.top = (rect.height + MENU_MARGIN) + 'px';
    } else {
      menuItems.style.top = (-menuItems.offsetHeight - MENU_MARGIN) + 'px';
    }
  }

  useEffect(() => {
    const elem = draggableMenuButtonRef.current;
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
      <div ref={coverRef} className="cover" />
      <div ref={draggableMenuRef} id="draggableMenu" className={dragTransitioning ? 'draggable-transition' : ''}>
        <button ref={draggableMenuButtonRef} id="draggableMenuButton">
          <BarsIcon width="32" height="32" fill="#e61e25" />
        </button>
        <div ref={menuItemsRef} id="menuItems" className={menuVisible ? '' : 'hidden'}>
          {children}
        </div>
      </div>
    </>
  );
}
