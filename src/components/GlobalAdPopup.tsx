import { adService } from '@/services/adService';
import AdOverlay from './AdOverlay';

export default async function GlobalAdPopup() {
  const activeAds = await adService.getActiveAds();
  
  if (!activeAds || activeAds.length === 0) return null;

  return <AdOverlay ads={activeAds} />;
}
