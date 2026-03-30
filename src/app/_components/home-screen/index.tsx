"use client";

import { SplashSection } from "./splash";
import { HomeNavbar } from "./home-navbar";
import { ParallaxSection } from "./parallax-section";
import { HomeFooter } from "./home-footer";
import { CalendarPlus, Search, ShoppingBag, MessageCircle } from "lucide-react";

export function HomeScreen() {
  return (
    <div className="w-full">
      <HomeNavbar />
      <SplashSection />

      <ParallaxSection
        id="section-01"
        counter="01 — 04"
        decoNumber="01"
        titleLine1="Agendá tu"
        titleLine2="próximo turno"
        accentLine={2}
        description="Reservá online en segundos. Elegí día, hora y servicio — sin llamadas, sin esperas."
        ctaLabel="Agendar turno"
        ctaHref="/appointments/new"
        ctaVariant="gold"
        ctaIcon={CalendarPlus}
        nextSectionId="section-02"
      />

      <ParallaxSection
        id="section-02"
        counter="02 — 04"
        decoNumber="02"
        titleLine1="Consultá"
        titleLine2="tu reserva"
        accentLine={2}
        description="¿Ya tenés turno? Revisá fecha, hora y estado de tu reserva en cualquier momento."
        ctaLabel="Ver mi turno"
        ctaHref="/appointments/get"
        ctaVariant="outline"
        ctaIcon={Search}
        bgClass="bg-[#e5e1db] dark:bg-[#1e1c19]"
        nextSectionId="section-03"
      />

      <ParallaxSection
        id="section-03"
        counter="03 — 04"
        decoNumber="03"
        titleLine1="Tienda de"
        titleLine2="insumos"
        accentLine={2}
        description="Productos profesionales para el cuidado del cabello. Envío a toda la provincia."
        ctaLabel="Ver productos"
        ctaHref="/shop"
        ctaVariant="outline"
        ctaIcon={ShoppingBag}
        nextSectionId="section-04"
      />

      <ParallaxSection
        id="section-04"
        counter="04 — 04"
        decoNumber="04"
        titleLine1="Hablá con"
        titleLine2="nosotros"
        accentLine={2}
        description="Precios, disponibilidad, dudas. Escribinos por WhatsApp y respondemos rápido."
        ctaLabel="Escribir por WhatsApp"
        ctaHref="https://wa.me/+5493794619887"
        ctaVariant="whatsapp"
        ctaIcon={MessageCircle}
        bgClass="bg-[#1a1714]"
        dark
        external
      />

      <HomeFooter />
    </div>
  );
}
