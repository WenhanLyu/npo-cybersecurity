import {VirginiaMap} from '@/components/VirginiaMap';
import {VirginiaMapCityAndZipCodeFilterButton} from '@/components/MapFilter/VirginiaMapCityAndZipCodeFilterButton';
import {VirginiaMapContainer} from '@/components/VirginiaMapContainer';
import {HealthcareNteeFilterButton} from '@/components/MapFilter/HealthcareNteeFilterButton';
import {DataAndVirginiaMapContainer} from '@/components/DataAndVirginiaMapContainer';

export default function Home() {
  return (
      <div className={'flex flex-col min-h-screen'}>
        <header className={'p-6 bg-blue-500 text-white w-full'}>
          <h1 className={'text-lg font-bold'}>Virginia Map Dashboard</h1>
        </header>

        <main className={'flex-grow flex flex-col items-center p-4'}>
          <DataAndVirginiaMapContainer/>
        </main>

        <footer className={'p-6 bg-gray-800 text-white w-full text-center'}>
          <p>By Wenhan Lyu and Yimeng Wang @ 2024.</p>
        </footer>
      </div>
  );
}
