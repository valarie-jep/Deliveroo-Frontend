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
          <a href="#" className={styles.footerLink}>Facebook</a>
          <a href="#" className={styles.footerLink}>Twitter</a>
          <a href="#" className={styles.footerLink}>Instagram</a>
        </div>
      </div>
      <div className={styles.footerLinks}>
        <div className={styles.footerLinksCol}>
          <div className={styles.footerLinksTitle}>Company</div>
          <a href="#" className={styles.footerLink}>About</a>
          <a href="#" className={styles.footerLink}>Careers</a>
          <a href="#" className={styles.footerLink}>Blog</a>
        </div>
        <div className={styles.footerLinksCol}>
          <div className={styles.footerLinksTitle}>Support</div>
          <a href="#" className={styles.footerLink}>Help Center</a>
          <a href="#" className={styles.footerLink}>Contact Us</a>
          <a href="#" className={styles.footerLink}>FAQs</a>
        </div>
      </div>
    </div>
    <div className={styles.footerBottom}>
      &copy; {new Date().getFullYear()} Deliveroo. All rights reserved.
    </div>
  </footer>
);

export default Footer;