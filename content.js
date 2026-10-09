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

  // CH 01 deck: songs the yellow player steps through (Spotify track links)
  tracks: [
    { title: "NORTH STAR", meta: "Single 2024", spotify: "https://open.spotify.com/track/3OpiZ2tQIW1HNmsD6q7peV" },
    { title: "GREY DAYS",  meta: "Single 2024", spotify: "https://open.spotify.com/track/0bO1TQHN0vBCDiLoCm83M7" },
    { title: "WASTELAND",  meta: "Single 2024", spotify: "https://open.spotify.com/track/2Vqql5QgUN6DbYYOizIVxQ" }
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

  // CH 05 email sign-up. Web app link of the Google Apps Script that writes to
  // the "Inpha One fan list" sheet. While empty, the form opens an email instead.
  signupUrl: "https://script.google.com/macros/s/AKfycbxVpkRXAZafumLY0EUR-w7B3tFi-vkEx6faafqPeXACDxKsqGL89eE4mJmPR20EjJd4kg/exec",

  links: {
    spotify:   "https://open.spotify.com/artist/0F5VMlDz3p1ZcUj0ktYers",
    youtube:   "https://www.youtube.com/@inphaone",
    instagram: "https://instagram.com/inpha_one",
    facebook:  "https://www.facebook.com/InphaOne/",
    email:     "inphaone@gmail.com"
  }
};
