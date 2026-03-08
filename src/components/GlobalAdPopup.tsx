import { adService } from '@/services/adService';
import AdOverlay from './AdOverlay';

export default async function GlobalAdPopup() {
  const activeAd = await adService.getActiveAd();
  
  if (!activeAd) return null;

  return <AdOverlay ad={activeAd} />;
}
