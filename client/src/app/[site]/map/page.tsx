import { MobileSidebar } from "../../../components/MobileSidebar";
import { MapComponent } from "../components/shared/Map";
import { SubHeader } from "../components/SubHeader/SubHeader";

export default function MapPage() {
  return (
    <div className="relative w-full">
      <div className="p-4">
        <SubHeader />
      </div>
      <MapComponent height="calc(100vh - 45px - 76px)" />
    </div>
  );
}
