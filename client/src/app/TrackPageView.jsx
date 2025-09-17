import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TrackPageView = () => {
  const location = useLocation();

  useEffect(() => {
    // Gửi sự kiện page_view khi route thay đổi
    window.gtag('config', 'G-SDNMT6D88C', {
      page_path: location.pathname + location.search,
      page_title: document.title, // Tùy chọn: thêm tiêu đề trang
    });
  }, [location]); // Chạy mỗi khi location thay đổi

  return null;
};

export default TrackPageView;