import Card from 'react-bootstrap/Card';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {currentYear} All rights reserved.</p>
      </div>
    </footer>
  );
};