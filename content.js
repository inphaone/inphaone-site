/*
  INPHA ONE · site content
  This is the one file to edit for everyday updates.
  Shows sort themselves: anything dated today or later is "upcoming", the rest is "past".
  Dates are YYYY-MM-DD.
*/
window.SITE = {

  hero: {
    tag: "SIGNAL 01 · SYDNEY",
    headline: "NEW ALBUM · 2027"
  },

  // Featured release in CH 01
  featured: {
    title: "NORTH STAR",
    meta: "Single · 2024"
  },

  // Tape index, newest first
  releases: [
    { title: "North Star",         meta: "Single 2024" },
    { title: "Grey Days",          meta: "Single 2024" },
    { title: "Wasteland",          meta: "Single 2024" },
    { title: "Lights and Shapes",  meta: "EP 2023" },
    { title: "In Phaneron of One", meta: "Album 2019" }
  ],

  // CH 02 video. id is the part after youtu.be/
  video: {
    id: "W3c4xrvIa-o",
    title: "INDUSTRY 62"
  },

  // CH 03 shows
  shows: [
    {
      date: "2026-06-20",
      event: "The Prog Prom",
      venue: "Burdekin Hotel, Sydney",
      with: "Monstera, Blackened Rose, Paint the Air",
      tickets: ""
    }
  ],

  // CH 05 email sign-up. Paste the Kit form id here once the Kit account exists.
  // While it is empty, the form falls back to opening an email to the band.
  kitFormId: "",

  links: {
    spotify:   "https://open.spotify.com/artist/0F5VMlDz3p1ZcUj0ktYers",
    youtube:   "https://www.youtube.com/@inphaone",
    instagram: "https://instagram.com/inpha_one",
    facebook:  "https://www.facebook.com/InphaOne/",
    email:     "inphaone@gmail.com"
  }
};
