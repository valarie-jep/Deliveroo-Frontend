import React from 'react';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerMain}>
      <div>
        <div className={styles.footerBrand}>Deliveroo</div>
        <p className={styles.footerDesc}>
          Deliveroo is your trusted partner for fast, reliable, and affordable deliveries. Join thousands of happy customers today!
        </p>
        <div className={styles.footerSocial}>
          <a href="https://facebook.com" className={styles.footerLink} target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" className={styles.footerLink} target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" className={styles.footerLink} target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      <div className={styles.footerLinks}>
        <div className={styles.footerLinksCol}>
          <div className={styles.footerLinksTitle}>Company</div>
          <a href="/about" className={styles.footerLink}>About</a>
          <a href="/careers" className={styles.footerLink}>Careers</a>
          <a href="/blog" className={styles.footerLink}>Blog</a>
        </div>
        <div className={styles.footerLinksCol}>
          <div className={styles.footerLinksTitle}>Support</div>
          <a href="/help" className={styles.footerLink}>Help Center</a>
          <a href="/contact" className={styles.footerLink}>Contact Us</a>
          <a href="/faqs" className={styles.footerLink}>FAQs</a>
        </div>
      </div>
    </div>
    <div className={styles.footerBottom}>
      &copy; {new Date().getFullYear()} Deliveroo. All rights reserved.
    </div>
  </footer>
);

export default Footer;
