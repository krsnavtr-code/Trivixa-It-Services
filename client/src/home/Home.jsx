import React from 'react';
import SEO from '../components/SEO';
import Banner from '../components/Banner';
import Categories from '../components/home/Categories';
import PopularCourses from '../components/home/PopularCourses';
import FeaturedBooks from '../components/home/FeaturedBooks';
import Stats from '../components/home/Stats';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';
import ContactSection from '../components/home/ContactSection';
import WhyLearnWithFirstVITE from '../components/home/WhyLearnWithFirstVITE';
import HowWillYourTrainingWork from '../components/home/HowWillYourTrainingWork';
import Content from '../components/home/Content';

function Home() {
  return (
    <>
      <SEO
        title="Trivixa IT Solution - Software & Website Development Company"
        description="Trivixa IT Solution provides professional website development, custom software solutions, mobile app development, and IT services to help businesses grow digitally."
        keywords="Trivixa IT Solution, software company, website development, IT services, web development company, custom software, mobile app development, digital solutions"
        og={{
          title: "Trivixa IT Solution - Build Smart Digital Solutions",
          description:
            "We help startups and businesses with modern websites, scalable software, mobile applications, and complete IT solutions tailored to your business needs.",
          type: "website",
          image: "https://trivixa.in/images/trivixa-og.png",
        }}
      />

      <div className="flex flex-col min-h-screen">
        {/* Hero Banner */}
        <Banner />

        {/* Categories Section */}
        <Categories />

        {/* Popular Courses */}
        <PopularCourses />

        {/* Featured Books */}
        {/* <FeaturedBooks /> */}

        {/* Why learn with FirstVITE? */}
        <WhyLearnWithFirstVITE />

        {/* How will your training work */}
        <HowWillYourTrainingWork />

        {/* Stats Section */}
        <Stats />

        {/* Content */}
        <Content />

        {/* Testimonials */}
        <Testimonials />

        {/* Newsletter */}
        <Newsletter />

        {/* Contact Section */}
        <ContactSection />

        {/* You can uncomment this if you want to include the Freebook component */}
        {/* <Freebook /> */}
      </div>
    </>
  );
}

export default Home;
