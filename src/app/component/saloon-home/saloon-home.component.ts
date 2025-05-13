// saloon-home.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';

interface Service {
  name: string;
  description: string;
  price: string;
  icon: string; // Font Awesome icon class e.g., 'fas fa-cut'
}

interface GalleryImage {
  src: string;
  alt: string;
  category: string; // e.g., 'hair', 'makeup', 'nails'
}

interface Review {
  name: string;
  stars: number;
  comment: string;
  imageSrc?: string; // Optional image for the reviewer
}

@Component({
  selector: 'app-saloon-home',
  templateUrl: './saloon-home.component.html',
  styleUrls: ['./saloon-home.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('0.7s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('staggerIn', [
      transition('* => *', [ // each time the binding value changes
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger('100ms', [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class SaloonHomeComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  currentYear: number = new Date().getFullYear();
  activeGalleryFilter = 'all';

  services: Service[] = [
    { name: 'Haircut & Styling', description: 'Precision cuts and latest styling trends for all hair types.', price: '$50+', icon: 'fas fa-cut' },
    { name: 'Hair Coloring', description: 'Vibrant colors, highlights, and balayage by expert colorists.', price: '$80+', icon: 'fas fa-palette' },
    { name: 'Manicure & Pedicure', description: 'Pamper your hands and feet with our luxurious treatments.', price: '$40+', icon: 'fas fa-hand-sparkles' },
    { name: 'Facials', description: 'Rejuvenating facials tailored to your skin type and concerns.', price: '$70+', icon: 'fas fa-spa' },
    { name: 'Makeup Artistry', description: 'Professional makeup for special occasions or a glamorous look.', price: '$60+', icon: 'fas fa-magic' },
    { name: 'Waxing Services', description: 'Smooth and gentle waxing for all areas of the body.', price: '$30+', icon: 'fas fa-leaf' }
  ];

  galleryImages: GalleryImage[] = [
    { src: 'assets/images/gallery/hair_1.jpg', alt: 'Hair Style 1', category: 'hair' },
    { src: 'assets/images/gallery/makeup_1.jpg', alt: 'Makeup Artistry 1', category: 'makeup' },
    { src: 'assets/images/gallery/nails_1.jpg', alt: 'Nail Art 1', category: 'nails' },
    { src: 'assets/images/gallery/hair_2.jpg', alt: 'Hair Style 2', category: 'hair' },
    { src: 'assets/images/gallery/spa_1.jpg', alt: 'Spa Treatment', category: 'spa' },
    { src: 'assets/images/gallery/makeup_2.jpg', alt: 'Makeup Artistry 2', category: 'makeup' },
    { src: 'assets/images/gallery/nails_2.jpg', alt: 'Nail Art 2', category: 'nails' },
    { src: 'assets/images/gallery/hair_3.jpg', alt: 'Hair Style 3', category: 'hair' },
  ];

  filteredGalleryImages: GalleryImage[] = this.galleryImages;

  reviews: Review[] = [
    { name: 'Jessica M.', stars: 5, comment: 'Absolutely loved my new haircut! The stylist was so attentive and skilled. I feel like a new person!', imageSrc: 'assets/images/reviews/client1.jpg' },
    { name: 'David K.', stars: 4, comment: 'Great atmosphere and professional service. My facial was incredibly relaxing. Will be back.', imageSrc: 'assets/images/reviews/client2.jpg' },
    { name: 'Sarah L.', stars: 5, comment: 'The best manicure I\'ve ever had! The attention to detail was amazing. Highly recommend this place.', imageSrc: 'assets/images/reviews/client3.jpg' },
    { name: 'Michael B.', stars: 5, comment: 'Fantastic coloring job! They understood exactly what I wanted and delivered perfectly. The salon is beautiful too.' },
  ];

  constructor() { }

  ngOnInit(): void {
    // You can add initialization logic here if needed
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (this.isMobileMenuOpen) {
        this.toggleMobileMenu();
      }
    }
  }

  filterGallery(category: string): void {
    this.activeGalleryFilter = category;
    if (category === 'all') {
      this.filteredGalleryImages = this.galleryImages;
    } else {
      this.filteredGalleryImages = this.galleryImages.filter(image => image.category === category);
    }
  }

  getStarArray(stars: number): any[] {
    return Array(stars);
  }
  getEmptyStarArray(stars: number): any[] {
    return Array(5 - stars);
  }

  // Form submission simulation
  submitContactForm(event: Event, form: any): void {
    event.preventDefault(); // Prevent actual form submission
    if (form.valid) {
      console.log('Form Data:', form.value);
      alert('Thank you for your message! We will get back to you soon.');
      form.reset(); // Reset the form
    } else {
      alert('Please fill out all required fields.');
    }
  }
}