"use client";

export function MapSection() {
  return (
    <section className="relative h-[400px] sm:h-[500px] w-full">
      {/* Google Maps Embed - Replace with your actual location */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.6174337119694!2d-73.98823492346435!3d40.74844097138558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Barbershop Location"
        className="grayscale"
      />
    </section>
  );
}

