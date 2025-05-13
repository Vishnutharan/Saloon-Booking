import { Component, OnInit, HostListener, ElementRef } from '@angular/core';

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  features: string[];
}

interface Testimonial {
  id: number;
  name: string;
  image: string;
  rating: number;
  comment: string;
  service: string;
}

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  bio: string;
  specialties: string[];
}

interface PricingItem {
  id: number;
  name: string;
  service: string;
  price: string;
  description: string;
  features: string[];
}

interface BlogPost {
  title: string;
  date: string;
  image: string;
  excerpt: string;
  category: string;
  author: string;
}

@Component({
  selector: 'app-saloon-home',
  templateUrl: './saloon-home.component.html',
  styleUrls: ['./saloon-home.component.css']
})
export class SaloonHomeComponent implements OnInit {
  scrolled = false;
  showMobileMenu = false;
  activeTestimonialIndex = 0;
  testimonialInterval: any;
  showBookingModal = false;
  showBackToTop = false;
  currentYear: number = new Date().getFullYear();

  services: Service[] = [
    {
      id: 1,
      name: 'Haircut & Styling',
      description: 'Expert haircuts and styling services tailored to your unique look and preferences.',
      price: '$45+',
      image: 'assets/saloon4.png',
      features: ['Consultation', 'Wash', 'Cut', 'Style', 'Product Recommendations']
    },
    {
      id: 2,
      name: 'Hair Coloring',
      description: 'Professional hair coloring services including highlights, balayage, and full color treatments.',
      price: '$85+',
      image: 'assets/saloon6.png',
      features: ['Color Consultation', 'Custom Color Mix', 'Treatment', 'Style', 'Aftercare Tips']
    },
    {
      id: 3,
      name: 'Facial Treatments',
      description: 'Revitalizing facial treatments to rejuvenate your skin and leave you glowing.',
      price: '$70+',
      image: 'assets/saloon5.png',
      features: ['Skin Analysis', 'Deep Cleansing', 'Exfoliation', 'Mask', 'Moisturizing']
    },
    {
      id: 4,
      name: 'Manicure & Pedicure',
      description: 'Complete nail care services for beautiful, healthy nails.',
      price: '$55+',
      image: 'assets/saloon2.png',
      features: ['Soak', 'Shape', 'Cuticle Care', 'Polish', 'Hand/Foot Massage']
    },
    {
      id: 5,
      name: 'Hair Extensions',
      description: 'High-quality hair extensions for added length and volume.',
      price: '$150+',
      image: 'assets/saloon1.png',
      features: ['Consultation', 'Custom Color Match', 'Application', 'Styling', 'Maintenance Guide']
    },
    {
      id: 6,
      name: 'Bridal Packages',
      description: 'Complete bridal beauty packages for your special day.',
      price: '$250+',
      image: 'assets/saloon6.png',
      features: ['Trial Session', 'Hair Styling', 'Makeup', 'Manicure', 'Touch-up Kit']
    }
  ];

  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      image: 'assets/saloon4.png',
      rating: 5,
      comment: 'Absolutely love this salon! The staff is professional and my hair has never looked better. Highly recommend!',
      service: 'Haircut & Styling'
    },
    {
      id: 2,
      name: 'Michael Thompson',
      image: 'assets/saloon5.png',
      rating: 5,
      comment: 'Great atmosphere and amazing service. My go-to place for haircuts and styling!',
      service: 'Hair Coloring'
    },
    {
      id: 3,
      name: 'Jennifer Davis',
      image: 'assets/saloon6.png',
      rating: 4,
      comment: 'The facial treatment was incredibly relaxing and my skin looks rejuvenated. Will definitely return!',
      service: 'Facial Treatment'
    },
    {
      id: 4,
      name: 'Robert Wilson',
      image: 'assets/saloon7.png',
      rating: 5,
      comment: 'Professional service and stunning results. The staff really knows what they are doing.',
      service: 'Hair Extensions'
    }
  ];

  galleryImages: GalleryImage[] = [
    { src: 'assets/saloon1.png', alt: 'Chic Bob Haircut', category: 'Styling' },
    { src: 'assets/saloon2.png', alt: 'Balayage Highlights', category: 'Color' },
    { src: 'assets/saloon3.png', alt: 'Elegant Updo', category: 'Styling' },
    { src: 'assets/saloon4.png', alt: 'Relaxing Spa Room', category: 'Facial' },
    { src: 'assets/saloon5.png', alt: 'Nail Art', category: 'Nails' },
    { src: 'assets/saloon6.png', alt: 'Salon Interior', category: 'Interior' },
    { src: 'assets/saloon7.png', alt: 'Makeup Session', category: 'Makeup' },
    { src: 'assets/saloon8.png', alt: 'Customer Satisfaction', category: 'Customers' }
  ];
  filteredGalleryImages: GalleryImage[] = [];
  activeFilter = 'all';

  team: TeamMember[] = [
    {
      id: 1,
      name: 'Jessica Miller',
      position: 'Lead Stylist',
      image: 'assets/saloon8.png',
      bio: 'With over 10 years of experience, Jessica specializes in cutting-edge hairstyling and coloring techniques.',
      specialties: ['Color Expert', 'Bridal Hair']
    },
    {
      id: 2,
      name: 'David Chen',
      position: 'Senior Barber',
      image: 'assets/saloon1.png',
      bio: 'David is renowned for his exceptional barbering skills and transformative men\'s grooming.',
      specialties: ['Men\'s Cuts', 'Beard Trims']
    }
  ];

  activePricingTab = 'hair';

  hairPricing: PricingItem[] = [
    {
      id: 1,
      name: 'Women\'s Haircut',
      service: 'Women\'s Haircut & Style',
      price: '$85',
      description: 'Includes consultation, shampoo, conditioning, cut, and blow-dry style.',
      features: ['Professional Consultation', 'Luxury Wash & Condition', 'Precision Cut', 'Signature Blowout']
    },
    {
      id: 2,
      name: 'Full Balayage',
      service: 'Full Balayage',
      price: '$250+',
      description: 'Hand-painted highlights for a natural, sun-kissed look. Includes toner.',
      features: ['Custom Color Mix', 'Expert Application', 'Glossing Toner', 'Style Finish']
    }
  ];

  spaPricing: PricingItem[] = [
    {
      id: 1,
      name: 'Signature Facial',
      service: 'Signature Facial',
      price: '$120',
      description: 'A customized facial to address your specific skin concerns, leaving you radiant.',
      features: ['Skin Analysis', 'Deep Cleansing & Exfoliation', 'Custom Mask & Serum', 'Relaxing Massage']
    }
  ];

  nailPricing: PricingItem[] = [
    {
      id: 1,
      name: 'Luxury Manicure',
      service: 'Luxury Manicure',
      price: '$55',
      description: 'Indulge in a pampering manicure with exfoliation, massage, and perfect polish.',
      features: ['Nail Shaping & Cuticle Care', 'Sugar Scrub Exfoliation', 'Hand Massage', 'Choice of Polish']
    }
  ];

  blogPosts: BlogPost[] = [
    {
      title: 'Top 5 Hair Trends for this Summer',
      date: 'July 15, 2024',
      image: 'assets/saloon4.png',
      excerpt: 'Discover the hottest hairstyles and colors to rock this summer season, from beachy waves to bold pastels...',
      category: 'Trends',
      author: 'Admin'
    },
    {
      title: 'The Ultimate Skincare Routine for Glowing Skin',
      date: 'July 10, 2024',
      image: 'assets/saloon5.png',
      excerpt: 'Unlock the secrets to radiant skin with our comprehensive guide to building the perfect daily skincare regimen...',
      category: 'Skincare',
      author: 'Jane Doe'
    }
  ];

  contactFormData = {
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  };

  newsletterEmail = '';
  footerNewsletterEmail = '';

  bookingData = {
    service: '',
    stylist: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: ''
  };

  availableTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  constructor(private el: ElementRef) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
    this.showBackToTop = window.scrollY > 300;
  }

  ngOnInit(): void {
    this.startTestimonialRotation();
    this.filterGallery(this.activeFilter);
  }

  ngOnDestroy(): void {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }

  getMinBookingDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  startTestimonialRotation(): void {
    if (this.testimonials.length > 1) {
      this.testimonialInterval = setInterval(() => {
        this.nextTestimonial();
      }, 5000);
    }
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    document.body.style.overflow = this.showMobileMenu ? 'hidden' : '';
  }

  scrollToSection(sectionId: string): void {
    const element = this.el.nativeElement.querySelector(`#${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (this.showMobileMenu) {
      this.toggleMobileMenu();
    }
  }

  submitContactForm(): void {
    if (!this.contactFormData.name || !this.contactFormData.email || !this.contactFormData.phone || !this.contactFormData.service || !this.contactFormData.message) {
      alert('Please fill in all required fields for the contact form.');
      return;
    }
    console.log('Contact form submitted:', this.contactFormData);
    alert('Thank you for your message! We will get back to you soon.');
    this.resetContactForm();
  }

  resetContactForm(): void {
    this.contactFormData = {
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    };
  }

  submitNewsletter(): void {
    if (!this.newsletterEmail) {
      alert('Please enter your email to subscribe.');
      return;
    }
    console.log('Newsletter subscription:', this.newsletterEmail);
    alert(`Thank you for subscribing with ${this.newsletterEmail}!`);
    this.newsletterEmail = '';
  }

  submitFooterNewsletter(): void {
    if (!this.footerNewsletterEmail) {
      alert('Please enter your email to subscribe.');
      return;
    }
    console.log('Footer newsletter subscription:', this.footerNewsletterEmail);
    alert(`Thank you for subscribing with ${this.footerNewsletterEmail}!`);
    this.footerNewsletterEmail = '';
  }

  openBookingModal(serviceName?: string, stylistName?: string): void {
    this.resetBookingForm();
    if (serviceName) {
      this.bookingData.service = serviceName;
    }
    if (stylistName) {
      this.bookingData.stylist = stylistName;
    }
    this.showBookingModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    document.body.style.overflow = '';
  }

  submitBookingForm(): void {
    if (!this.bookingData.service || !this.bookingData.date || !this.bookingData.time || !this.bookingData.name || !this.bookingData.email || !this.bookingData.phone) {
      alert('Please fill in all required fields for booking.');
      return;
    }
    console.log('Booking submitted:', this.bookingData);
    alert('Thank you for your booking! We will confirm your appointment soon.');
    this.closeBookingModal();
  }

  resetBookingForm(): void {
    this.bookingData = {
      service: '',
      stylist: '',
      date: '',
      time: '',
      name: '',
      email: '',
      phone: '',
      notes: ''
    };
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  prevTestimonial(): void {
    this.activeTestimonialIndex = (this.activeTestimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
    this.resetTestimonialInterval();
  }

  nextTestimonial(): void {
    this.activeTestimonialIndex = (this.activeTestimonialIndex + 1) % this.testimonials.length;
    this.resetTestimonialInterval();
  }

  resetTestimonialInterval(): void {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
      this.startTestimonialRotation();
    }
  }

  filterGallery(category: string): void {
    this.activeFilter = category;
    if (category === 'all') {
      this.filteredGalleryImages = [...this.galleryImages];
    } else {
      this.filteredGalleryImages = this.galleryImages.filter(image => image.category === category);
    }
  }

  setActivePricingTab(tabId: string): void {
    this.activePricingTab = tabId;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}