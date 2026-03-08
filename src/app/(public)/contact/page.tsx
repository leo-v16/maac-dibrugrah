import ContactSection from '@/components/sections/ContactSection';
import MapSection from '@/components/sections/MapSection';
import { settingsService } from '@/services/settingsService';

export default async function ContactPage() {
  const settings = await settingsService.getSettings();

  return (
    <div className="pt-24 min-h-screen bg-obsidian-black flex flex-col">
      <ContactSection settings={settings} />
      <MapSection 
        address={settings.contactAddress}
        operatingHours={settings.operatingHours}
      />
    </div>
  );
}
