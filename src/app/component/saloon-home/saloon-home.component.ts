import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-saloon-home',
  templateUrl: './saloon-home.component.html',
  styleUrls: ['./saloon-home.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({
        opacity: 0
      })),
      transition('void => *', [
        animate('0.5s ease-in')
      ]),
    ]),
    trigger('slideIn', [
      state('void', style({
        transform: 'translateY(50px)',
        opacity: 0
      })),
      transition('void => *', [
        animate('0.6s ease-out')
      ]),
    ])
  ]
})
export class SaloonHomeComponent implements OnInit {
  scrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }

  services = [
    {
      id: 1,
      name: 'Haircut & Styling',
      description: 'Expert haircuts and styling services tailored to your unique look and preferences.',
      price: '$45+',
      image: '/assets/saloon4.png'
    },
    {
      id: 2,
      name: 'Hair Coloring',
      description: 'Professional hair coloring services including highlights, balayage, and full color treatments.',
      price: '$85+',
      image: '/assets/saloon6.png'
    },
    {
      id: 3,
      name: 'Facial Treatments',
      description: 'Revitalizing facial treatments to rejuvenate your skin and leave you glowing.',
      price: '$70+',
      image: '/assets/saloon5.png'
    },
    {
      id: 4,
      name: 'Manicure & Pedicure',
      description: 'Complete nail care services for beautiful, healthy nails.',
      price: '$55+',
      image: '/assets/saloon2.png'
    },
    {
      id: 5,
      name: 'Hair Extensions',
      description: 'High-quality hair extensions for added length and volume.',
      price: '$150+',
      image: '/assets/saloon1.png'
    },
    {
      id: 6,
      name: 'Bridal Packages',
      description: 'Complete bridal beauty packages for your special day.',
      price: '$250+',
      image: '/assets/saloon6.png'
    }
  ];

  testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      image: '/assets/saloon4.png',
      rating: 5,
      comment: 'Absolutely love this salon! The staff is professional and my hair has never looked better. Highly recommend!'
    },
    {
      id: 2,
      name: 'Michael Thompson',
      image: '/assets/saloon5.png',
      rating: 5,
      comment: 'Great atmosphere and amazing service. My go-to place for haircuts and styling!'
    },
    {
      id: 3,
      name: 'Jennifer Davis',
      image: '/assets/saloon6.png',
      rating: 4,
      comment: 'The facial treatment was incredibly relaxing and my skin looks rejuvenated. Will definitely return!'
    },
    {
      id: 4,
      name: 'Robert Wilson',
      image: '/assets/saloon7.png',
      rating: 5,
      comment: 'Professional service and stunning results. The staff really knows what they redoing'
    }
  ];

  galleryImages = [
    { src: '/assets/saloon1.png', alt: 'Salon Interior' },
    { src: '/assets/saloon2.png', alt: 'Hair Styling' },
    { src: '/assets/saloon3.png', alt: 'Makeup Session' },
    { src: '/assets/saloon4.png', alt: 'Nail Art' },
    { src: '/assets/saloon5.png', alt: 'Hair Coloring' },
    { src: '/assets/saloon6.png', alt: 'Facial Treatment' },
    { src: '/assets/saloon7.png', alt: 'Salon Equipment' },
    { src: '/assets/saloon8.png', alt: 'Customer Satisfaction' }
  ];

  team = [
    {
      name: 'Emma Roberts',
      position: 'Master Stylist',
      image: '/assets/saloon8.png',
      bio: 'With over 10 years of experience, Emma specializes in cutting-edge hairstyling and coloring techniques.'
    },
    {
      name: 'David Miller',
      position: 'Color Specialist',
      image: '/assets/saloon7.png',
      bio: 'David is renowned for his exceptional color work and transformative hair makeovers.'
    },
    {
      name: 'Jessica Chen',
      position: 'Nail Artist',
      image: '/assets/saloon6.png',
      bio: 'Jessica brings creativity and precision to every nail treatment, specializing in unique nail art designs.'
    },
    {
      name: 'Marcus Johnson',
      position: 'Skin Care Specialist',
      image: '/assets/saloon5.png',
      bio: 'Marcus is certified in advanced facial treatments and dedicated to helping clients achieve their best skin.'
    }
  ];

  activeTestimonialIndex = 0;
  showMobileMenu = false;

  ngOnInit(): void {
    this.rotateTestimonials();
  }

  rotateTestimonials(): void {
    setInterval(() => {
      this.activeTestimonialIndex = (this.activeTestimonialIndex + 1) % this.testimonials.length;
    }, 5000);
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    this.showMobileMenu = false;
  }
  
  // Contact form functions
  formData = {
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  };

  submitForm(): void {
    // Here you'd typically send the form data to a backend service
    console.log('Form submitted:', this.formData);
    alert('Thank you for your message! We will get back to you soon.');
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    };
  }

  // Function to generate star rating display
  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
