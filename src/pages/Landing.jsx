import React from 'react';
import styles from './Landing.module.css';

const BoxIcon = () => (
  <span className={styles.iconCircle}>
    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#FF5A1F" strokeWidth="2">
      <rect x="4" y="7" width="16" height="10" rx="2" stroke="#FF5A1F" strokeWidth="2" fill="none"/>
      <path d="M4 7l8 5 8-5" stroke="#FF5A1F" strokeWidth="2" fill="none"/>
    </svg>
  </span>
);
const LocationIcon = () => (
  <span className={styles.iconCircle}>
    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#FF5A1F" strokeWidth="2">
      <path d="M12 21s-6-5.686-6-10A6 6 0 0118 11c0 4.314-6 10-6 10z" stroke="#FF5A1F" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="11" r="2" fill="none" stroke="#FF5A1F" strokeWidth="2"/>
    </svg>
  </span>
);
const XIcon = () => (
  <span className={styles.iconCircle}>
    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#FF5A1F" strokeWidth="2">
      <line x1="7" y1="7" x2="17" y2="17" stroke="#FF5A1F" strokeWidth="2"/>
      <line x1="17" y1="7" x2="7" y2="17" stroke="#FF5A1F" strokeWidth="2"/>
    </svg>
  </span>
);
const DocIcon = () => (
  <span className={styles.iconCircle}>
    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#FF5A1F" strokeWidth="2">
      <rect x="6" y="4" width="12" height="16" rx="2" stroke="#FF5A1F" strokeWidth="2" fill="none"/>
      <line x1="9" y1="8" x2="15" y2="8" stroke="#FF5A1F" strokeWidth="2"/>
      <line x1="9" y1="12" x2="15" y2="12" stroke="#FF5A1F" strokeWidth="2"/>
      <line x1="9" y1="16" x2="13" y2="16" stroke="#FF5A1F" strokeWidth="2"/>
    </svg>
  </span>
);
const UserPlusIcon = () => (
  <span className={styles.iconCircle}>
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
      <circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="2" fill="none"/>
      <path d="M4 20v-1a4 4 0 014-4h4a4 4 0 014 4v1" stroke="#fff" strokeWidth="2" fill="none"/>
      <line x1="19" y1="8" x2="19" y2="14" stroke="#fff" strokeWidth="2"/>
      <line x1="16" y1="11" x2="22" y2="11" stroke="#fff" strokeWidth="2"/>
    </svg>
  </span>
);
const CheckIcon = () => (
  <span className={styles.iconCircle}>
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
      <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" fill="none"/>
      <path d="M8 12l3 3 5-5" stroke="#fff" strokeWidth="2" fill="none"/>
    </svg>
  </span>
);

const features = [
  {
    icon: <BoxIcon />,
    title: 'Create & Track Orders',
    desc: 'Easily create delivery orders and track them in real time from pickup to drop-off.'
  },
  {
    icon: <LocationIcon />,
    title: 'Edit Destination Anytime',
    desc: 'Change delivery address on the go. Our flexible system allows destination changes before the parcel reaches the final location.'
  },
  {
    icon: <XIcon />,
    title: 'Cancel Before Delivery',
    desc: 'Changed your mind? Cancel any order before it is picked up, no questions asked.'
  },
  {
    icon: <DocIcon />,
    title: 'Real-Time Order Details',
    desc: 'Get notified instantly about your order\'s progress and delivery status.'
  },
];

const steps = [
  { icon: <UserPlusIcon />, title: 'Create Account', desc: 'Sign up in minutes and verify your account to start shipping immediately.' },
  { icon: <BoxIcon />, title: 'Make Order', desc: 'Enter pickup and delivery details, package information, and schedule your delivery.' },
  { icon: <LocationIcon />, title: 'Track in Real-Time', desc: 'Monitor your parcel journey with live GPS tracking and delivery updates.' },
  { icon: <CheckIcon />, title: 'Parcel Delivered', desc: 'Receive confirmation with delivery photos and digital signature.' },
];

const testimonials = [
  {
    name: 'Faith Wawira',
    review: 'Deliveroo is the best! My packages always arrive on time and the tracking is super accurate.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Felix Limo',
    review: 'I love the real-time updates and the customer service is top-notch. Highly recommend!',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Faith Limo',
    review: 'Easy to use, reliable, and affordable. Deliveroo has changed how I send packages.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
];

const Landing = () => (
  <div className={styles.root}>
    <div className={`${styles.hero} ${styles.fadeIn}`}>
      <div className={styles.heroOverlay}></div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Deliver Your World with <span className={styles.orange}>Confidence</span></h1>
        <p className={styles.heroSubtitle}>Real-time tracking, super-convenient, and affordable delivery for your friends and business. Choose us and experience hassle-free service!</p>
        <form className={styles.heroForm}>
          <input type="email" placeholder="Enter your email" className={styles.heroInput} />
          <button className={styles.heroButton}>Get Started</button>
        </form>
      </div>
    </div>

    <section className={`${styles.section} ${styles.slideUp}`}>
      <div className={styles.sectionInner}>
        <h2 className={styles.sectionTitle}>Why Choose <span className={styles.orange}>Deliveroo?</span></h2>
        <p className={styles.sectionDesc}>Safe, fast, and reliable. Here's why thousands trust us for their deliveries:</p>
        <div className={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} className={`${styles.featureCard} ${styles.fadeIn}`}> 
              {f.icon}
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className={`${styles.section} ${styles.sectionGray} ${styles.slideUp}`}>
      <div className={styles.sectionInner}>
        <h2 className={styles.sectionTitle}>How it <span className={styles.orange}>Works</span></h2>
        <div className={styles.stepsFlex}>
          {steps.map((s, i) => (
            <div key={i} className={`${styles.stepCard} ${styles.fadeIn}`}> 
              {s.icon}
              <h4 className={styles.stepTitle}>{s.title}</h4>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className={`${styles.section} ${styles.slideUp}`}>
      <div className={styles.sectionInner}>
        <h2 className={styles.sectionTitle}>Trusted by <span className={styles.orange}>Thousands</span></h2>
        <p className={styles.sectionDesc}>Join the growing community of happy customers and businesses.</p>
        <div className={styles.statsFlex}>
          <div className={`${styles.statCard} ${styles.fadeIn}`}>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>Businesses</div>
          </div>
          <div className={`${styles.statCard} ${styles.fadeIn}`}>
            <div className={styles.statNumber}>10,000+</div>
            <div className={styles.statLabel}>Deliveries</div>
          </div>
          <div className={`${styles.statCard} ${styles.fadeIn}`}>
            <div className={styles.statNumber}>99.8%</div>
            <div className={styles.statLabel}>Satisfaction</div>
          </div>
        </div>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((t, i) => (
            <div key={i} className={`${styles.testimonialCard} ${styles.fadeIn}`}> 
              <img src={t.avatar} alt={t.name} className={styles.testimonialAvatar} />
              <div className={styles.stars}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j}>★</span>
                ))}
              </div>
              <p className={styles.testimonialText}>{t.review}</p>
              <div className={styles.testimonialName}>{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className={`${styles.ctaSection} ${styles.slideUp}`}>
      <div className={styles.sectionInner}>
        <h3 className={styles.ctaTitle}>Ready to Get Started?</h3>
        <form className={styles.ctaForm}>
          <input type="email" placeholder="Enter your email" className={styles.ctaInput} />
          <button className={styles.ctaButton}>Create an Account</button>
        </form>
        <p className={styles.sectionDesc}>Sign up now and experience the best delivery service for yourself!</p>
      </div>
    </section>
  </div>
);

export default Landing;