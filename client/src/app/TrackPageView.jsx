// src/TrackPageView.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TrackPageView = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-SDNMT6D88C', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);

  return null;
};

export default TrackPageView;