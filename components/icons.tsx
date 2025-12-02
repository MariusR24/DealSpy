
import React from 'react';

// proprietăți generice iconiță
type IconProps = React.SVGProps<SVGSVGElement>;

export const Gamepad2: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/><path d="M6 12h4m-2-2v4m5-1a1 1 0 0 0-1-1 1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1Zm3-2a1 1 0 0 0-1-1 1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1Z"/></svg>
);

export const Search: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

export const Steam: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 496" fill="currentColor" {...props}><path d="M496 248c0 102.2-63.5 188.4-152.1 223.1l-24.3-39.2c25.3-13.8 48.1-32.8 66.8-56l-98.8-31.4-16.1 51c-4.4 1.3-8.8 2.5-13.3 3.6l-16.1-50.1-101.4 31.6 30.3-100-84.6-26.1 50.1-16.1c.1-4.4.2-8.8.2-13.3 0-4.5-.1-8.9-.2-13.4l-50.1-16.1 84.6-26.1-30.3-100 101.4 31.6 16.1-50.1c4.5 1.1 9 2.3 13.3 3.6l16.1 51 98.8-31.4c-18.7-23.2-41.5-42.2-66.8-56l24.3-39.2C432.5 59.6 496 145.8 496 248zm-248-64c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm112.5 192.5c-20.1 0-36.4-16.3-36.4-36.4 0-20.1 16.3-36.4 36.4-36.4 20.1 0 36.4 16.3 36.4 36.4 0 20.1-16.3 36.4-36.4 36.4z"/></svg>
);

export const EpicGames: React.FC<IconProps> = (props) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>Epic Games</title><path d="M12.25 0C5.5 0 0 5.5 0 12.25S5.5 24.5 12.25 24.5 24.5 19 24.5 12.25 19 0 12.25 0zm.06 1.57c6.12 0 11 4.9 11 11s-4.9 11-11 11-11-4.9-11-11 4.9-11 11-11zm-2.86 3.73v11.83h1.49v-4.57h3.84v-1.49h-3.84v-4.28h4.51v-1.49h-4.51zM11.69 11h3.18v1.49h-3.18V11zm7.4 0c-1.39 0-2.42.33-2.42 1.34v4.51h1.49v-4.23c0-.3.2-.42.5-.42.3 0 .5.12.5.42v4.23h1.49v-4.51c0-1.01-1.03-1.34-2.56-1.34z"/></svg>
);

export const GOG: React.FC<IconProps> = (props) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}><title>GOG.com</title><path d="M19.124.004H4.88v4.322h9.923v4.32H4.88v4.324h9.923v4.318h4.321V4.326h4.32V.004h-4.32zM0 24h9.757V10.16H4.88v9.52h-4.88V24Z"/></svg>
);

export const Heart: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);

export const Star: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

export const Tag: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.586 2.586a2 2 0 0 0-2.828 0L2.172 10.172a2 2 0 0 0 0 2.828l7.414 7.414a2 2 0 0 0 2.828 0l7.586-7.586a2 2 0 0 0 0-2.828Z"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
);

export const X: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

export const ExternalLink: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
);

export const Bell: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);

export const Menu: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);

export const Save: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
);

export const ChevronLeft: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>
);

export const ChevronRight: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>
);

export const ChevronDown: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>
);

export const ShoppingCart: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
);
