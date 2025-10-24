
import React from 'react';
import type { Page } from './types';

export const ChartBarIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

export const Cog6ToothIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.962a8.97 8.97 0 015.724 5.724c.046.55-.422 1.02-.962 1.11-.341.055-.65.215-.91.439l-1.06 1.06c-.266.266-.42.61-.42 1.003v.284c0 .414.172.786.42 1.068l.96.96c.267.266.61.42 1.003.42h.283c.414 0 .786-.172 1.068-.42l1.06-1.06c.224-.224.384-.57.439-.91.046-.55.562-1.02.962-1.11a8.97 8.97 0 015.724 5.724c.046.55-.422 1.02-.962 1.11-.341.055-.65.215-.91.439l-1.06 1.06c-.266.266-.42.61-.42 1.003v.284c0 .414.172.786.42 1.068l.96.96c.267.266.61.42 1.003.42h.283c.414 0 .786-.172 1.068-.42l1.06-1.06c.224-.224.384-.57.439-.91.046-.55.562-1.02.962-1.11a8.97 8.97 0 01-5.724-5.724c-.046-.55.422-1.02 1.11-.962.341-.055.65-.215.91-.439l1.06-1.06c.266-.266.42-.61.42-1.003v-.284c0-.414-.172-.786-.42-1.068l-.96-.96a1.492 1.492 0 00-1.003-.42h-.283c-.414 0-.786.172-1.068.42l-1.06 1.06c-.224.224-.384.57-.439.91-.046.55-.562 1.02-1.11.962a8.97 8.97 0 01-5.724-5.724c-.046-.55.422-1.02.962-1.11.341-.055.65-.215.91-.439l1.06-1.06c.266-.266.42-.61.42-1.003v-.284c0-.414-.172-.786-.42-1.068l-.96-.96a1.492 1.492 0 00-1.003-.42h-.283c-.414 0-.786.172-1.068.42l-1.06 1.06c-.224.224-.384-.57-.439-.91z" />
  </svg>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
    </svg>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
    </svg>
);

export const PlusCircleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const UserGroupIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.51.056 1.02.086 1.5.086 1.83 0 3.59-.38 5.25-1.055m-5.25-.512c.267-.287.524-.593.77-1.055m-7.5-2.962c.51.056 1.02.086 1.5.086 1.83 0 3.59-.38 5.25-1.055m-5.25-.512c.267-.287.524-.593.77-1.055m-1.5 5.545c-3.141-1.352-5.25-4.586-5.25-8.161 0-3.182 1.55-6.035 4.097-7.632L12 3c2.548 1.597 4.097 4.45 4.097 7.632 0 3.575-2.109 6.809-5.25 8.161z" />
    </svg>
);

export const WrenchScrewdriverIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.528-1.023.895-2.158.9-3.328A7.5 7.5 0 005.126 5.126c-1.17.005-2.305.372-3.328.9L3 6.63m11.42 8.54l-11-11" />
    </svg>
);

export interface NavItem {
  id: Page;
  label: string;
  icon: React.FC<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'visualization', label: 'Visualização', icon: ChartBarIcon },
  { id: 'settings', label: 'Configurações', icon: Cog6ToothIcon },
];
